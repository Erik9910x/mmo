// Main Application Controller with Challenge System

const App = {
    init() {
        // Initialize game state
        GameState.init();

        // Setup initial UI
        this.setupEventListeners();
        UI.renderPathsGrid();
        UI.renderLeaderboard();

        // Check if there's an existing session
        if (GameState.state.sessionStarted && GameState.state.balance > 0 && !GameState.state.sessionEnded) {
            // Resume session
            UI.showScreen('dashboard-screen');
            UI.initBalanceChart();
            UI.updateAll();
        } else {
            // Show welcome screen
            UI.showScreen('welcome-screen');
        }
    },

    setupEventListeners() {
        // Start button
        document.getElementById('start-btn')?.addEventListener('click', () => {
            UI.showModal('disclaimer-modal');
        });

        // Accept disclaimer
        document.getElementById('accept-disclaimer-btn')?.addEventListener('click', () => {
            UI.hideModal('disclaimer-modal');
            this.startSession();
        });

        // Path cards - delegate to paths grid
        document.getElementById('paths-grid')?.addEventListener('click', (e) => {
            const card = e.target.closest('.path-card');
            if (card && !card.classList.contains('failed')) {
                const path = card.dataset.path;
                this.navigateToPath(path);
            }
        });

        // Achievements button
        document.getElementById('achievements-btn')?.addEventListener('click', () => {
            UI.renderAchievements();
            UI.showModal('achievements-modal');
        });

        // Advance day button
        document.getElementById('advance-day-btn')?.addEventListener('click', () => {
            this.advanceDay();
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) modal.classList.remove('active');
            });
        });

        // Close modal on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // End session button
        document.getElementById('end-session-btn')?.addEventListener('click', () => {
            this.endSession();
        });

        // Restart button (in result modal)
        document.addEventListener('click', (e) => {
            if (e.target.id === 'restart-btn') {
                UI.hideModal('result-modal');
                this.restart();
            }
        });

        // Back buttons in modules
        document.addEventListener('click', (e) => {
            const backBtn = e.target.closest('[data-back]');
            if (backBtn) {
                const target = backBtn.dataset.back;
                if (target === 'dashboard') {
                    // Stop any running intervals
                    TradingModule.stopPriceUpdates();

                    UI.showScreen('dashboard-screen');
                    UI.updateAll();
                }
            }
        });
    },

    startSession() {
        GameState.startSession();
        UI.showScreen('dashboard-screen');
        UI.initBalanceChart();
        UI.updateAll();
        UI.showToast('Challenge started! You have $1,000 and 7 days.', 'success', '🎯');
    },

    advanceDay() {
        const canContinue = GameState.advanceDay();

        if (!canContinue) {
            // Max days reached
            UI.showToast('Final day complete!', 'info', '📅');
            this.endSession();
            return;
        }

        // Check for random events
        this.triggerRandomEvent();

        UI.showToast(`Day ${GameState.state.currentDay} started!`, 'info', '📅');
        UI.updateAll();
    },

    triggerRandomEvent() {
        // Random market events that affect all paths
        const events = [
            {
                chance: 5,
                message: '📰 Market crash! All positions affected.',
                effect: () => { GameState.state.stress = Math.min(100, GameState.state.stress + 20); }
            },
            {
                chance: 5,
                message: '🌟 Great market day! Reduced stress.',
                effect: () => { GameState.recoverEnergy(20); }
            },
            {
                chance: 3,
                message: '⚡ Energy boost from morning coffee!',
                effect: () => { GameState.recoverEnergy(15); }
            },
            {
                chance: 4,
                message: '😴 Poor sleep last night. Energy reduced.',
                effect: () => { GameState.consumeEnergy(15); }
            }
        ];

        for (const event of events) {
            if (Random.chance(event.chance)) {
                event.effect();
                UI.showToast(event.message, 'warning', '📢');
                break;
            }
        }
    },

    navigateToPath(path) {
        const modules = {
            freelance: FreelanceModule,
            affiliate: AffiliateModule,
            dropshipping: DropshippingModule,
            trading: TradingModule
        };

        const module = modules[path];
        if (module) {
            UI.showScreen(`${path}-screen`);
            module.init();
        }
    },

    endSession() {
        // Stop any running processes
        TradingModule.stopPriceUpdates();

        GameState.endSession();
        UI.renderResults();
        UI.showModal('result-modal');
    },

    restart() {
        // Reset all modules
        FreelanceModule.reset();
        AffiliateModule.reset();
        DropshippingModule.reset();
        TradingModule.reset();

        // Reset game state
        GameState.reset();

        // Show welcome screen
        UI.showScreen('welcome-screen');
        UI.showToast('Ready for a new challenge!', 'info', '🔄');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.App = App;
