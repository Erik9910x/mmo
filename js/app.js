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
    updateLanguageUI(); // Initialize language display
});

// Global language toggle function
function toggleLanguage() {
    const newLang = i18n.toggle();
    updateLanguageUI();
    UI.showToast(newLang === 'vi' ? 'Đã đổi sang Tiếng Việt' : 'Switched to English', 'info', '🌐');

    // Re-render dynamic content
    UI.renderPathsGrid();
    UI.renderLeaderboard();
}

// Update all UI text based on current language
function updateLanguageUI() {
    const lang = i18n.getLang();
    const langDisplay = lang.toUpperCase();

    // Update language toggle buttons
    const welcomeLangSpan = document.getElementById('current-lang-welcome');
    if (welcomeLangSpan) welcomeLangSpan.textContent = langDisplay;

    // Update welcome screen
    const welcomeSubtitle = document.querySelector('.welcome-subtitle');
    if (welcomeSubtitle) welcomeSubtitle.textContent = i18n.t('welcome_subtitle');

    const welcomeDesc = document.querySelector('.welcome-description');
    if (welcomeDesc) welcomeDesc.textContent = i18n.t('welcome_description');

    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.innerHTML = i18n.t('start_challenge') + ' →';

    const welcomeNote = document.querySelector('.welcome-note');
    if (welcomeNote) welcomeNote.textContent = i18n.t('simulation_note');

    // Update challenge preview
    const challengeItems = document.querySelectorAll('.challenge-item span:not(.challenge-icon)');
    const challengeLabels = ['Limited Time', 'Manage Energy', 'Score Points', 'Fail Conditions'];
    const challengeLabelsVI = ['Thời Gian Giới Hạn', 'Quản Lý Năng Lượng', 'Tính Điểm', 'Điều Kiện Thất Bại'];
    challengeItems.forEach((item, idx) => {
        item.textContent = lang === 'vi' ? challengeLabelsVI[idx] : challengeLabels[idx];
    });

    // Update disclaimer modal
    const disclaimerTitle = document.querySelector('.disclaimer-content h2');
    if (disclaimerTitle) disclaimerTitle.textContent = i18n.t('disclaimer_title');

    const disclaimerText = document.querySelector('.disclaimer-text');
    if (disclaimerText) disclaimerText.innerHTML = i18n.t('disclaimer_text');

    const acceptBtn = document.getElementById('accept-disclaimer-btn');
    if (acceptBtn) acceptBtn.textContent = i18n.t('understand_start');

    // Update dashboard labels
    const balanceLabel = document.querySelector('.balance-label');
    if (balanceLabel) balanceLabel.textContent = i18n.t('balance');

    // Update stat labels
    const statLabels = {
        'Strategy Score': i18n.t('strategy_score'),
        'Risk Score': i18n.t('risk_score'),
        'Total Profit': i18n.t('total_profit'),
        'Total Loss': i18n.t('total_loss'),
        'Decisions': i18n.t('actions'),
        'Best Trade': lang === 'vi' ? 'Giao Dịch Tốt Nhất' : 'Best Trade'
    };

    document.querySelectorAll('.stat-label').forEach(label => {
        const key = label.textContent;
        if (statLabels[key]) label.textContent = statLabels[key];
    });

    // Update section titles
    const pathsTitle = document.querySelector('.paths-section .section-title');
    if (pathsTitle) pathsTitle.textContent = '🎯 ' + (lang === 'vi' ? 'Thử Thách MMO' : 'MMO Challenges');

    const pathsSubtitle = document.querySelector('.section-subtitle');
    if (pathsSubtitle) pathsSubtitle.textContent = i18n.t('path_subtitle');

    const historyTitle = document.querySelector('.history-section .section-title');
    if (historyTitle) historyTitle.textContent = lang === 'vi' ? 'Nhật Ký Quyết Định' : 'Decision Log';

    const leaderboardTitle = document.querySelector('.leaderboard-section .section-title');
    if (leaderboardTitle) leaderboardTitle.textContent = '🏆 ' + i18n.t('leaderboard');

    // Update buttons
    const advanceDayBtn = document.getElementById('advance-day-btn');
    if (advanceDayBtn) advanceDayBtn.textContent = lang === 'vi' ? 'Ngày Tiếp →' : 'Next Day →';

    const endSessionBtn = document.getElementById('end-session-btn');
    if (endSessionBtn) endSessionBtn.textContent = i18n.t('end_session');

    // Update resource labels
    const energyLabel = document.querySelector('.resource-label');
    if (energyLabel && energyLabel.textContent.includes('Energy')) {
        energyLabel.innerHTML = '⚡ ' + i18n.t('energy');
    }

    document.querySelectorAll('.resource-label').forEach(label => {
        if (label.textContent.includes('Stress') || label.textContent.includes('Căng')) {
            label.innerHTML = '😰 ' + i18n.t('stress');
        } else if (label.textContent.includes('Energy') || label.textContent.includes('Năng')) {
            label.innerHTML = '⚡ ' + i18n.t('energy');
        }
    });

    // Update chart title
    const chartTitle = document.querySelector('.chart-container h3');
    if (chartTitle) chartTitle.textContent = lang === 'vi' ? 'Lịch Sử Số Dư' : 'Balance History';
}

window.App = App;
window.toggleLanguage = toggleLanguage;
window.updateLanguageUI = updateLanguageUI;
