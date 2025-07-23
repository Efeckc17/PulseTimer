import { AI_CONFIG, AI_PROMPTS } from './config.js';

class AIService {
    constructor() {
        this.apiEndpoint = AI_CONFIG.API_ENDPOINT;
    }

    async makeRequest(prompt, type = 'analyze') {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    type: type,
                    maxTokens: AI_CONFIG.MAX_TOKENS,
                    temperature: AI_CONFIG.TEMPERATURE
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.fallback) {
                throw new Error('AI service temporarily unavailable');
            }
            
            return data.result;
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Failed to get AI response. Please try again.');
        }
    }

    async analyzeGoal(goal) {
        try {
            const prompt = AI_PROMPTS.goal_analysis.replace('{goal}', goal);
            const response = await this.makeRequest(prompt, 'goal_analysis');
            return JSON.parse(response);
        } catch (error) {
            console.error('Goal analysis failed:', error);
            return this.getFallbackSettings();
        }
    }

    async recommendPreset(goal) {
        try {
            const prompt = AI_PROMPTS.preset_recommendation.replace('{goal}', goal);
            const response = await this.makeRequest(prompt, 'preset_recommendation');
            return JSON.parse(response);
        } catch (error) {
            console.error('Preset recommendation failed:', error);
            return { preset: 'study', reason: 'Default recommendation for general productivity' };
        }
    }

    getFallbackSettings() {
        return {
            workMinutes: 25,
            breakMinutes: 5,
            breakInterval: 25,
            reason: 'Default Pomodoro technique settings'
        };
    }
}

export const aiService = new AIService(); 