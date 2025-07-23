import { goalAnalyzer } from './goalAnalyzer.js';
import { presetManager } from './presetManager.js';
import { AI_PRESETS } from './config.js';

class AIUI {
    constructor() {
        this.isOpen = false;
        this.isProcessing = false;
        this.currentAnalysis = null;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.createAIInterface();
        
        setTimeout(() => {
            this.aiPanel = document.getElementById('aiPanel');
            this.aiToggle = document.getElementById('aiToggle');
            this.goalInput = document.getElementById('aiGoalInput');
            this.analyzeBtn = document.getElementById('aiAnalyzeBtn');
            this.resultsContainer = document.getElementById('aiResults');
            this.presetsContainer = document.getElementById('aiPresets');
    
            
            console.log('AI Elements initialized:', {
                aiPanel: !!this.aiPanel,
                aiToggle: !!this.aiToggle,
                goalInput: !!this.goalInput,
                analyzeBtn: !!this.analyzeBtn,
                resultsContainer: !!this.resultsContainer,
                presetsContainer: !!this.presetsContainer,

            });
        }, 0);
    }

    createAIInterface() {
        const aiHTML = `
            <button id="aiToggle" class="ai-toggle">
                <i class="fas fa-robot"></i>
                <span>AI Assistant</span>
            </button>

            <div id="aiPanel" class="ai-panel hidden">
                <div class="ai-header">
                    <h3><i class="fas fa-robot"></i> AI Timer Assistant</h3>
                    <button id="aiClose" class="ai-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="ai-content">
                    <div class="ai-input-section">
                        <label for="aiGoalInput">What do you want to focus on?</label>
                        <textarea id="aiGoalInput" placeholder="e.g., Study for my physics exam, Deep work on coding project, Creative writing session..."></textarea>
                    </div>

                    <div class="ai-action-section">
                        <button id="aiAnalyzeBtn" class="ai-analyze-btn">
                            <i class="fas fa-robot"></i>
                            <span>Get AI Recommendations</span>
                        </button>
                    </div>

                                         <div id="aiResults" class="ai-results hidden"></div>

                    <div class="ai-presets-section">
                        <h4><i class="fas fa-bookmark"></i> Quick Presets</h4>
                        <div id="aiPresets" class="ai-presets-grid"></div>
                    </div>
                </div>
            </div>
        `;

        const settingsPanel = document.querySelector('.settings-panel');
        settingsPanel.insertAdjacentHTML('beforebegin', aiHTML);
    }

    bindEvents() {
        setTimeout(() => {
            if (this.aiToggle) {
                this.aiToggle.addEventListener('click', () => this.togglePanel());
            }
            
            const aiClose = document.getElementById('aiClose');
            if (aiClose) {
                aiClose.addEventListener('click', () => this.closePanel());
            }
            
            if (this.analyzeBtn) {
                this.analyzeBtn.addEventListener('click', () => this.analyzeGoal());
            }
            
            if (this.goalInput) {
                this.goalInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        this.analyzeGoal();
                    }
                });
            }

            this.renderPresets();
        }, 50);
    }

    togglePanel() {
        this.isOpen = !this.isOpen;
        this.aiPanel.classList.toggle('hidden', !this.isOpen);
        
        if (this.isOpen) {
            this.goalInput.focus();
            this.loadLastGoal();
        }
    }

    closePanel() {
        this.isOpen = false;
        this.aiPanel.classList.add('hidden');
    }

    loadLastGoal() {
        const lastGoal = presetManager.getLastGoal();
        if (lastGoal && !this.goalInput.value) {
            this.goalInput.value = lastGoal;
        }
    }

    async analyzeGoal() {
        const goal = this.goalInput.value.trim();
        
        if (!goal) {
            this.showError('Please describe what you want to focus on');
            return;
        }

        if (this.isProcessing) return;

        this.isProcessing = true;
        this.analyzeBtn.disabled = true;
                    this.analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Analyzing...</span>';

        try {
            const analysis = await goalAnalyzer.processUserGoal(goal);
            this.currentAnalysis = analysis;
            this.displayResults(analysis);
        } catch (error) {
            this.showError(error.message || 'Something went wrong. Please try again.');
        } finally {
            this.isProcessing = false;
            this.analyzeBtn.disabled = false;
            this.analyzeBtn.innerHTML = '<i class="fas fa-robot"></i> <span>Get AI Recommendations</span>';
        }
    }

    displayResults(analysis) {
        console.log('displayResults called with:', analysis);
        
        if (!analysis || !analysis.customSettings || !analysis.recommendedPreset) {
            console.error('Invalid analysis data:', analysis);
            this.showError('Invalid response from AI. Please try again.');
            return;
        }

        const { customSettings, recommendedPreset, presetDetails } = analysis;
        
        const resultsHTML = `
            <div class="ai-recommendation">
                <h4><i class="fas fa-lightbulb"></i> AI Recommendations</h4>
                
                <div class="recommendation-cards">
                    <div class="recommendation-card custom">
                        <h5><i class="fas fa-cog"></i> Custom Settings</h5>
                        <div class="settings-preview">
                            <span>Work: ${customSettings.workMinutes}min</span>
                            <span>Break: ${customSettings.breakMinutes}min</span>
                            <span>Interval: ${customSettings.breakInterval}min</span>
                        </div>
                        <p class="reason">${customSettings.reason}</p>
                        <button class="btn btn-primary apply-btn" data-type="custom">
                            Apply Custom Settings
                        </button>
                    </div>

                    <div class="recommendation-card preset">
                        <h5><i class="fas fa-bookmark"></i> ${presetDetails.name}</h5>
                        <div class="settings-preview">
                            <span>Work: ${presetDetails.workMinutes}min</span>
                            <span>Break: ${presetDetails.breakMinutes}min</span>
                            <span>Interval: ${presetDetails.breakInterval}min</span>
                        </div>
                        <p class="reason">${recommendedPreset.reason}</p>
                        <button class="btn btn-secondary apply-btn" data-type="preset" data-preset="${recommendedPreset.preset}">
                            Apply ${presetDetails.name}
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.resultsContainer.innerHTML = resultsHTML;
        this.resultsContainer.classList.remove('hidden');

        this.bindResultEvents();
    }

    bindResultEvents() {
        const applyButtons = this.resultsContainer.querySelectorAll('.apply-btn');
        applyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                const preset = e.target.dataset.preset;
                this.applyRecommendation(type, preset);
            });
        });
    }

    applyRecommendation(type, presetKey = null) {
        let settings;

        if (type === 'custom' && this.currentAnalysis) {
            settings = this.currentAnalysis.customSettings;
        } else if (type === 'preset' && presetKey) {
            settings = presetManager.applyPreset(presetKey);
        } else {
            return;
        }

        this.updateTimerSettings(settings);
        this.showSuccess(`Applied ${type === 'custom' ? 'custom' : settings.name} settings!`);
        
        setTimeout(() => this.closePanel(), 1500);
    }

    updateTimerSettings(settings) {
        const workHoursInput = document.getElementById('workHours');
        const workMinutesInput = document.getElementById('workMinutes');
        const breakMinutesInput = document.getElementById('breakMinutes');
        const breakIntervalInput = document.getElementById('breakIntervalMinutes');
        const workNameInput = document.getElementById('workName');

        if (workHoursInput) workHoursInput.value = Math.floor(settings.workMinutes / 60);
        if (workMinutesInput) workMinutesInput.value = settings.workMinutes % 60;
        if (breakMinutesInput) breakMinutesInput.value = settings.breakMinutes;
        if (breakIntervalInput) breakIntervalInput.value = settings.breakInterval || settings.workMinutes;
        if (workNameInput && settings.name) workNameInput.value = settings.name;

        const changeEvent = new Event('change', { bubbles: true });
        workMinutesInput?.dispatchEvent(changeEvent);
    }

    renderPresets() {
        const presets = Object.entries(AI_PRESETS).slice(0, 6);
        
        const presetsHTML = presets.map(([key, preset]) => `
            <div class="preset-card" data-preset="${key}">
                <h5>${preset.name}</h5>
                <div class="preset-timing">
                    ${preset.workMinutes}/${preset.breakMinutes}min
                </div>
                <p>${preset.description}</p>
            </div>
        `).join('');

        this.presetsContainer.innerHTML = presetsHTML;

        this.presetsContainer.querySelectorAll('.preset-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const presetKey = e.currentTarget.dataset.preset;
                this.applyRecommendation('preset', presetKey);
            });
        });
    }



    showError(message) {
        this.resultsContainer.innerHTML = `
            <div class="ai-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
        this.resultsContainer.classList.remove('hidden');
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'ai-success';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        this.aiPanel.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

export const aiUI = new AIUI(); 