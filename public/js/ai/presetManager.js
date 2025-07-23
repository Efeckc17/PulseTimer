import { AI_PRESETS, AI_CONFIG } from './config.js';
import { goalAnalyzer } from './goalAnalyzer.js';

class PresetManager {
    constructor() {
        this.activePreset = null;
        this.customSettings = null;
        this.userPreferences = this.loadUserPreferences();
    }

    async applyAIRecommendation(analysis) {
        const { customSettings, recommendedPreset, presetDetails } = analysis;
        
        this.activePreset = recommendedPreset.preset;
        this.customSettings = customSettings;
        
        this.saveUserPreferences({
            lastGoal: analysis.goal,
            lastPreset: recommendedPreset.preset,
            lastSettings: customSettings,
            timestamp: Date.now()
        });

        return {
            preset: presetDetails,
            custom: customSettings,
            applied: true
        };
    }

    applyPreset(presetKey) {
        if (!AI_PRESETS[presetKey]) {
            throw new Error(`Preset '${presetKey}' not found`);
        }

        const preset = AI_PRESETS[presetKey];
        this.activePreset = presetKey;
        
        return {
            workMinutes: preset.workMinutes,
            breakMinutes: preset.breakMinutes,
            breakInterval: preset.breakInterval,
            name: preset.name,
            description: preset.description
        };
    }

    getPresetList() {
        return Object.entries(AI_PRESETS).map(([key, preset]) => ({
            key,
            ...preset,
            isActive: this.activePreset === key
        }));
    }

    getActivePreset() {
        return this.activePreset ? AI_PRESETS[this.activePreset] : null;
    }

    getCustomSettings() {
        return this.customSettings;
    }

    createCustomPreset(name, settings) {
        const customKey = `custom_${Date.now()}`;
        const customPreset = {
            name: name,
            workMinutes: settings.workMinutes,
            breakMinutes: settings.breakMinutes,
            breakInterval: settings.breakInterval,
            description: 'Custom AI-generated preset',
            isCustom: true
        };

        const savedPresets = this.getSavedCustomPresets();
        savedPresets[customKey] = customPreset;
        this.saveCustomPresets(savedPresets);

        return customKey;
    }

    getSavedCustomPresets() {
        try {
            return JSON.parse(localStorage.getItem('pulseTimer_custom_presets')) || {};
        } catch {
            return {};
        }
    }

    saveCustomPresets(presets) {
        localStorage.setItem('pulseTimer_custom_presets', JSON.stringify(presets));
    }

    deleteCustomPreset(presetKey) {
        const savedPresets = this.getSavedCustomPresets();
        delete savedPresets[presetKey];
        this.saveCustomPresets(savedPresets);
    }

    getAllPresets() {
        const builtInPresets = this.getPresetList();
        const customPresets = Object.entries(this.getSavedCustomPresets()).map(([key, preset]) => ({
            key,
            ...preset,
            isActive: this.activePreset === key
        }));

        return [...builtInPresets, ...customPresets];
    }

    loadUserPreferences() {
        try {
            return JSON.parse(localStorage.getItem(AI_CONFIG.STORAGE_KEY)) || {};
        } catch {
            return {};
        }
    }

    saveUserPreferences(preferences) {
        this.userPreferences = { ...this.userPreferences, ...preferences };
        localStorage.setItem(AI_CONFIG.STORAGE_KEY, JSON.stringify(this.userPreferences));
    }

    getLastUsedSettings() {
        return this.userPreferences.lastSettings || null;
    }

    getLastGoal() {
        return this.userPreferences.lastGoal || null;
    }

    clearPreferences() {
        this.userPreferences = {};
        localStorage.removeItem(AI_CONFIG.STORAGE_KEY);
        localStorage.removeItem('pulseTimer_custom_presets');
    }
}

export const presetManager = new PresetManager(); 