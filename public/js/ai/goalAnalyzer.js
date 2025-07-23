import { aiService } from './service.js';
import { AI_PRESETS } from './config.js';

class GoalAnalyzer {
    constructor() {
        this.currentGoal = null;
        this.currentSettings = null;
        this.analysisCache = new Map();
    }

    async processUserGoal(goal) {
        if (!goal || goal.trim().length < 3) {
            throw new Error('Please provide a more detailed goal');
        }

        const normalizedGoal = goal.toLowerCase().trim();
        
        if (this.analysisCache.has(normalizedGoal)) {
            return this.analysisCache.get(normalizedGoal);
        }

        this.currentGoal = goal;

        try {
            const [customSettings, presetRecommendation] = await Promise.all([
                aiService.analyzeGoal(goal),
                aiService.recommendPreset(goal)
            ]);

            const analysis = {
                goal: goal,
                customSettings: customSettings,
                recommendedPreset: presetRecommendation,
                presetDetails: AI_PRESETS[presetRecommendation.preset] || AI_PRESETS.study,
                timestamp: Date.now()
            };

            this.analysisCache.set(normalizedGoal, analysis);
            this.currentSettings = analysis;

            return analysis;
        } catch (error) {
            console.error('Goal analysis failed:', error);
            return this.getDefaultAnalysis(goal);
        }
    }

    getDefaultAnalysis(goal) {
        const defaultPreset = this.detectPresetFromKeywords(goal);
        
        return {
            goal: goal,
            customSettings: {
                workMinutes: defaultPreset.workMinutes,
                breakMinutes: defaultPreset.breakMinutes,
                breakInterval: defaultPreset.breakInterval,
                reason: 'Detected from keywords in your goal'
            },
            recommendedPreset: {
                preset: this.getPresetKey(defaultPreset),
                reason: 'Based on keyword analysis'
            },
            presetDetails: defaultPreset,
            timestamp: Date.now()
        };
    }

    detectPresetFromKeywords(goal) {
        const goalLower = goal.toLowerCase();
        
        if (goalLower.includes('study') || goalLower.includes('learn') || goalLower.includes('exam')) {
            return AI_PRESETS.study;
        }
        if (goalLower.includes('code') || goalLower.includes('program') || goalLower.includes('develop')) {
            return AI_PRESETS.coding;
        }
        if (goalLower.includes('write') || goalLower.includes('article') || goalLower.includes('blog')) {
            return AI_PRESETS.writing;
        }
        if (goalLower.includes('creative') || goalLower.includes('design') || goalLower.includes('art')) {
            return AI_PRESETS.creative;
        }
        if (goalLower.includes('research') || goalLower.includes('analysis') || goalLower.includes('investigate')) {
            return AI_PRESETS.research;
        }
        if (goalLower.includes('meeting') || goalLower.includes('call') || goalLower.includes('discussion')) {
            return AI_PRESETS.meeting;
        }
        if (goalLower.includes('workout') || goalLower.includes('exercise') || goalLower.includes('fitness')) {
            return AI_PRESETS.exercise;
        }
        if (goalLower.includes('deep') || goalLower.includes('focus') || goalLower.includes('complex')) {
            return AI_PRESETS.deep_work;
        }
        
        return AI_PRESETS.study;
    }

    getPresetKey(presetObject) {
        for (const [key, preset] of Object.entries(AI_PRESETS)) {
            if (preset === presetObject) {
                return key;
            }
        }
        return 'study';
    }

    getCurrentAnalysis() {
        return this.currentSettings;
    }

    clearCache() {
        this.analysisCache.clear();
    }
}

export const goalAnalyzer = new GoalAnalyzer(); 