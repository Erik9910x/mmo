// Game State Management with Challenge System

const GameState = {
    STORAGE_KEY: 'mmo_experience_state',
    INITIAL_BALANCE: 1000,

    // Default state with challenge resources
    defaultState: {
        balance: 1000,
        totalProfit: 0,
        totalLoss: 0,
        actionsCount: 0,
        transactions: [],
        balanceHistory: [1000],
        pathsTried: [],
        unlockedAchievements: [],
        sessionStarted: false,
        sessionEnded: false,

        // Challenge Resources
        currentDay: 1,
        maxDays: 7,

        // Global stress/energy system
        stress: 0,           // 0-100, increases with risky actions
        energy: 100,         // 0-100, decreases with actions

        // Strategy & Risk Scores
        strategyScore: 50,   // 0-100
        riskScore: 50,       // 0-100
        decisionsCount: 0,
        recklessDecisions: 0,
        smartDecisions: 0,

        // Achievement tracking
        highRiskSurvived: false,
        lowRiskStreak: 0,
        hadLowBalance: false,
        wentViral: false,
        bigTradeProfit: false,
        bigDropshipProfit: false,
        freelanceJobsCompleted: 0,
        survived7Days: false,
        zeroRecklessDecisions: true,

        // Best/worst tracking
        bestTrade: { amount: 0, description: '' },
        worstTrade: { amount: 0, description: '' },

        // Module-specific state
        freelance: {
            skillLevel: null,
            timeRemaining: 40,  // hours
            reputation: 100,    // 0-100
            jobsCompleted: 0,
            failed: false
        },
        affiliate: {
            platform: null,
            traffic: 0,
            ctr: 0,
            conversion: 0,
            actionsToday: 3,    // Limited daily actions
            daysActive: 0,
            deadline: 14,       // Days to show traction
            totalSpent: 0,
            failed: false
        },
        dropshipping: {
            selectedProduct: null,
            adAttempts: 5,      // Limited attempts
            refundRate: 0,
            maxRefundRate: 30,  // Fail if exceeded
            failed: false
        },
        trading: {
            mode: null,
            position: null,
            tradesRemaining: 10,    // Limited trades
            maxRiskPerTrade: 20,    // % of balance
            riskRulesBroken: 0,
            maxRuleBreaks: 3,
            failed: false
        }
    },

    state: null,

    init() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state = { ...this.defaultState, ...parsed };
                this.state.pathsTried = new Set(parsed.pathsTried || []);
            } catch (e) {
                this.reset();
            }
        } else {
            this.reset();
        }
        return this.state;
    },

    reset() {
        this.state = JSON.parse(JSON.stringify(this.defaultState));
        this.state.pathsTried = new Set();
        this.save();
        return this.state;
    },

    save() {
        const toSave = {
            ...this.state,
            pathsTried: Array.from(this.state.pathsTried)
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
    },

    // Record a decision for scoring
    recordDecision(type, riskLevel) {
        this.state.decisionsCount++;

        if (type === 'reckless') {
            this.state.recklessDecisions++;
            this.state.zeroRecklessDecisions = false;
            this.state.strategyScore = Math.max(0, this.state.strategyScore - 5);
            this.state.riskScore = Math.max(0, this.state.riskScore - 10);
        } else if (type === 'smart') {
            this.state.smartDecisions++;
            this.state.strategyScore = Math.min(100, this.state.strategyScore + 3);
            this.state.riskScore = Math.min(100, this.state.riskScore + 5);
        } else if (type === 'neutral') {
            this.state.strategyScore = Math.min(100, this.state.strategyScore + 1);
        }

        // Adjust based on risk level
        if (riskLevel === 'high') {
            this.state.stress = Math.min(100, this.state.stress + 15);
        } else if (riskLevel === 'medium') {
            this.state.stress = Math.min(100, this.state.stress + 5);
        }

        this.save();
    },

    // Consume energy for actions
    consumeEnergy(amount) {
        this.state.energy = Math.max(0, this.state.energy - amount);

        // High stress increases energy consumption
        if (this.state.stress > 70) {
            this.state.energy = Math.max(0, this.state.energy - 5);
        }

        this.save();
        return this.state.energy > 0;
    },

    // Recover energy (e.g., when "resting" or advancing day)
    recoverEnergy(amount) {
        this.state.energy = Math.min(100, this.state.energy + amount);
        this.state.stress = Math.max(0, this.state.stress - 10);
        this.save();
    },

    // Advance to next day
    advanceDay() {
        this.state.currentDay++;

        // Reset daily limits
        this.state.affiliate.actionsToday = 3;

        // Partial energy recovery
        this.recoverEnergy(30);

        // Check 7-day survival
        if (this.state.currentDay >= 7 && this.state.balance > 0) {
            this.state.survived7Days = true;
        }

        this.save();

        return this.state.currentDay <= this.state.maxDays;
    },

    // Check if any fail condition is met
    checkFailConditions() {
        const fails = [];

        // Global fails
        if (this.state.balance <= 0) {
            fails.push({ type: 'bankruptcy', message: 'Balance reached $0!' });
        }

        if (this.state.energy <= 0 && this.state.stress >= 100) {
            fails.push({ type: 'burnout', message: 'Complete burnout! Energy depleted.' });
        }

        // Freelance fails
        if (this.state.freelance.reputation <= 0 && this.state.freelance.skillLevel) {
            fails.push({ type: 'reputation', message: 'Reputation destroyed!' });
            this.state.freelance.failed = true;
        }

        if (this.state.freelance.timeRemaining <= 0 && this.state.freelance.skillLevel) {
            fails.push({ type: 'time', message: 'No time left for freelancing!' });
            this.state.freelance.failed = true;
        }

        // Affiliate fails
        if (this.state.affiliate.daysActive >= this.state.affiliate.deadline &&
            this.state.affiliate.traffic < 100 && this.state.affiliate.platform) {
            fails.push({ type: 'no_traction', message: 'Failed to gain traction before deadline!' });
            this.state.affiliate.failed = true;
        }

        // Dropshipping fails
        if (this.state.dropshipping.refundRate >= this.state.dropshipping.maxRefundRate) {
            fails.push({ type: 'refunds', message: 'Refund rate too high! Store banned.' });
            this.state.dropshipping.failed = true;
        }

        if (this.state.dropshipping.adAttempts <= 0 && this.state.balance < 50) {
            fails.push({ type: 'no_budget', message: 'No more ad budget!' });
            this.state.dropshipping.failed = true;
        }

        // Trading fails
        if (this.state.trading.riskRulesBroken >= this.state.trading.maxRuleBreaks) {
            fails.push({ type: 'rules_broken', message: 'Too many risk rule violations!' });
            this.state.trading.failed = true;
        }

        this.save();
        return fails;
    },

    // Update balance with transaction
    updateBalance(amount, description, path, riskLevel = 'medium') {
        const previousBalance = this.state.balance;
        this.state.balance += amount;
        this.state.balance = Math.max(0, Math.round(this.state.balance * 100) / 100);

        // Track profit/loss
        if (amount > 0) {
            this.state.totalProfit += amount;
            if (amount > this.state.bestTrade.amount) {
                this.state.bestTrade = { amount, description };
            }
        } else {
            this.state.totalLoss += Math.abs(amount);
            if (Math.abs(amount) > Math.abs(this.state.worstTrade.amount)) {
                this.state.worstTrade = { amount, description };
            }
        }

        this.state.actionsCount++;

        if (path) {
            this.state.pathsTried.add(path);
        }

        if (this.state.balance < 200) {
            this.state.hadLowBalance = true;
        }

        // Track risk streaks
        if (riskLevel === 'low' && amount >= 0) {
            this.state.lowRiskStreak++;
            this.recordDecision('smart', riskLevel);
        } else if (riskLevel === 'high' && amount < 0) {
            this.recordDecision('reckless', riskLevel);
        } else {
            this.state.lowRiskStreak = 0;
            this.recordDecision('neutral', riskLevel);
        }

        if (riskLevel === 'high' && amount > 0) {
            this.state.highRiskSurvived = true;
        }

        // Add transaction
        this.state.transactions.unshift({
            amount,
            description,
            path,
            timestamp: Date.now(),
            balance: this.state.balance,
            day: this.state.currentDay
        });

        if (this.state.transactions.length > 50) {
            this.state.transactions = this.state.transactions.slice(0, 50);
        }

        this.state.balanceHistory.push(this.state.balance);

        this.save();

        const newAchievements = Achievements.checkAll(this.state);
        const failConditions = this.checkFailConditions();

        return {
            previousBalance,
            newBalance: this.state.balance,
            newAchievements,
            failConditions,
            isGameOver: this.state.balance <= 0 || failConditions.length > 0
        };
    },

    getBalance() {
        return this.state.balance;
    },

    startSession() {
        this.reset();
        this.state.sessionStarted = true;
        this.save();
    },

    endSession() {
        this.state.sessionEnded = true;
        Achievements.checkAll(this.state);
        this.save();
        return this.getSessionSummary();
    },

    getSessionSummary() {
        // Calculate final scores
        const strategyScore = Math.round(this.state.strategyScore);
        const riskScore = Math.round(this.state.riskScore);

        // Overall score weighted average
        const overallScore = Math.round(
            (strategyScore * 0.4) +
            (riskScore * 0.3) +
            (Math.min(100, this.state.balance / 20) * 0.3)
        );

        return {
            finalBalance: this.state.balance,
            totalProfit: this.state.totalProfit,
            totalLoss: this.state.totalLoss,
            actionsCount: this.state.actionsCount,
            pathsTried: Array.from(this.state.pathsTried),
            bestTrade: this.state.bestTrade,
            worstTrade: this.state.worstTrade,
            unlockedAchievements: this.state.unlockedAchievements,
            balanceHistory: this.state.balanceHistory,

            // Scores
            strategyScore,
            riskScore,
            overallScore,

            // Challenge stats
            daysCompleted: this.state.currentDay,
            decisionsCount: this.state.decisionsCount,
            recklessDecisions: this.state.recklessDecisions,
            smartDecisions: this.state.smartDecisions
        };
    },

    getIncomeBreakdown() {
        const breakdown = {
            freelance: 0,
            affiliate: 0,
            dropshipping: 0,
            trading: 0
        };

        for (const tx of this.state.transactions) {
            if (tx.path && breakdown.hasOwnProperty(tx.path)) {
                breakdown[tx.path] += tx.amount;
            }
        }

        return breakdown;
    }
};

window.GameState = GameState;
