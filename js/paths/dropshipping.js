// Dropshipping MMO Module - Capital & Decision Challenge

const DropshippingModule = {
    products: [
        { id: 1, name: 'LED Strip Lights', emoji: '💡', cost: 8, price: 29, margin: 21, refundRate: 8, risk: 'low' },
        { id: 2, name: 'Phone Stand', emoji: '📱', cost: 3, price: 15, margin: 12, refundRate: 5, risk: 'low' },
        { id: 3, name: 'Wireless Earbuds', emoji: '🎧', cost: 12, price: 45, margin: 33, refundRate: 18, risk: 'medium' },
        { id: 4, name: 'Posture Corrector', emoji: '🦴', cost: 5, price: 25, margin: 20, refundRate: 22, risk: 'high' },
        { id: 5, name: 'Portable Blender', emoji: '🥤', cost: 15, price: 55, margin: 40, refundRate: 12, risk: 'medium' },
        { id: 6, name: 'Smart Watch', emoji: '⌚', cost: 25, price: 89, margin: 64, refundRate: 20, risk: 'high' },
        { id: 7, name: 'Car Phone Mount', emoji: '🚗', cost: 4, price: 18, margin: 14, refundRate: 6, risk: 'low' },
        { id: 8, name: 'Massage Gun', emoji: '💪', cost: 35, price: 129, margin: 94, refundRate: 25, risk: 'high' }
    ],

    selectedProduct: null,
    adBudget: 50,

    init() {
        this.render();
    },

    render() {
        const screen = document.getElementById('dropshipping-screen');
        if (!screen) return;

        const ds = GameState.state.dropshipping;

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
                    <div class="module-icon">📦</div>
                    <h1>Dropshipping Challenge</h1>
                    <p>Limited ad attempts! Choose between safe and risky products wisely.</p>
                </div>

                <!-- Challenge Resources -->
                <div class="module-resources">
                    <div class="module-resource">
                        <span class="module-resource-value ${ds.adAttempts <= 2 ? 'negative' : ''}">${ds.adAttempts}</span>
                        <span class="module-resource-label">Ad Attempts Left</span>
                    </div>
                    <div class="module-resource">
                        <span class="module-resource-value ${ds.refundRate >= 20 ? 'negative' : ''}">${Math.round(ds.refundRate)}%</span>
                        <span class="module-resource-label">Refund Rate</span>
                    </div>
                    <div class="module-resource">
                        <span class="module-resource-value">${ds.maxRefundRate}%</span>
                        <span class="module-resource-label">Max Allowed</span>
                    </div>
                </div>

                <!-- Refund Rate Warning -->
                ${ds.refundRate >= 20 ? `
                    <div class="reality-note" style="margin-bottom: var(--space-4);">
                        ⚠️ <strong>Warning:</strong> Refund rate is high! Store may be banned if it exceeds ${ds.maxRefundRate}%!
                    </div>
                ` : ''}

                ${ds.failed ? this.renderFailed() : (this.selectedProduct ? this.renderCampaign() : this.renderProductSelect())}
            </div>
        `;

        this.setupEventListeners();
    },

    renderFailed() {
        const ds = GameState.state.dropshipping;
        return `
            <div class="challenge-failed">
                <div class="failed-icon">💀</div>
                <h2>Challenge Failed!</h2>
                <p>${ds.refundRate >= ds.maxRefundRate
                ? 'Store banned due to high refund rate!'
                : 'Ran out of ad budget and attempts!'}</p>
                <p class="reality-note">In real dropshipping, refunds and ad losses can quickly drain capital. Product selection is crucial.</p>
                <button class="btn btn-secondary" data-back="dashboard">Return to Dashboard</button>
            </div>
        `;
    },

    renderProductSelect() {
        const ds = GameState.state.dropshipping;

        return `
            <div class="product-selection">
                <h2>Choose a Product to Sell</h2>
                <p style="color: var(--text-muted); text-align: center; margin-bottom: var(--space-6);">
                    ⚠️ Higher margin = Higher refund risk! You have ${ds.adAttempts} campaign attempts.
                </p>
                <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
                    ${this.products.map(p => `
                        <div class="product-card" data-product-id="${p.id}" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: var(--space-4); cursor: pointer; transition: all var(--transition-base);">
                            <div class="product-emoji" style="font-size: 2.5rem; text-align: center;">${p.emoji}</div>
                            <h3 style="text-align: center; margin: var(--space-2) 0;">${p.name}</h3>
                            <div class="product-details" style="font-size: var(--font-size-sm);">
                                <p>Cost: <span style="color: var(--danger);">$${p.cost}</span></p>
                                <p>Sell: <span style="color: var(--success);">$${p.price}</span></p>
                                <p>Margin: <strong>$${p.margin}</strong></p>
                            </div>
                            <span class="risk-badge risk-${p.risk}" style="display: block; text-align: center; margin-top: var(--space-2);">
                                ${p.refundRate}% Refund Risk
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderCampaign() {
        const p = this.selectedProduct;
        const ds = GameState.state.dropshipping;
        const estReach = this.adBudget * 12;
        const estClicks = Math.round(estReach * 0.025);

        return `
            <div class="campaign-dash">
                <div class="selected-product" style="display: flex; align-items: center; gap: var(--space-4); background: var(--bg-tertiary); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
                    <div class="product-emoji" style="font-size: 3rem;">${p.emoji}</div>
                    <div class="product-info" style="flex: 1;">
                        <h3>${p.name}</h3>
                        <p style="color: var(--text-muted);">Cost: $${p.cost} | Sell: $${p.price} | Margin: $${p.margin}</p>
                        <span class="risk-badge risk-${p.risk}">
                            ${p.refundRate}% Refund Risk
                        </span>
                    </div>
                    <button class="btn btn-secondary" id="change-product">Change</button>
                </div>

                <div class="budget-section" style="margin-bottom: var(--space-6);">
                    <h3>Set Ad Budget</h3>
                    <p style="color: var(--text-muted); font-size: var(--font-size-sm); margin-bottom: var(--space-3);">
                        Higher budget = More reach, but more risk if campaign fails
                    </p>
                    <div class="budget-slider-container" style="display: flex; align-items: center; gap: var(--space-4);">
                        <input type="range" id="ad-budget" min="30" max="300" value="${this.adBudget}" 
                               style="flex: 1; accent-color: var(--accent-primary);">
                        <span id="budget-display" style="font-size: var(--font-size-xl); font-weight: 700; min-width: 80px;">$${this.adBudget}</span>
                    </div>
                    <div class="budget-info" style="display: flex; justify-content: space-between; margin-top: var(--space-2); color: var(--text-muted); font-size: var(--font-size-sm);">
                        <span>Est. Reach: <span id="est-reach">${estReach.toLocaleString()}</span></span>
                        <span>Est. Clicks: <span id="est-clicks">${estClicks}</span></span>
                    </div>
                </div>

                <div class="risk-assessment" style="background: var(--bg-tertiary); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-6);">
                    <h4>⚠️ Risk Assessment</h4>
                    <ul style="list-style: none; margin-top: var(--space-2); font-size: var(--font-size-sm);">
                        <li style="color: ${p.risk === 'low' ? 'var(--success)' : p.risk === 'medium' ? 'var(--warning)' : 'var(--danger)'};">
                            Product Risk: ${p.risk.toUpperCase()}
                        </li>
                        <li style="color: var(--text-secondary);">
                            Current Refund Rate: ${Math.round(ds.refundRate)}% / ${ds.maxRefundRate}% max
                        </li>
                        <li style="color: var(--text-secondary);">
                            Campaigns Remaining: ${ds.adAttempts}
                        </li>
                    </ul>
                </div>

                <button id="run-campaign" class="btn btn-primary btn-large" style="width: 100%;">
                    🚀 Run Campaign (-$${this.adBudget}) | Uses 1 Attempt
                </button>

                <div id="campaign-results" class="campaign-results hidden" style="margin-top: var(--space-6);"></div>
            </div>
        `;
    },

    setupEventListeners() {
        // Product selection
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.productId);
                this.selectProduct(id);
            });
        });

        // Change product button
        document.getElementById('change-product')?.addEventListener('click', () => {
            this.selectedProduct = null;
            this.render();
        });

        // Budget slider
        const budgetSlider = document.getElementById('ad-budget');
        if (budgetSlider) {
            budgetSlider.addEventListener('input', (e) => {
                this.adBudget = parseInt(e.target.value);
                document.getElementById('budget-display').textContent = `$${this.adBudget}`;
                document.getElementById('est-reach').textContent = (this.adBudget * 12).toLocaleString();
                document.getElementById('est-clicks').textContent = Math.round(this.adBudget * 12 * 0.025);
                document.getElementById('run-campaign').innerHTML = `🚀 Run Campaign (-$${this.adBudget}) | Uses 1 Attempt`;
            });
        }

        // Run campaign button
        document.getElementById('run-campaign')?.addEventListener('click', () => this.runCampaign());

        // Back button
        const backBtn = document.querySelector('[data-back="dashboard"]');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                UI.showScreen('dashboard-screen');
                UI.updateAll();
            });
        }
    },

    selectProduct(productId) {
        this.selectedProduct = this.products.find(p => p.id === productId);

        // Record decision type based on product risk
        if (this.selectedProduct.risk === 'high') {
            GameState.recordDecision('reckless', 'high');
        } else if (this.selectedProduct.risk === 'low') {
            GameState.recordDecision('smart', 'low');
        }

        UI.showToast(`Selected ${this.selectedProduct.name}`, 'info', this.selectedProduct.emoji);
        this.render();
    },

    runCampaign() {
        const p = this.selectedProduct;
        const ds = GameState.state.dropshipping;

        if (!p) return;

        if (ds.adAttempts <= 0) {
            UI.showToast('No ad attempts remaining!', 'error', '❌');
            this.checkFailConditions();
            return;
        }

        if (GameState.getBalance() < this.adBudget) {
            UI.showToast('Not enough balance for ad budget!', 'error', '❌');
            return;
        }

        // Consume attempt
        ds.adAttempts--;

        // Deduct ad cost
        GameState.updateBalance(-this.adBudget, `Ad spend: ${p.name}`, 'dropshipping', 'medium');

        // Simulate campaign with more variability
        const reach = this.adBudget * Random.between(8, 16);
        const ctr = Random.floatBetween(1.5, 4.0) / 100;
        const clicks = Math.floor(reach * ctr);
        const conversionRate = Random.floatBetween(0.8, 3.5) / 100;
        const sales = Math.max(0, Math.floor(clicks * conversionRate));

        // Calculate refunds based on product risk
        const actualRefundRate = p.refundRate * Random.floatBetween(0.5, 1.8);
        const refunds = Math.floor(sales * (actualRefundRate / 100));
        const actualSales = sales - refunds;

        // Update global refund rate (weighted average)
        const totalOrders = sales + (ds.refundRate > 0 ? 10 : 0); // Simulate existing orders
        ds.refundRate = ((ds.refundRate * 10) + (actualRefundRate * sales)) / totalOrders;
        ds.refundRate = Math.min(100, Math.max(0, ds.refundRate));

        // Calculate profit
        const revenue = actualSales * p.price;
        const productCost = actualSales * p.cost;
        const grossProfit = revenue - productCost;
        const netProfit = grossProfit; // Ad cost already deducted

        // Show results
        this.showResults({
            reach,
            clicks,
            sales,
            refunds,
            actualSales,
            revenue,
            productCost,
            netProfit,
            refundPercent: Math.round(actualRefundRate)
        });

        // Update balance with profit/loss
        if (netProfit !== 0) {
            const riskLevel = p.risk === 'low' ? 'medium' : 'high';
            const desc = netProfit > 0 ? `${p.name} sales profit` : `${p.name} campaign loss`;
            const result = GameState.updateBalance(netProfit, desc, 'dropshipping', riskLevel);

            if (netProfit > 0) {
                GameState.recordDecision('smart', riskLevel);
                if (netProfit >= 300) {
                    GameState.state.bigDropshipProfit = true;
                }
            } else {
                GameState.recordDecision('reckless', riskLevel);
            }

            result.newAchievements.forEach(a => UI.showAchievementUnlock(a));

            if (result.isGameOver) {
                setTimeout(() => UI.handleGameOver(), 2000);
                return;
            }
        }

        GameState.save();

        // Check fail conditions
        if (this.checkFailConditions()) return;

        UI.updateAll();
    },

    checkFailConditions() {
        const ds = GameState.state.dropshipping;

        if (ds.refundRate >= ds.maxRefundRate) {
            ds.failed = true;
            GameState.save();
            UI.showFailCondition({ message: 'Store banned due to high refund rate!' });
            this.render();
            return true;
        }

        if (ds.adAttempts <= 0 && GameState.getBalance() < 30) {
            ds.failed = true;
            GameState.save();
            UI.showFailCondition({ message: 'No more budget or attempts!' });
            this.render();
            return true;
        }

        return false;
    },

    showResults(results) {
        const resultsDiv = document.getElementById('campaign-results');
        if (!resultsDiv) return;

        const profitClass = results.netProfit >= 0 ? 'positive' : 'negative';
        const profitPrefix = results.netProfit >= 0 ? '+' : '';

        resultsDiv.innerHTML = `
            <h3>📊 Campaign Results</h3>
            <div class="results-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); margin-top: var(--space-4);">
                <div class="result-item" style="text-align: center; padding: var(--space-3); background: var(--bg-tertiary); border-radius: var(--radius-md);">
                    <span class="result-label" style="font-size: var(--font-size-xs); color: var(--text-muted);">Reach</span>
                    <span class="result-value" style="display: block; font-weight: 700;">${results.reach.toLocaleString()}</span>
                </div>
                <div class="result-item" style="text-align: center; padding: var(--space-3); background: var(--bg-tertiary); border-radius: var(--radius-md);">
                    <span class="result-label" style="font-size: var(--font-size-xs); color: var(--text-muted);">Clicks</span>
                    <span class="result-value" style="display: block; font-weight: 700;">${results.clicks}</span>
                </div>
                <div class="result-item" style="text-align: center; padding: var(--space-3); background: var(--bg-tertiary); border-radius: var(--radius-md);">
                    <span class="result-label" style="font-size: var(--font-size-xs); color: var(--text-muted);">Sales</span>
                    <span class="result-value" style="display: block; font-weight: 700;">${results.sales}</span>
                </div>
                <div class="result-item" style="text-align: center; padding: var(--space-3); background: var(--bg-tertiary); border-radius: var(--radius-md);">
                    <span class="result-label" style="font-size: var(--font-size-xs); color: var(--text-muted);">Refunds</span>
                    <span class="result-value negative" style="display: block; font-weight: 700;">${results.refunds} (${results.refundPercent}%)</span>
                </div>
                <div class="result-item" style="text-align: center; padding: var(--space-3); background: var(--bg-tertiary); border-radius: var(--radius-md);">
                    <span class="result-label" style="font-size: var(--font-size-xs); color: var(--text-muted);">Net Sales</span>
                    <span class="result-value" style="display: block; font-weight: 700;">${results.actualSales}</span>
                </div>
                <div class="result-item result-highlight" style="text-align: center; padding: var(--space-3); background: var(--accent-primary); border-radius: var(--radius-md);">
                    <span class="result-label" style="font-size: var(--font-size-xs); color: rgba(255,255,255,0.8);">Net Profit</span>
                    <span class="result-value" style="display: block; font-weight: 800; color: white; font-size: var(--font-size-xl);">${profitPrefix}$${Math.abs(results.netProfit)}</span>
                </div>
            </div>
            <button id="new-campaign" class="btn btn-secondary" style="width: 100%; margin-top: var(--space-4);">
                Run Another Campaign (${GameState.state.dropshipping.adAttempts} left)
            </button>
        `;

        resultsDiv.classList.remove('hidden');

        // Show toast based on result
        if (results.netProfit > 100) {
            UI.showToast(`Great campaign! +$${results.netProfit} profit!`, 'success', '🎉');
        } else if (results.netProfit > 0) {
            UI.showToast(`Small profit: +$${results.netProfit}`, 'success', '💵');
        } else if (results.netProfit === 0) {
            UI.showToast('Break even campaign', 'warning', '😐');
        } else {
            UI.showToast(`Campaign lost $${Math.abs(results.netProfit)}`, 'error', '📉');
        }

        // New campaign button
        document.getElementById('new-campaign')?.addEventListener('click', () => {
            resultsDiv.classList.add('hidden');
            this.render();
        });
    },

    reset() {
        this.selectedProduct = null;
        this.adBudget = 50;
    }
};

window.DropshippingModule = DropshippingModule;
