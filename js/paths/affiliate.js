// Affiliate Marketing MMO Module - Growth & Patience Challenge

const AffiliateModule = {
    platforms: {
        blog: {
            name: 'Blog',
            emoji: '📝',
            baseTraffic: 20,
            trafficGrowth: 1.08,
            baseCTR: 2.5,
            baseConversion: 1.5,
            contentCost: 30,
            viralChance: 0.3,
            growthSpeed: 'slow'
        },
        tiktok: {
            name: 'TikTok',
            emoji: '🎵',
            baseTraffic: 100,
            trafficGrowth: 1.15,
            baseCTR: 1.2,
            baseConversion: 0.6,
            contentCost: 15,
            viralChance: 5,
            growthSpeed: 'fast'
        },
        youtube: {
            name: 'YouTube',
            emoji: '🎬',
            baseTraffic: 50,
            trafficGrowth: 1.1,
            baseCTR: 3.5,
            baseConversion: 2.0,
            contentCost: 50,
            viralChance: 1,
            growthSpeed: 'medium'
        }
    },

    currentPlatform: null,
    stats: {
        traffic: 0,
        ctr: 0,
        conversion: 0,
        totalEarnings: 0,
        daysActive: 0
    },
    events: [],

    init() {
        this.currentPlatform = GameState.state.affiliate.platform;
        if (this.currentPlatform) {
            this.stats = {
                traffic: GameState.state.affiliate.traffic,
                ctr: GameState.state.affiliate.ctr,
                conversion: GameState.state.affiliate.conversion,
                totalEarnings: 0,
                daysActive: GameState.state.affiliate.daysActive
            };
        }
        this.render();
    },

    render() {
        const screen = document.getElementById('affiliate-screen');
        if (!screen) return;

        const aff = GameState.state.affiliate;

        screen.innerHTML = `
            <div class="module-header">
                <button class="btn btn-back" data-back="dashboard">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Dashboard
                </button>
                <div class="module-balance">
                    <span class="balance-label">Balance:</span>
                    <span class="balance-value">${UI.formatCurrency(GameState.getBalance())}</span>
                </div>
            </div>

            <div class="module-content">
                <div class="module-intro">
                    <div class="module-icon">📈</div>
                    <h1>Affiliate Challenge</h1>
                    <p>Build traffic before deadline. Limited daily actions, patience required!</p>
                </div>

                <!-- Challenge Resources -->
                <div class="module-resources">
                    <div class="module-resource">
                        <span class="module-resource-value">${aff.actionsToday}</span>
                        <span class="module-resource-label">Actions Today</span>
                    </div>
                    <div class="module-resource">
                        <span class="module-resource-value ${aff.daysActive >= aff.deadline - 3 ? 'negative' : ''}">${aff.deadline - aff.daysActive}</span>
                        <span class="module-resource-label">Days Until Deadline</span>
                    </div>
                    <div class="module-resource">
                        <span class="module-resource-value ${aff.traffic >= 100 ? 'positive' : ''}">${Math.round(aff.traffic || this.stats.traffic)}</span>
                        <span class="module-resource-label">Daily Traffic</span>
                    </div>
                    <div class="module-resource">
                        <span class="module-resource-value">$${aff.totalSpent}</span>
                        <span class="module-resource-label">Total Spent</span>
                    </div>
                </div>

                ${aff.failed ? this.renderFailed() : (this.currentPlatform ? this.renderDashboard() : this.renderPlatformSelect())}
            </div>
        `;

        this.setupEventListeners();
    },

    renderFailed() {
        return `
            <div class="challenge-failed">
                <div class="failed-icon">💀</div>
                <h2>Challenge Failed!</h2>
                <p>You didn't reach 100+ daily visitors before the deadline!</p>
                <p class="reality-note">In real affiliate marketing, most people give up before seeing results. Patience and consistency are key.</p>
                <button class="btn btn-secondary" data-back="dashboard">Return to Dashboard</button>
            </div>
        `;
    },

    renderPlatformSelect() {
        return `
            <div class="platform-selection">
                <h2>Choose ONE Platform</h2>
                <p style="color: var(--text-muted); text-align: center; margin-bottom: var(--space-6);">
                    🎯 Goal: Reach 100+ daily visitors before Day ${GameState.state.affiliate.deadline}
                </p>
                <div class="platform-options">
                    ${Object.entries(this.platforms).map(([id, p]) => `
                        <div class="platform-card" data-platform="${id}">
                            <div class="platform-emoji">${p.emoji}</div>
                            <h3>${p.name}</h3>
                            <div class="platform-stats">
                                <span>📊 Base Traffic: ${p.baseTraffic}/day</span>
                                <span>🚀 Viral Chance: ${p.viralChance}%</span>
                                <span>💰 Content Cost: $${p.contentCost}</span>
                                <span>⏱️ Growth: ${p.growthSpeed}</span>
                            </div>
                            <button class="btn btn-platform">Choose ${p.name}</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderDashboard() {
        const platform = this.platforms[this.currentPlatform];
        const aff = GameState.state.affiliate;
        const earnings = this.calculateEarnings();

        return `
            <div class="affiliate-dash">
                <div class="platform-header" style="text-align: center; margin-bottom: 1.5rem;">
                    <span style="font-size: 2rem;">${platform.emoji}</span>
                    <h2>${platform.name} Dashboard</h2>
                    <p>Day ${aff.daysActive + 1} of ${aff.deadline}</p>
                </div>

                <div class="affiliate-stats-grid">
                    <div class="affiliate-stat">
                        <span class="stat-label">Daily Traffic</span>
                        <span class="stat-value ${this.stats.traffic >= 100 ? 'positive' : ''}">${Math.round(this.stats.traffic)}</span>
                    </div>
                    <div class="affiliate-stat">
                        <span class="stat-label">Click Rate</span>
                        <span class="stat-value">${this.stats.ctr.toFixed(1)}%</span>
                    </div>
                    <div class="affiliate-stat">
                        <span class="stat-label">Conversion</span>
                        <span class="stat-value">${this.stats.conversion.toFixed(1)}%</span>
                    </div>
                    <div class="affiliate-stat">
                        <span class="stat-label">Potential Earnings</span>
                        <span class="stat-value positive">$${earnings}</span>
                    </div>
                </div>

                <div class="progress-section" style="margin: var(--space-4) 0;">
                    <div class="progress-label" style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                        <span>Progress to 100 visitors</span>
                        <span>${Math.min(100, Math.round(this.stats.traffic))}%</span>
                    </div>
                    <div class="resource-bar-container">
                        <div class="resource-fill ${this.stats.traffic >= 100 ? 'good' : 'warning'}" 
                             style="width: ${Math.min(100, this.stats.traffic)}%"></div>
                    </div>
                </div>

                <div class="affiliate-actions">
                    <h3>Actions (${aff.actionsToday} remaining today)</h3>
                    <div class="action-buttons" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); margin-top: var(--space-4);">
                        <button class="btn btn-action ${aff.actionsToday <= 0 ? 'disabled' : ''}" data-action="create-content" ${aff.actionsToday <= 0 ? 'disabled' : ''}>
                            <span class="action-icon">✍️</span>
                            <span class="action-text">Create Content</span>
                            <span class="action-cost">-$${platform.contentCost}</span>
                        </button>
                        <button class="btn btn-action ${aff.actionsToday <= 0 ? 'disabled' : ''}" data-action="promote" ${aff.actionsToday <= 0 ? 'disabled' : ''}>
                            <span class="action-icon">📢</span>
                            <span class="action-text">Paid Ads</span>
                            <span class="action-cost">-$100</span>
                        </button>
                        <button class="btn btn-action ${aff.actionsToday <= 0 ? 'disabled' : ''}" data-action="engage" ${aff.actionsToday <= 0 ? 'disabled' : ''}>
                            <span class="action-icon">💬</span>
                            <span class="action-text">Engage Community</span>
                            <span class="action-cost">Free</span>
                        </button>
                        <button class="btn btn-action" data-action="collect" ${earnings <= 0 ? 'disabled' : ''}>
                            <span class="action-icon">💰</span>
                            <span class="action-text">Collect Earnings</span>
                            <span class="action-cost">+$${earnings}</span>
                        </button>
                    </div>
                </div>

                <button class="btn btn-primary" id="advance-affiliate-day" style="width: 100%; margin-top: var(--space-6);">
                    📅 End Day & See Results
                </button>

                <div id="affiliate-events" class="events-log" style="margin-top: var(--space-4);">
                    <h4>Activity Log</h4>
                    ${this.events.slice(0, 5).map(e => `
                        <div class="event-item ${e.type}" style="padding: var(--space-2); border-bottom: 1px solid var(--border-color);">
                            ${e.icon} ${e.message}
                        </div>
                    `).join('') || '<p style="color: var(--text-muted); text-align: center;">No activity yet</p>'}
                </div>
            </div>
        `;
    },

    setupEventListeners() {
        // Platform selection
        document.querySelectorAll('.platform-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectPlatform(card.dataset.platform);
            });
        });

        // Action buttons
        document.querySelectorAll('.btn-action').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled) {
                    this.performAction(btn.dataset.action);
                }
            });
        });

        // Advance day
        document.getElementById('advance-affiliate-day')?.addEventListener('click', () => {
            this.advanceDay();
        });

        // Back button
        const backBtn = document.querySelector('[data-back="dashboard"]');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                UI.showScreen('dashboard-screen');
                UI.updateAll();
            });
        }
    },

    selectPlatform(platformId) {
        this.currentPlatform = platformId;
        const platform = this.platforms[platformId];

        this.stats = {
            traffic: platform.baseTraffic,
            ctr: platform.baseCTR,
            conversion: platform.baseConversion,
            totalEarnings: 0,
            daysActive: 0
        };

        this.events = [];
        this.addEvent('info', '🚀', `Started ${platform.name} journey!`);

        GameState.state.affiliate.platform = platformId;
        GameState.state.affiliate.traffic = platform.baseTraffic;
        GameState.state.affiliate.ctr = platform.baseCTR;
        GameState.state.affiliate.conversion = platform.baseConversion;
        GameState.save();

        UI.showToast(`Started ${platform.name}!`, 'success', platform.emoji);
        this.render();
    },

    performAction(action) {
        const platform = this.platforms[this.currentPlatform];
        const aff = GameState.state.affiliate;

        if (aff.actionsToday <= 0 && action !== 'collect') {
            UI.showToast('No actions left today! End the day to continue.', 'warning', '⏰');
            return;
        }

        switch (action) {
            case 'create-content':
                this.createContent();
                break;
            case 'promote':
                this.runPromotion();
                break;
            case 'engage':
                this.engageCommunity();
                break;
            case 'collect':
                this.collectEarnings();
                break;
        }
    },

    createContent() {
        const platform = this.platforms[this.currentPlatform];
        const cost = platform.contentCost;

        if (GameState.getBalance() < cost) {
            UI.showToast('Not enough balance!', 'error', '❌');
            return;
        }

        GameState.state.affiliate.actionsToday--;
        GameState.state.affiliate.totalSpent += cost;
        const result = GameState.updateBalance(-cost, `${platform.name} content creation`, 'affiliate', 'low');

        // Boost stats
        this.stats.traffic *= Random.floatBetween(1.05, 1.15);
        this.stats.ctr = Math.min(10, this.stats.ctr + Random.floatBetween(0.05, 0.15));

        // Check for viral
        if (Random.chance(platform.viralChance)) {
            this.goViral();
        } else {
            this.addEvent('success', '✍️', 'Created new content - traffic boosted!');
            UI.showToast('Content created! Traffic increased.', 'success', '✍️');
        }

        this.syncStats();
        result.newAchievements.forEach(a => UI.showAchievementUnlock(a));
        UI.updateAll();
        this.render();

        if (result.isGameOver) UI.handleGameOver();
    },

    runPromotion() {
        const cost = 100;

        if (GameState.getBalance() < cost) {
            UI.showToast('Not enough balance!', 'error', '❌');
            return;
        }

        GameState.state.affiliate.actionsToday--;
        GameState.state.affiliate.totalSpent += cost;
        const result = GameState.updateBalance(-cost, 'Paid promotion campaign', 'affiliate', 'medium');

        if (Random.chance(55)) {
            this.stats.traffic *= Random.floatBetween(1.3, 2.0);
            this.addEvent('success', '📢', 'Ads working! Big traffic boost!');
            UI.showToast('Ads are working! Traffic surged!', 'success', '📢');
            GameState.recordDecision('smart', 'medium');
        } else {
            this.stats.traffic *= Random.floatBetween(1.0, 1.1);
            this.addEvent('warning', '📢', 'Ads had minimal impact');
            UI.showToast('Ad spend wasted...', 'warning', '😐');
            GameState.recordDecision('reckless', 'medium');
        }

        this.syncStats();
        result.newAchievements.forEach(a => UI.showAchievementUnlock(a));
        UI.updateAll();
        this.render();

        if (result.isGameOver) UI.handleGameOver();
    },

    engageCommunity() {
        GameState.state.affiliate.actionsToday--;

        // Free action with small benefits
        this.stats.traffic *= Random.floatBetween(1.02, 1.08);
        this.stats.ctr = Math.min(10, this.stats.ctr + Random.floatBetween(0.02, 0.08));

        this.addEvent('info', '💬', 'Engaged with community - small boost!');
        UI.showToast('Engaged! Small but free boost.', 'info', '💬');

        GameState.consumeEnergy(5);
        GameState.recordDecision('smart', 'low');

        this.syncStats();
        UI.updateAll();
        this.render();
    },

    advanceDay() {
        const aff = GameState.state.affiliate;
        const platform = this.platforms[this.currentPlatform];

        aff.daysActive++;
        aff.actionsToday = 3; // Reset daily actions

        // Natural growth/decay
        this.stats.traffic *= platform.trafficGrowth;
        this.stats.ctr = Math.max(0.5, this.stats.ctr + Random.floatBetween(-0.1, 0.1));
        this.stats.conversion = Math.max(0.3, this.stats.conversion + Random.floatBetween(-0.05, 0.05));

        // Random events
        if (Random.chance(8)) {
            // Algorithm change
            this.stats.traffic *= 0.75;
            this.addEvent('warning', '⚠️', 'Algorithm changed - traffic dropped!');
            UI.showToast('Algorithm update! Traffic dropped.', 'warning', '⚠️');
        }

        // Rare viral
        if (Random.chance(platform.viralChance / 3)) {
            this.goViral();
        }

        this.syncStats();
        GameState.advanceDay();

        // Check deadline
        if (aff.daysActive >= aff.deadline && this.stats.traffic < 100) {
            aff.failed = true;
            GameState.save();
            this.render();
            UI.showFailCondition({ message: 'Deadline reached without 100 visitors!' });
            return;
        }

        UI.showToast(`Day ${aff.daysActive} complete!`, 'info', '📅');
        UI.updateAll();
        this.render();
    },

    goViral() {
        this.stats.traffic *= Random.between(5, 12);
        GameState.state.wentViral = true;
        GameState.save();

        this.addEvent('success', '🚀', 'VIRAL! Your content exploded!');
        UI.showToast('🚀 YOU WENT VIRAL! 🚀', 'success', '🔥');
    },

    calculateEarnings() {
        const clicks = this.stats.traffic * (this.stats.ctr / 100);
        const sales = clicks * (this.stats.conversion / 100);
        const avgCommission = Random.between(5, 20);
        return Math.round(sales * avgCommission);
    },

    collectEarnings() {
        const earnings = this.calculateEarnings();

        if (earnings <= 0) {
            UI.showToast('No earnings to collect yet!', 'warning', '💸');
            return;
        }

        const result = GameState.updateBalance(earnings, `${this.platforms[this.currentPlatform].name} affiliate commissions`, 'affiliate', 'low');

        this.addEvent('success', '💰', `Collected $${earnings} in commissions!`);
        UI.showToast(`Collected $${earnings}!`, 'success', '💰');

        this.stats.totalEarnings += earnings;

        result.newAchievements.forEach(a => UI.showAchievementUnlock(a));
        UI.updateAll();
        this.render();

        if (result.isGameOver) UI.handleGameOver();
    },

    syncStats() {
        GameState.state.affiliate.traffic = this.stats.traffic;
        GameState.state.affiliate.ctr = this.stats.ctr;
        GameState.state.affiliate.conversion = this.stats.conversion;
        GameState.save();
    },

    addEvent(type, icon, message) {
        this.events.unshift({ type, icon, message, time: Date.now() });
        if (this.events.length > 10) this.events.pop();
    },

    reset() {
        this.currentPlatform = null;
        this.stats = { traffic: 0, ctr: 0, conversion: 0, totalEarnings: 0, daysActive: 0 };
        this.events = [];
    }
};

window.AffiliateModule = AffiliateModule;
