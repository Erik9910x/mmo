// Freelance MMO Module - Time & Skill Challenge

const FreelanceModule = {
    skillLevels: {
        beginner: {
            name: 'Beginner',
            emoji: '🌱',
            payRange: [15, 40],
            successRate: 85,
            timeMultiplier: 1.5,
            jobTypes: ['Data Entry', 'Simple Writing', 'Basic Design', 'Social Media Posts']
        },
        skilled: {
            name: 'Skilled',
            emoji: '⚡',
            payRange: [50, 150],
            successRate: 70,
            timeMultiplier: 1.0,
            jobTypes: ['Web Development', 'Content Writing', 'Logo Design', 'Video Editing']
        },
        expert: {
            name: 'Expert',
            emoji: '🏆',
            payRange: [200, 500],
            successRate: 55,
            timeMultiplier: 0.8,
            jobTypes: ['App Development', 'Brand Strategy', 'AI/ML Projects', 'Consulting']
        }
    },

    selectedSkill: null,
    currentJobs: [],

    init() {
        this.selectedSkill = GameState.state.freelance.skillLevel;
        this.render();
    },

    render() {
        const screen = document.getElementById('freelance-screen');
        if (!screen) return;

        const fl = GameState.state.freelance;

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
                    <div class="module-icon">💼</div>
                    <h1>Freelance Challenge</h1>
                    <p>Complete jobs within limited hours. Manage reputation and avoid burnout!</p>
                </div>

                <!-- Challenge Resources -->
                <div class="module-resources">
                    <div class="module-resource">
                        <span class="module-resource-value ${fl.timeRemaining <= 10 ? 'negative' : ''}">${fl.timeRemaining}h</span>
                        <span class="module-resource-label">Time Left</span>
                    </div>
                    <div class="module-resource">
                        <span class="module-resource-value ${fl.reputation <= 30 ? 'negative' : fl.reputation >= 80 ? 'positive' : ''}">${fl.reputation}%</span>
                        <span class="module-resource-label">Reputation</span>
                    </div>
                    <div class="module-resource">
                        <span class="module-resource-value">${fl.jobsCompleted}</span>
                        <span class="module-resource-label">Jobs Done</span>
                    </div>
                    <div class="module-resource">
                        <span class="module-resource-value">${Math.round(GameState.state.energy)}%</span>
                        <span class="module-resource-label">Energy</span>
                    </div>
                </div>

                ${fl.failed ? this.renderFailed() : (this.selectedSkill ? this.renderJobsView() : this.renderSkillSelect())}
            </div>
        `;

        this.setupEventListeners();
    },

    renderFailed() {
        return `
            <div class="challenge-failed">
                <div class="failed-icon">💀</div>
                <h2>Challenge Failed!</h2>
                <p>${GameState.state.freelance.timeRemaining <= 0 ? 'You ran out of time!' : 'Your reputation hit zero!'}</p>
                <p class="reality-note">In real freelancing, time management and reputation are everything.</p>
                <button class="btn btn-secondary" data-back="dashboard">Return to Dashboard</button>
            </div>
        `;
    },

    renderSkillSelect() {
        return `
            <div class="skill-selection">
                <h2>Choose Your Skill Level</h2>
                <p style="color: var(--text-muted); text-align: center; margin-bottom: var(--space-6);">
                    Higher skills = Higher pay but harder to succeed!
                </p>
                <div class="skill-options">
                    ${Object.entries(this.skillLevels).map(([id, skill]) => `
                        <div class="skill-card" data-skill="${id}">
                            <div class="skill-emoji">${skill.emoji}</div>
                            <h3>${skill.name}</h3>
                            <div class="skill-stats">
                                <p>💰 $${skill.payRange[0]} - $${skill.payRange[1]}</p>
                                <p>✅ ${skill.successRate}% success rate</p>
                                <p>⏱️ ${skill.timeMultiplier > 1 ? 'Slower' : skill.timeMultiplier < 1 ? 'Faster' : 'Normal'} work</p>
                            </div>
                            <button class="btn btn-skill">Select ${skill.name}</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderJobsView() {
        const skill = this.skillLevels[this.selectedSkill];

        if (this.currentJobs.length === 0) {
            this.generateJobs();
        }

        return `
            <div class="jobs-dashboard">
                <div class="skill-badge" style="text-align: center; margin-bottom: var(--space-4);">
                    <span style="font-size: 2rem;">${skill.emoji}</span>
                    <h3>${skill.name} Freelancer</h3>
                </div>
                
                <div class="jobs-header">
                    <h3>Available Jobs</h3>
                    <button class="btn btn-secondary" id="refresh-jobs">🔄 Refresh (-2h)</button>
                </div>

                <div class="jobs-grid">
                    ${this.currentJobs.map((job, i) => `
                        <div class="job-card ${job.urgent ? 'urgent' : ''}" data-job-index="${i}">
                            ${job.urgent ? '<span class="urgent-badge">⚡ URGENT</span>' : ''}
                            <h4>${job.title}</h4>
                            <div class="job-details">
                                <span class="job-pay positive">+$${job.pay}</span>
                                <span class="job-time">⏱️ ${job.hours}h</span>
                            </div>
                            <div class="job-risk">
                                <span class="risk-badge risk-${job.risk}">${job.successRate}% success</span>
                            </div>
                            <div class="job-stress">
                                <span>😰 +${job.stress} stress</span>
                            </div>
                            <button class="btn btn-primary take-job-btn" 
                                ${GameState.state.freelance.timeRemaining < job.hours ? 'disabled' : ''}>
                                Take Job
                            </button>
                        </div>
                    `).join('')}
                </div>

                <button class="btn btn-secondary" id="rest-btn" style="width: 100%; margin-top: var(--space-4);">
                    😴 Rest (-4h, recover energy & reduce stress)
                </button>
            </div>
        `;
    },

    generateJobs() {
        const skill = this.skillLevels[this.selectedSkill];
        this.currentJobs = [];

        const numJobs = Random.between(3, 5);

        for (let i = 0; i < numJobs; i++) {
            const baseHours = Random.between(2, 8) * skill.timeMultiplier;
            const hours = Math.round(baseHours);
            const pay = Random.between(skill.payRange[0], skill.payRange[1]);
            const urgent = Random.chance(15);

            // Urgent jobs pay more but have time pressure
            const urgentMultiplier = urgent ? 1.5 : 1;

            // If overworked, success rate drops
            const energyPenalty = GameState.state.energy < 30 ? -15 : 0;
            const stressPenalty = GameState.state.stress > 70 ? -10 : 0;

            const baseSuccessRate = skill.successRate + energyPenalty + stressPenalty;

            this.currentJobs.push({
                title: Random.pick(skill.jobTypes),
                pay: Math.round(pay * urgentMultiplier),
                hours,
                successRate: Math.max(20, baseSuccessRate),
                risk: baseSuccessRate >= 70 ? 'low' : baseSuccessRate >= 50 ? 'medium' : 'high',
                stress: urgent ? 20 : Random.between(5, 15),
                urgent
            });
        }
    },

    setupEventListeners() {
        // Skill selection
        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectSkill(card.dataset.skill);
            });
        });

        // Take job buttons
        document.querySelectorAll('.take-job-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.job-card');
                const index = parseInt(card.dataset.jobIndex);
                this.takeJob(index);
            });
        });

        // Refresh jobs
        document.getElementById('refresh-jobs')?.addEventListener('click', () => {
            if (GameState.state.freelance.timeRemaining >= 2) {
                GameState.state.freelance.timeRemaining -= 2;
                GameState.save();
                this.currentJobs = [];
                this.generateJobs();
                this.render();
                UI.showToast('Found new jobs! (-2h)', 'info', '🔄');
            } else {
                UI.showToast('Not enough time!', 'error', '❌');
            }
        });

        // Rest button
        document.getElementById('rest-btn')?.addEventListener('click', () => {
            if (GameState.state.freelance.timeRemaining >= 4) {
                GameState.state.freelance.timeRemaining -= 4;
                GameState.recoverEnergy(40);
                GameState.save();
                this.render();
                UI.showToast('Rested and recovered!', 'success', '😴');
                UI.updateResources();
            } else {
                UI.showToast('Not enough time to rest!', 'error', '❌');
            }
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

    selectSkill(skillId) {
        this.selectedSkill = skillId;
        GameState.state.freelance.skillLevel = skillId;
        GameState.save();

        this.generateJobs();
        this.render();

        UI.showToast(`Selected ${this.skillLevels[skillId].name} level!`, 'success', this.skillLevels[skillId].emoji);
    },

    takeJob(jobIndex) {
        const job = this.currentJobs[jobIndex];
        if (!job) return;

        const fl = GameState.state.freelance;

        // Check time
        if (fl.timeRemaining < job.hours) {
            UI.showToast('Not enough time for this job!', 'error', '⏱️');
            return;
        }

        // Consume resources
        fl.timeRemaining -= job.hours;
        GameState.consumeEnergy(job.hours * 5);
        GameState.state.stress = Math.min(100, GameState.state.stress + job.stress);

        // Calculate success with stress/energy penalty
        const stressPenalty = GameState.state.stress > 50 ? (GameState.state.stress - 50) / 5 : 0;
        const finalSuccessRate = Math.max(10, job.successRate - stressPenalty);

        const success = Random.chance(finalSuccessRate);

        if (success) {
            // Check for bonus outcomes
            const outcome = this.calculateOutcome(job);

            const result = GameState.updateBalance(outcome.amount, outcome.description, 'freelance',
                job.risk === 'high' ? 'high' : job.risk === 'medium' ? 'medium' : 'low');

            fl.jobsCompleted++;
            fl.reputation = Math.min(100, fl.reputation + 5);
            GameState.state.freelanceJobsCompleted++;

            UI.showToast(outcome.message, 'success', outcome.icon);
            result.newAchievements.forEach(a => UI.showAchievementUnlock(a));

        } else {
            // Failed job outcomes
            const failOutcome = this.calculateFailure(job);

            fl.reputation = Math.max(0, fl.reputation + failOutcome.repChange);

            if (failOutcome.amount !== 0) {
                GameState.updateBalance(failOutcome.amount, failOutcome.description, 'freelance', 'high');
            }

            GameState.recordDecision('reckless', 'high');

            UI.showToast(failOutcome.message, 'error', failOutcome.icon);
        }

        GameState.save();

        // Check fail conditions
        const fails = GameState.checkFailConditions();
        if (fails.length > 0) {
            this.render();
            fails.forEach(f => UI.showFailCondition(f));
            return;
        }

        // Remove job and regenerate
        this.currentJobs.splice(jobIndex, 1);
        if (this.currentJobs.length === 0) {
            this.generateJobs();
        }

        this.render();
        UI.updateAll();
    },

    calculateOutcome(job) {
        const rand = Random.between(1, 100);

        if (rand <= 10) {
            // Tip bonus
            const tip = Math.round(job.pay * 0.3);
            return {
                amount: job.pay + tip,
                description: `${job.title} + tip bonus`,
                message: `Great work! Client tipped $${tip} extra!`,
                icon: '🌟'
            };
        } else if (rand <= 20) {
            // Late payment (reduced)
            const reduced = Math.round(job.pay * 0.8);
            return {
                amount: reduced,
                description: `${job.title} (late penalty)`,
                message: `Late delivery - paid $${reduced} instead of $${job.pay}`,
                icon: '⏰'
            };
        } else {
            // Normal completion
            return {
                amount: job.pay,
                description: `${job.title} completed`,
                message: `Job completed! +$${job.pay}`,
                icon: '✅'
            };
        }
    },

    calculateFailure(job) {
        const rand = Random.between(1, 100);

        if (rand <= 30) {
            // Client cancelled - no pay, reputation hit
            return {
                amount: 0,
                repChange: -20,
                description: 'Client cancelled',
                message: 'Client cancelled! No payment, reputation damaged.',
                icon: '😠'
            };
        } else if (rand <= 60) {
            // Dispute - partial refund
            const refund = Math.round(job.pay * 0.5);
            return {
                amount: -refund,
                repChange: -10,
                description: 'Dispute refund',
                message: `Dispute! Had to refund $${refund}`,
                icon: '⚖️'
            };
        } else {
            // Ghosted - time wasted
            return {
                amount: 0,
                repChange: -5,
                description: 'Client ghosted',
                message: 'Client stopped responding. Time wasted!',
                icon: '👻'
            };
        }
    },

    reset() {
        this.selectedSkill = null;
        this.currentJobs = [];
    }
};

window.FreelanceModule = FreelanceModule;
