// Achievement system with challenge badges

const Achievements = {
    definitions: [
        // Challenge Badges
        {
            id: 'survive_7_days',
            name: 'Survivor',
            description: 'Survive for 7 days without going bankrupt',
            icon: '🏕️',
            condition: (state) => state.survived7Days
        },
        {
            id: 'zero_reckless',
            name: 'Disciplined Mind',
            description: 'Complete session with zero reckless decisions',
            icon: '🧘',
            condition: (state) => state.sessionEnded && state.zeroRecklessDecisions && state.decisionsCount >= 5
        },
        {
            id: 'strategic_thinker',
            name: 'Strategic Thinker',
            description: 'Achieve strategy score of 80+',
            icon: '🎯',
            condition: (state) => state.strategyScore >= 80
        },
        {
            id: 'risk_manager',
            name: 'Risk Manager',
            description: 'Achieve risk management score of 80+',
            icon: '🛡️',
            condition: (state) => state.riskScore >= 80
        },

        // Performance Badges
        {
            id: 'first_profit',
            name: 'First Profit',
            description: 'Earn your first profit from any MMO path',
            icon: '💵',
            condition: (state) => state.totalProfit > 0
        },
        {
            id: 'diversified',
            name: 'Diversified',
            description: 'Try at least 3 different MMO paths',
            icon: '🎲',
            condition: (state) => state.pathsTried.size >= 3
        },
        {
            id: 'high_risk_survivor',
            name: 'High Risk Survivor',
            description: 'Profit from a high-risk action',
            icon: '🔥',
            condition: (state) => state.highRiskSurvived
        },
        {
            id: 'conservative',
            name: 'Playing It Safe',
            description: 'Complete 5 low-risk actions in a row',
            icon: '🐢',
            condition: (state) => state.lowRiskStreak >= 5
        },
        {
            id: 'avoid_bankruptcy',
            name: 'Avoid Bankruptcy',
            description: 'End the session with more than $0',
            icon: '💪',
            condition: (state) => state.balance > 0 && state.sessionEnded
        },
        {
            id: 'double_up',
            name: 'Double Up',
            description: 'Reach $2,000 or more',
            icon: '📈',
            condition: (state) => state.balance >= 2000
        },
        {
            id: 'five_k_club',
            name: '$5K Club',
            description: 'Reach $5,000 or more',
            icon: '🏆',
            condition: (state) => state.balance >= 5000
        },
        {
            id: 'comeback_king',
            name: 'Comeback King',
            description: 'Recover from below $200 to above $1,000',
            icon: '👑',
            condition: (state) => state.hadLowBalance && state.balance >= 1000
        },

        // Path-specific Badges
        {
            id: 'freelance_pro',
            name: 'Freelance Pro',
            description: 'Complete 5 freelance jobs successfully',
            icon: '💼',
            condition: (state) => state.freelanceJobsCompleted >= 5
        },
        {
            id: 'viral_hit',
            name: 'Viral Hit',
            description: 'Experience a viral event in affiliate marketing',
            icon: '🚀',
            condition: (state) => state.wentViral
        },
        {
            id: 'trader_profit',
            name: 'Market Winner',
            description: 'Close a trading position with 50%+ profit',
            icon: '📊',
            condition: (state) => state.bigTradeProfit
        },
        {
            id: 'dropship_success',
            name: 'E-Commerce Success',
            description: 'Make $500+ profit from a single campaign',
            icon: '📦',
            condition: (state) => state.bigDropshipProfit
        },

        // Stress Management
        {
            id: 'zen_master',
            name: 'Zen Master',
            description: 'Keep stress below 30 for entire session',
            icon: '☯️',
            condition: (state) => state.sessionEnded && state.stress < 30 && state.actionsCount >= 10
        },
        {
            id: 'efficient',
            name: 'Efficient Worker',
            description: 'Complete 10 actions with energy above 50',
            icon: '⚡',
            condition: (state) => state.actionsCount >= 10 && state.energy > 50
        }
    ],

    checkAll(state) {
        const newlyUnlocked = [];

        for (const achievement of this.definitions) {
            if (!state.unlockedAchievements.includes(achievement.id)) {
                if (achievement.condition(state)) {
                    state.unlockedAchievements.push(achievement.id);
                    newlyUnlocked.push(achievement);
                }
            }
        }

        return newlyUnlocked;
    },

    get(id) {
        return this.definitions.find(a => a.id === id);
    },

    getAllWithStatus(state) {
        return this.definitions.map(achievement => ({
            ...achievement,
            unlocked: state.unlockedAchievements.includes(achievement.id)
        }));
    },

    renderList(state) {
        const achievements = this.getAllWithStatus(state);
        return achievements.map(a => `
            <div class="achievement-item ${a.unlocked ? 'unlocked' : ''}">
                <span class="achievement-icon">${a.icon}</span>
                <div class="achievement-info">
                    <h4>${a.name}</h4>
                    <p>${a.description}</p>
                </div>
            </div>
        `).join('');
    }
};

window.Achievements = Achievements;
