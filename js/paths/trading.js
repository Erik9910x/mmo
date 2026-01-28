// Trading / Crypto MMO Module - Discipline Challenge

const TradingModule = {
    modes: {
        spot: {
            name: 'Spot Trading',
            emoji: '📈',
            leverage: 1,
            canLiquidate: false,
            volatilityMultiplier: 1
        },
        futures: {
            name: 'Futures Trading',
            emoji: '🔥',
            leverage: 2,
            canLiquidate: true,
            volatilityMultiplier: 2
        }
    },

    currentMode: null,
    leverage: 2,
    volatility: 2, // 1=low, 2=medium, 3=high
    position: null,
    priceHistory: [],
    currentPrice: 45000,
    chart: null,
    priceInterval: null,

    init() {
        this.currentMode = GameState.state.trading.mode;
        this.render();
    },

    render() {
        const screen = document.getElementById('trading-screen');
        if (!screen) return;

        const tr = GameState.state.trading;

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
                    <div class="module-icon">📊</div>
                    <h1>Trading Challenge</h1>
                    <p>Limited trades, strict risk rules. Break the rules and face consequences!</p>
                </div>

                <!-- Challenge Resources -->
                <div class="module-resources">
                    <div class="module-resource">
                        <span class="module-resource-value ${tr.tradesRemaining <= 3 ? 'negative' : ''}">${tr.tradesRemaining}</span>
                        <span class="module-resource-label">Trades Left</span>
                    </div>
                    <div class="module-resource">
                        <span class="module-resource-value">${tr.maxRiskPerTrade}%</span>
                        <span class="module-resource-label">Max Risk/Trade</span>
                    </div>
                    <div class="module-resource">
                        <span class="module-resource-value ${tr.riskRulesBroken >= 2 ? 'negative' : ''}">${tr.riskRulesBroken}/${tr.maxRuleBreaks}</span>
                        <span class="module-resource-label">Rules Broken</span>
                    </div>
                </div>

                ${tr.failed ? this.renderFailed() : (this.currentMode ? this.renderTradingDash() : this.renderModeSelect())}
            </div>
        `;

        this.setupEventListeners();

        if (this.currentMode && !tr.failed) {
            this.initChart();
            this.startPriceUpdates();
        }
    },

    renderFailed() {
        const tr = GameState.state.trading;
        return `
            <div class="challenge-failed">
                <div class="failed-icon">💀</div>
                <h2>Challenge Failed!</h2>
                <p>${tr.riskRulesBroken >= tr.maxRuleBreaks
                ? 'Too many risk rule violations! Discipline is essential.'
                : 'Liquidated! Leverage is a double-edged sword.'}</p>
                <p class="reality-note">In real trading, emotional decisions and breaking risk rules leads to losses. Most retail traders lose money.</p>
                <button class="btn btn-secondary" data-back="dashboard">Return to Dashboard</button>
            </div>
        `;
    },

    renderModeSelect() {
        return `
            <div class="trading-mode-selection">
                <h2>Choose Trading Mode</h2>
                <p style="color: var(--text-muted); text-align: center; margin-bottom: var(--space-6);">
                    ⚠️ You have ${GameState.state.trading.tradesRemaining} trades. Risk max ${GameState.state.trading.maxRiskPerTrade}% per trade!
                </p>
                <div class="mode-options">
                    <div class="mode-card" data-mode="spot">
                        <div class="mode-emoji">📈</div>
                        <h3>Spot Trading</h3>
                        <ul style="list-style: none; text-align: left; font-size: var(--font-size-sm); color: var(--text-secondary);">
                            <li>✅ No leverage</li>
                            <li>✅ Cannot be liquidated</li>
                            <li>📊 Lower risk, steady gains</li>
                        </ul>
                        <span class="risk-badge risk-medium">Medium Risk</span>
                        <button class="btn btn-mode">Trade Spot</button>
                    </div>
                    <div class="mode-card" data-mode="futures">
                        <div class="mode-emoji">🔥</div>
                        <h3>Futures Trading</h3>
                        <ul style="list-style: none; text-align: left; font-size: var(--font-size-sm); color: var(--text-secondary);">
                            <li>⚡ Up to 10x leverage</li>
                            <li>💀 Can be LIQUIDATED!</li>
                            <li>🎰 High risk, high reward</li>
                        </ul>
                        <span class="risk-badge risk-high">High Risk</span>
                        <button class="btn btn-mode">Trade Futures</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderTradingDash() {
        const mode = this.modes[this.currentMode];
        const tr = GameState.state.trading;
        const priceChange = this.priceHistory.length > 1
            ? ((this.currentPrice - this.priceHistory[0]) / this.priceHistory[0] * 100).toFixed(2)
            : 0;
        const changeClass = priceChange >= 0 ? 'positive' : 'negative';

        const maxTradeAmount = Math.floor(GameState.getBalance() * (tr.maxRiskPerTrade / 100));

        return `
            <div class="trading-dash">
                <div class="trading-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
                    <div class="coin-info">
                        <span class="coin-name" style="font-size: var(--font-size-xl); font-weight: 700;">BTC/USDT</span>
                        <span class="coin-price" style="font-size: var(--font-size-2xl); font-weight: 800; margin-left: var(--space-3);">$${Math.round(this.currentPrice).toLocaleString()}</span>
                        <span class="price-change ${changeClass}" style="margin-left: var(--space-2);">${priceChange >= 0 ? '+' : ''}${priceChange}%</span>
                    </div>
                    <div class="mode-indicator" style="background: ${this.currentMode === 'futures' ? 'var(--danger)' : 'var(--accent-primary)'}; color: white; padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); font-weight: 600;">
                        ${mode.name.toUpperCase()}
                    </div>
                </div>

                <div class="chart-area" style="height: 200px; margin-bottom: var(--space-4);">
                    <canvas id="price-chart"></canvas>
                </div>

                <div class="volatility-control" style="margin-bottom: var(--space-4);">
                    <label style="display: block; margin-bottom: var(--space-2); font-weight: 600;">Market Volatility</label>
                    <div class="volatility-slider-container" style="display: flex; align-items: center; gap: var(--space-3);">
                        <span style="color: var(--success);">Low</span>
                        <input type="range" id="volatility" min="1" max="3" value="${this.volatility}" style="flex: 1; accent-color: var(--accent-primary);">
                        <span style="color: var(--danger);">High</span>
                    </div>
                </div>

                ${this.currentMode === 'futures' ? `
                    <div class="leverage-control" style="margin-bottom: var(--space-4); background: var(--danger-bg); padding: var(--space-4); border-radius: var(--radius-lg); border: 1px solid var(--danger);">
                        <label style="display: block; margin-bottom: var(--space-2); font-weight: 600;">
                            Leverage: <span id="leverage-value" style="color: var(--danger);">${this.leverage}x</span>
                        </label>
                        <input type="range" id="leverage" min="2" max="10" value="${this.leverage}" style="width: 100%; accent-color: var(--danger);">
                        <div class="liquidation-warning" style="color: var(--danger); font-size: var(--font-size-sm); margin-top: var(--space-2);">
                            ⚠️ Higher leverage = Higher liquidation risk! At ${this.leverage}x, you get liquidated at ~${Math.round(100 / this.leverage)}% price move against you.
                        </div>
                    </div>
                ` : ''}

                ${this.position ? this.renderOpenPosition() : this.renderTradeForm(maxTradeAmount)}
                
                <div class="risk-rules" style="background: var(--bg-tertiary); padding: var(--space-4); border-radius: var(--radius-lg); margin-top: var(--space-4);">
                    <h4>📋 Risk Rules</h4>
                    <ul style="list-style: none; font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: var(--space-2);">
                        <li style="color: ${tr.riskRulesBroken > 0 ? 'var(--danger)' : 'var(--success)'};">
                            • Max ${tr.maxRiskPerTrade}% of balance per trade ($${maxTradeAmount})
                        </li>
                        <li>• ${tr.tradesRemaining} trades remaining</li>
                        <li style="color: ${tr.riskRulesBroken >= 2 ? 'var(--danger)' : 'var(--text-secondary)'};">
                            • ${tr.maxRuleBreaks - tr.riskRulesBroken} rule violations allowed before fail
                        </li>
                    </ul>
                </div>
            </div>
        `;
    },

    renderTradeForm(maxTradeAmount) {
        const tr = GameState.state.trading;
        const defaultAmount = Math.min(100, maxTradeAmount);

        return `
            <div class="trade-form" style="margin-top: var(--space-4);">
                <div class="trade-amount" style="margin-bottom: var(--space-4);">
                    <label style="display: block; margin-bottom: var(--space-2); font-weight: 600;">
                        Trade Amount (Max without rule break: $${maxTradeAmount})
                    </label>
                    <div class="amount-input-group" style="display: flex; gap: var(--space-3); align-items: center;">
                        <input type="number" id="trade-amount" min="10" max="${GameState.getBalance()}" value="${defaultAmount}" 
                               style="flex: 1; padding: var(--space-3); background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-size: var(--font-size-lg);">
                        <div class="amount-presets" style="display: flex; gap: var(--space-2);">
                            <button class="preset-btn btn btn-secondary" data-percent="10">10%</button>
                            <button class="preset-btn btn btn-secondary" data-percent="20">20%</button>
                            <button class="preset-btn btn btn-secondary" data-percent="50" style="background: var(--danger-bg); border-color: var(--danger); color: var(--danger);">50%⚠️</button>
                        </div>
                    </div>
                    <p id="risk-warning" class="hidden" style="color: var(--danger); font-size: var(--font-size-sm); margin-top: var(--space-2);">
                        ⚠️ This exceeds max risk! Will count as rule violation.
                    </p>
                </div>

                <div class="trade-buttons" style="display: flex; gap: var(--space-3);">
                    <button id="buy-btn" class="btn btn-buy" ${tr.tradesRemaining <= 0 ? 'disabled' : ''}>
                        <span>📈 BUY / LONG</span>
                    </button>
                    <button id="sell-btn" class="btn btn-sell" ${tr.tradesRemaining <= 0 ? 'disabled' : ''}>
                        <span>📉 SELL / SHORT</span>
                    </button>
                </div>
            </div>
        `;
    },

    renderOpenPosition() {
        const pnl = this.calculatePnL();
        const pnlClass = pnl >= 0 ? 'positive' : 'negative';
        const pnlPrefix = pnl >= 0 ? '+' : '';
        const pnlPercent = ((pnl / this.position.size) * 100).toFixed(1);

        return `
            <div class="open-position" style="background: var(--bg-tertiary); padding: var(--space-4); border-radius: var(--radius-lg); margin-top: var(--space-4);">
                <h3>📊 Open Position</h3>
                <div class="position-info" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); margin-top: var(--space-3);">
                    <div class="position-detail">
                        <span style="color: var(--text-muted); font-size: var(--font-size-sm);">Direction</span>
                        <span style="display: block; font-weight: 700; color: ${this.position.direction === 'long' ? 'var(--success)' : 'var(--danger)'}">
                            ${this.position.direction.toUpperCase()}
                        </span>
                    </div>
                    <div class="position-detail">
                        <span style="color: var(--text-muted); font-size: var(--font-size-sm);">Entry Price</span>
                        <span style="display: block; font-weight: 700;">$${this.position.entryPrice.toLocaleString()}</span>
                    </div>
                    <div class="position-detail">
                        <span style="color: var(--text-muted); font-size: var(--font-size-sm);">Size</span>
                        <span style="display: block; font-weight: 700;">$${this.position.size}</span>
                    </div>
                    ${this.currentMode === 'futures' ? `
                        <div class="position-detail">
                            <span style="color: var(--text-muted); font-size: var(--font-size-sm);">Leverage</span>
                            <span style="display: block; font-weight: 700; color: var(--danger);">${this.position.leverage}x</span>
                        </div>
                    ` : ''}
                    <div class="position-detail pnl" style="grid-column: span 2; text-align: center; padding: var(--space-3); background: ${pnl >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)'}; border-radius: var(--radius-md);">
                        <span style="color: var(--text-muted); font-size: var(--font-size-sm);">Unrealized PnL</span>
                        <span class="${pnlClass}" style="display: block; font-size: var(--font-size-xl); font-weight: 800;">
                            ${pnlPrefix}$${Math.abs(Math.round(pnl))} (${pnlPrefix}${pnlPercent}%)
                        </span>
                    </div>
                </div>
                <button id="close-position" class="btn btn-primary" style="width: 100%; margin-top: var(--space-4);">
                    Close Position
                </button>
            </div>
        `;
    },

    setupEventListeners() {
        // Mode selection
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectMode(card.dataset.mode);
            });
        });

        // Volatility slider
        const volSlider = document.getElementById('volatility');
        if (volSlider) {
            volSlider.addEventListener('input', (e) => {
                this.volatility = parseInt(e.target.value);
            });
        }

        // Leverage slider
        const levSlider = document.getElementById('leverage');
        if (levSlider) {
            levSlider.addEventListener('input', (e) => {
                this.leverage = parseInt(e.target.value);
                document.getElementById('leverage-value').textContent = `${this.leverage}x`;
                document.querySelector('.liquidation-warning').innerHTML =
                    `⚠️ Higher leverage = Higher liquidation risk! At ${this.leverage}x, you get liquidated at ~${Math.round(100 / this.leverage)}% price move against you.`;
            });
        }

        // Amount input - check for rule violation
        const amountInput = document.getElementById('trade-amount');
        if (amountInput) {
            amountInput.addEventListener('input', () => {
                const amount = parseInt(amountInput.value) || 0;
                const maxAllowed = Math.floor(GameState.getBalance() * (GameState.state.trading.maxRiskPerTrade / 100));
                const warning = document.getElementById('risk-warning');
                if (amount > maxAllowed) {
                    warning?.classList.remove('hidden');
                } else {
                    warning?.classList.add('hidden');
                }
            });
        }

        // Amount presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const percent = parseInt(btn.dataset.percent);
                const amount = Math.floor(GameState.getBalance() * (percent / 100));
                const input = document.getElementById('trade-amount');
                if (input) {
                    input.value = amount;
                    input.dispatchEvent(new Event('input'));
                }
            });
        });

        // Trade buttons
        const buyBtn = document.getElementById('buy-btn');
        const sellBtn = document.getElementById('sell-btn');
        if (buyBtn) buyBtn.addEventListener('click', () => this.openPosition('long'));
        if (sellBtn) sellBtn.addEventListener('click', () => this.openPosition('short'));

        // Close position
        const closeBtn = document.getElementById('close-position');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closePosition());

        // Back button
        const backBtn = document.querySelector('[data-back="dashboard"]');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.stopPriceUpdates();
                UI.showScreen('dashboard-screen');
                UI.updateAll();
            });
        }
    },

    selectMode(mode) {
        this.currentMode = mode;
        this.currentPrice = 45000;
        this.priceHistory = [45000];

        GameState.state.trading.mode = mode;
        GameState.save();

        if (mode === 'futures') {
            GameState.recordDecision('reckless', 'high');
        } else {
            GameState.recordDecision('smart', 'medium');
        }

        UI.showToast(`Selected ${this.modes[mode].name}`, 'info', this.modes[mode].emoji);
        this.render();
    },

    initChart() {
        const ctx = document.getElementById('price-chart');
        if (!ctx) return;

        if (this.chart) this.chart.destroy();

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.priceHistory.map((_, i) => i),
                datasets: [{
                    label: 'BTC/USDT',
                    data: this.priceHistory,
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
                animation: { duration: 0 },
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: {
                        grid: { color: 'rgba(148, 163, 184, 0.1)' },
                        ticks: {
                            color: '#94a3b8',
                            callback: (v) => '$' + v.toLocaleString()
                        }
                    }
                }
            }
        });
    },

    startPriceUpdates() {
        this.stopPriceUpdates();

        this.priceInterval = setInterval(() => {
            this.updatePrice();
        }, 1000);
    },

    stopPriceUpdates() {
        if (this.priceInterval) {
            clearInterval(this.priceInterval);
            this.priceInterval = null;
        }
    },

    updatePrice() {
        const volatilityRanges = {
            1: 0.004,  // Low: ±0.4%
            2: 0.012,  // Medium: ±1.2%
            3: 0.025   // High: ±2.5%
        };

        const range = volatilityRanges[this.volatility];
        const change = this.currentPrice * Random.floatBetween(-range, range);
        this.currentPrice = Math.max(1000, this.currentPrice + change);

        this.priceHistory.push(this.currentPrice);
        if (this.priceHistory.length > 60) this.priceHistory.shift();

        // Update chart
        if (this.chart) {
            this.chart.data.labels = this.priceHistory.map((_, i) => i);
            this.chart.data.datasets[0].data = this.priceHistory;
            this.chart.update('none');
        }

        // Update price display
        const priceEl = document.querySelector('.coin-price');
        const changeEl = document.querySelector('.price-change');
        if (priceEl) priceEl.textContent = `$${Math.round(this.currentPrice).toLocaleString()}`;

        if (changeEl && this.priceHistory.length > 1) {
            const pctChange = ((this.currentPrice - this.priceHistory[0]) / this.priceHistory[0] * 100).toFixed(2);
            changeEl.textContent = `${pctChange >= 0 ? '+' : ''}${pctChange}%`;
            changeEl.className = `price-change ${pctChange >= 0 ? 'positive' : 'negative'}`;
        }

        // Update position PnL if open
        if (this.position) {
            this.updatePositionDisplay();
            this.checkLiquidation();
        }
    },

    openPosition(direction) {
        const tr = GameState.state.trading;
        const amountInput = document.getElementById('trade-amount');
        const amount = parseInt(amountInput?.value) || 100;

        if (tr.tradesRemaining <= 0) {
            UI.showToast('No trades remaining!', 'error', '❌');
            return;
        }

        if (amount > GameState.getBalance()) {
            UI.showToast('Not enough balance!', 'error', '❌');
            return;
        }

        if (amount < 10) {
            UI.showToast('Minimum trade is $10', 'warning', '⚠️');
            return;
        }

        // Check risk rule
        const maxAllowed = Math.floor(GameState.getBalance() * (tr.maxRiskPerTrade / 100));
        if (amount > maxAllowed) {
            tr.riskRulesBroken++;
            GameState.recordDecision('reckless', 'high');
            UI.showToast(`⚠️ Risk rule violated! (${tr.riskRulesBroken}/${tr.maxRuleBreaks})`, 'warning', '⚠️');

            if (tr.riskRulesBroken >= tr.maxRuleBreaks) {
                tr.failed = true;
                GameState.save();
                this.stopPriceUpdates();
                UI.showFailCondition({ message: 'Too many risk rule violations!' });
                this.render();
                return;
            }
        } else {
            GameState.recordDecision('smart', this.currentMode === 'futures' ? 'high' : 'medium');
        }

        // Consume trade
        tr.tradesRemaining--;

        this.position = {
            direction,
            entryPrice: this.currentPrice,
            size: amount,
            leverage: this.currentMode === 'futures' ? this.leverage : 1
        };

        // Reserve the funds
        GameState.updateBalance(-amount, `Opened ${direction.toUpperCase()} position`, 'trading',
            this.currentMode === 'futures' ? 'high' : 'medium');

        GameState.save();
        UI.showToast(`Opened ${direction.toUpperCase()} position!`, 'info', direction === 'long' ? '📈' : '📉');
        UI.updateAll();
        this.render();
        this.initChart();
        this.startPriceUpdates();
    },

    calculatePnL() {
        if (!this.position) return 0;

        const priceChange = this.currentPrice - this.position.entryPrice;
        const percentChange = priceChange / this.position.entryPrice;

        let pnl;
        if (this.position.direction === 'long') {
            pnl = this.position.size * percentChange * this.position.leverage;
        } else {
            pnl = this.position.size * -percentChange * this.position.leverage;
        }

        return pnl;
    },

    updatePositionDisplay() {
        const pnlContainer = document.querySelector('.position-detail.pnl');
        if (pnlContainer) {
            const pnl = this.calculatePnL();
            const pnlClass = pnl >= 0 ? 'positive' : 'negative';
            const pnlPercent = ((pnl / this.position.size) * 100).toFixed(1);
            const pnlPrefix = pnl >= 0 ? '+' : '';

            pnlContainer.style.background = pnl >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)';
            pnlContainer.querySelector('span:last-child').className = pnlClass;
            pnlContainer.querySelector('span:last-child').innerHTML =
                `${pnlPrefix}$${Math.abs(Math.round(pnl))} (${pnlPrefix}${pnlPercent}%)`;
        }
    },

    checkLiquidation() {
        if (!this.position || this.currentMode !== 'futures') return;

        const pnl = this.calculatePnL();
        const lossPercent = -pnl / this.position.size;

        // Liquidation at ~90% loss of margin
        if (lossPercent >= 0.9) {
            this.stopPriceUpdates();

            UI.showToast('💥 LIQUIDATED! Position forced closed at total loss!', 'error', '💀');

            GameState.state.trading.failed = true;
            GameState.recordDecision('reckless', 'high');
            GameState.save();

            this.position = null;

            this.render();

            if (GameState.getBalance() <= 0) {
                UI.handleGameOver();
            }
        }
    },

    closePosition() {
        if (!this.position) return;

        const pnl = this.calculatePnL();
        const totalReturn = this.position.size + pnl;

        // Return funds + PnL
        const desc = pnl >= 0
            ? `Closed ${this.position.direction} with profit`
            : `Closed ${this.position.direction} with loss`;

        const riskLevel = this.currentMode === 'futures' ? 'high' : 'medium';
        const result = GameState.updateBalance(totalReturn, desc, 'trading', riskLevel);

        if (pnl > this.position.size * 0.5) {
            GameState.state.bigTradeProfit = true;
            GameState.save();
        }

        if (pnl >= 0) {
            UI.showToast(`Position closed with +$${Math.round(pnl)} profit!`, 'success', '💰');
            GameState.recordDecision('smart', riskLevel);
        } else {
            UI.showToast(`Position closed with -$${Math.abs(Math.round(pnl))} loss`, 'error', '📉');
        }

        result.newAchievements.forEach(a => UI.showAchievementUnlock(a));

        this.position = null;
        UI.updateAll();
        this.render();
        this.initChart();
        this.startPriceUpdates();

        if (result.isGameOver) {
            UI.handleGameOver();
        }
    },

    reset() {
        this.stopPriceUpdates();
        this.currentMode = null;
        this.position = null;
        this.priceHistory = [];
        this.currentPrice = 45000;
    }
};

window.TradingModule = TradingModule;
