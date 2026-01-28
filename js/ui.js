// UI Management with Challenge Resources Display

const UI = {
    charts: {},

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    },

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    },

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    },

    updateBalance(amount, animate = true) {
        const balanceEl = document.getElementById('balance-amount');
        const moduleBalances = document.querySelectorAll('.module-balance .balance-value');

        const formatted = this.formatCurrency(amount);

        if (animate && balanceEl) {
            balanceEl.classList.add('updating');
            setTimeout(() => balanceEl.classList.remove('updating'), 300);
        }

        if (balanceEl) balanceEl.textContent = formatted;
        moduleBalances.forEach(el => el.textContent = formatted);
    },

    // Update resource bars (energy, stress)
    updateResources() {
        const state = GameState.state;

        // Energy bar
        const energyBar = document.getElementById('energy-bar');
        const energyText = document.getElementById('energy-text');
        if (energyBar) {
            energyBar.style.width = `${state.energy}%`;
            energyBar.className = `resource-fill ${state.energy > 50 ? 'good' : state.energy > 25 ? 'warning' : 'danger'}`;
        }
        if (energyText) energyText.textContent = `${Math.round(state.energy)}%`;

        // Stress bar
        const stressBar = document.getElementById('stress-bar');
        const stressText = document.getElementById('stress-text');
        if (stressBar) {
            stressBar.style.width = `${state.stress}%`;
            stressBar.className = `resource-fill ${state.stress < 30 ? 'good' : state.stress < 70 ? 'warning' : 'danger'}`;
        }
        if (stressText) stressText.textContent = `${Math.round(state.stress)}%`;

        // Day counter
        const dayDisplay = document.getElementById('current-day');
        if (dayDisplay) dayDisplay.textContent = `Day ${state.currentDay} / ${state.maxDays}`;
    },

    updateStats() {
        const state = GameState.state;

        const profitEl = document.getElementById('total-profit');
        const lossEl = document.getElementById('total-loss');
        const actionsEl = document.getElementById('actions-count');
        const bestEl = document.getElementById('best-trade');
        const strategyEl = document.getElementById('strategy-score');
        const riskEl = document.getElementById('risk-score');

        if (profitEl) profitEl.textContent = this.formatCurrency(state.totalProfit);
        if (lossEl) lossEl.textContent = this.formatCurrency(state.totalLoss);
        if (actionsEl) actionsEl.textContent = state.actionsCount;
        if (strategyEl) strategyEl.textContent = `${Math.round(state.strategyScore)}/100`;
        if (riskEl) riskEl.textContent = `${Math.round(state.riskScore)}/100`;

        if (bestEl && state.bestTrade.amount > 0) {
            bestEl.textContent = this.formatCurrency(state.bestTrade.amount);
            bestEl.classList.add('positive');
        }
    },

    updateTransactions() {
        const list = document.getElementById('transaction-list');
        const transactions = GameState.state.transactions;

        if (!list) return;

        if (transactions.length === 0) {
            list.innerHTML = '<div class="empty-state"><p>No transactions yet. Make decisions to see results!</p></div>';
            return;
        }

        const pathIcons = {
            freelance: '💼',
            affiliate: '📈',
            dropshipping: '📦',
            trading: '📊'
        };

        list.innerHTML = transactions.slice(0, 10).map(tx => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <span class="transaction-icon">${pathIcons[tx.path] || '💰'}</span>
                    <div class="transaction-details">
                        <span class="transaction-name">${tx.description}</span>
                        <span class="transaction-time">Day ${tx.day || 1} • ${this.formatTime(tx.timestamp)}</span>
                    </div>
                </div>
                <span class="transaction-amount ${tx.amount >= 0 ? 'positive' : 'negative'}">
                    ${tx.amount >= 0 ? '+' : ''}${this.formatCurrency(tx.amount)}
                </span>
            </div>
        `).join('');
    },

    initBalanceChart() {
        const ctx = document.getElementById('balance-chart');
        if (!ctx) return;

        if (this.charts.balance) {
            this.charts.balance.destroy();
        }

        this.charts.balance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: GameState.state.balanceHistory.map((_, i) => i),
                datasets: [{
                    label: 'Balance',
                    data: GameState.state.balanceHistory,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: {
                        grid: { color: 'rgba(148, 163, 184, 0.1)' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    },

    updateBalanceChart() {
        if (this.charts.balance) {
            this.charts.balance.data.labels = GameState.state.balanceHistory.map((_, i) => i);
            this.charts.balance.data.datasets[0].data = GameState.state.balanceHistory;
            this.charts.balance.update();
        }
    },

    showToast(message, type = 'success', icon = null) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            challenge: '🎯'
        };

        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icon || icons[type]}</span>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    },

    showAchievementUnlock(achievement) {
        this.showToast(`Achievement: ${achievement.name}`, 'success', achievement.icon);
    },

    showFailCondition(fail) {
        this.showToast(fail.message, 'error', '💥');
    },

    renderPathsGrid() {
        const grid = document.getElementById('paths-grid');
        if (!grid) return;

        const state = GameState.state;

        const paths = [
            {
                id: 'freelance',
                icon: '💼',
                title: 'Freelance Challenge',
                description: 'Manage your time and reputation. Complete jobs before running out of hours!',
                risk: 'medium',
                riskLabel: 'Time & Skill Challenge',
                resources: `${state.freelance.timeRemaining}h remaining`,
                failed: state.freelance.failed
            },
            {
                id: 'affiliate',
                icon: '📈',
                title: 'Affiliate Challenge',
                description: 'Build traffic before deadline. Limited daily actions, patience required.',
                risk: 'medium',
                riskLabel: 'Growth & Patience Challenge',
                resources: `${state.affiliate.actionsToday} actions left today`,
                failed: state.affiliate.failed
            },
            {
                id: 'dropshipping',
                icon: '📦',
                title: 'Dropshipping Challenge',
                description: 'Limited ad attempts. Choose wisely between safe and risky products.',
                risk: 'high',
                riskLabel: 'Capital & Decision Challenge',
                resources: `${state.dropshipping.adAttempts} attempts left`,
                failed: state.dropshipping.failed
            },
            {
                id: 'trading',
                icon: '📊',
                title: 'Trading Challenge',
                description: 'Limited trades and strict risk rules. Break them and face consequences.',
                risk: 'high',
                riskLabel: 'Discipline Challenge',
                resources: `${state.trading.tradesRemaining} trades left`,
                failed: state.trading.failed
            }
        ];

        grid.innerHTML = paths.map(p => `
            <div class="path-card ${p.failed ? 'failed' : ''}" data-path="${p.id}">
                <div class="path-icon">${p.icon}</div>
                <h3 class="path-title">${p.title}</h3>
                <p class="path-description">${p.description}</p>
                <div class="path-stats">
                    <span class="risk-badge risk-${p.risk}">${p.riskLabel}</span>
                </div>
                <div class="path-resources">
                    <span class="resource-indicator">${p.resources}</span>
                </div>
                <button class="btn btn-path" ${p.failed ? 'disabled' : ''}>
                    ${p.failed ? 'Failed' : 'Start Challenge'}
                </button>
            </div>
        `).join('');
    },

    renderLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        if (!list) return;

        const leaderboard = [
            { name: 'StrategicMind', score: 92, badge: '🎯' },
            { name: 'RiskMaster', score: 88, badge: '🛡️' },
            { name: 'DisciplinedPro', score: 85, badge: '🧘' },
            { name: 'PatientGains', score: 78, badge: '⏳' },
            { name: 'SafePlayer', score: 72, badge: '🐢' }
        ];

        const summary = GameState.getSessionSummary();
        if (GameState.state.sessionStarted && summary.overallScore > 0) {
            leaderboard.push({ name: 'You', score: summary.overallScore, isPlayer: true, badge: '⭐' });
            leaderboard.sort((a, b) => b.score - a.score);
        }

        list.innerHTML = leaderboard.slice(0, 5).map((entry, i) => {
            const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
            return `
                <div class="leaderboard-item ${entry.isPlayer ? 'player' : ''}">
                    <span class="leaderboard-rank ${rankClass}">#${i + 1}</span>
                    <span class="leaderboard-badge">${entry.badge}</span>
                    <span class="leaderboard-name">${entry.name}</span>
                    <span class="leaderboard-score">${entry.score}/100</span>
                </div>
            `;
        }).join('');
    },

    renderAchievements() {
        const list = document.getElementById('achievements-list');
        if (list) {
            list.innerHTML = Achievements.renderList(GameState.state);
        }
    },

    renderResults() {
        const summary = GameState.getSessionSummary();
        const content = document.querySelector('.result-content');

        if (!content) return;

        const getGrade = (score) => {
            if (score >= 90) return { letter: 'A+', color: 'var(--success)' };
            if (score >= 80) return { letter: 'A', color: 'var(--success)' };
            if (score >= 70) return { letter: 'B', color: '#22d3ee' };
            if (score >= 60) return { letter: 'C', color: 'var(--warning)' };
            if (score >= 50) return { letter: 'D', color: 'var(--warning)' };
            return { letter: 'F', color: 'var(--danger)' };
        };

        const overallGrade = getGrade(summary.overallScore);

        content.innerHTML = `
            <div class="result-header">
                <h2>📊 Challenge Complete</h2>
                <div class="result-grade" style="color: ${overallGrade.color}">
                    <span class="grade-letter">${overallGrade.letter}</span>
                    <span class="grade-score">${summary.overallScore}/100</span>
                </div>
            </div>
            
            <div class="result-balance">
                <span class="result-label">Final Balance</span>
                <span class="result-amount ${summary.finalBalance >= 1000 ? 'positive' : summary.finalBalance > 0 ? '' : 'negative'}">
                    ${this.formatCurrency(summary.finalBalance)}
                </span>
            </div>

            <div class="result-scores">
                <div class="score-item">
                    <div class="score-circle" style="--score: ${summary.strategyScore}; --color: #3b82f6;">
                        <span>${summary.strategyScore}</span>
                    </div>
                    <span class="score-label">Strategy</span>
                </div>
                <div class="score-item">
                    <div class="score-circle" style="--score: ${summary.riskScore}; --color: #8b5cf6;">
                        <span>${summary.riskScore}</span>
                    </div>
                    <span class="score-label">Risk Mgmt</span>
                </div>
            </div>

            <div class="result-stats">
                <div class="stat-row">
                    <span>Days Survived</span>
                    <span>${summary.daysCompleted} / 7</span>
                </div>
                <div class="stat-row">
                    <span>Total Decisions</span>
                    <span>${summary.decisionsCount}</span>
                </div>
                <div class="stat-row">
                    <span>Reckless Decisions</span>
                    <span class="${summary.recklessDecisions > 0 ? 'negative' : 'positive'}">${summary.recklessDecisions}</span>
                </div>
                <div class="stat-row">
                    <span>Smart Decisions</span>
                    <span class="positive">${summary.smartDecisions}</span>
                </div>
            </div>

            <div class="result-breakdown">
                <h3>Income Breakdown</h3>
                <canvas id="breakdown-chart"></canvas>
            </div>

            <div class="result-insights">
                <div class="insight-item best">
                    <span class="insight-icon">🌟</span>
                    <div class="insight-content">
                        <span class="insight-label">Best Decision</span>
                        <span class="insight-value">${summary.bestTrade.description || 'None'}</span>
                    </div>
                </div>
                <div class="insight-item worst">
                    <span class="insight-icon">💥</span>
                    <div class="insight-content">
                        <span class="insight-label">Biggest Mistake</span>
                        <span class="insight-value">${summary.worstTrade.description || 'None'}</span>
                    </div>
                </div>
            </div>

            <div class="reality-note">
                <p>💡 <strong>Reality Check:</strong> Most players fail not because of luck, but because of poor decisions under pressure. In real MMO, discipline beats talent.</p>
            </div>

            <div class="result-achievements">
                <h3>Badges Earned</h3>
                <div class="unlocked-list">
                    ${summary.unlockedAchievements.map(id => {
            const a = Achievements.get(id);
            return a ? `<span class="unlocked-badge" title="${a.name}">${a.icon}</span>` : '';
        }).join('')}
                    ${summary.unlockedAchievements.length === 0 ? '<p style="color:var(--text-muted);">No badges earned. Try again!</p>' : ''}
                </div>
            </div>

            <div class="result-actions">
                <button id="restart-btn" class="btn btn-primary btn-large">Try Again</button>
            </div>
        `;

        setTimeout(() => this.initBreakdownChart(), 100);
    },

    initBreakdownChart() {
        const ctx = document.getElementById('breakdown-chart');
        if (!ctx) return;

        const breakdown = GameState.getIncomeBreakdown();

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Freelance', 'Affiliate', 'Dropshipping', 'Trading'],
                datasets: [{
                    data: [
                        Math.max(0, breakdown.freelance),
                        Math.max(0, breakdown.affiliate),
                        Math.max(0, breakdown.dropshipping),
                        Math.max(0, breakdown.trading)
                    ],
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#22c55e']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8' }
                    }
                }
            }
        });
    },

    updateAll() {
        this.updateBalance(GameState.getBalance());
        this.updateResources();
        this.updateStats();
        this.updateTransactions();
        this.updateBalanceChart();
        this.renderPathsGrid();
        this.renderLeaderboard();
    },

    formatCurrency(amount) {
        return '$' + Math.abs(amount).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    },

    formatTime(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ago`;
    },

    handleGameOver(failConditions = []) {
        if (failConditions.length > 0) {
            failConditions.forEach(f => this.showFailCondition(f));
        } else {
            this.showToast('Challenge Over!', 'error', '💸');
        }

        setTimeout(() => {
            GameState.endSession();
            this.renderResults();
            this.showModal('result-modal');
        }, 1500);
    }
};

window.UI = UI;
