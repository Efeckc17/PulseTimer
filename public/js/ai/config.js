const AI_CONFIG = {
    API_ENDPOINT: '/api/ai/analyze',
    MODEL: 'openai/gpt-3.5-turbo',
    MAX_TOKENS: 150,
    TEMPERATURE: 0.7,
    STORAGE_KEY: 'pulseTimer_ai_preferences'
};

const AI_PRESETS = {
    study: {
        name: 'Study Session',
        workMinutes: 25,
        breakMinutes: 5,
        breakInterval: 25,
        description: 'Perfect for focused learning and retention'
    },
    deep_work: {
        name: 'Deep Work',
        workMinutes: 90,
        breakMinutes: 15,
        breakInterval: 90,
        description: 'Extended focus periods for complex tasks'
    },
    creative: {
        name: 'Creative Flow',
        workMinutes: 45,
        breakMinutes: 10,
        breakInterval: 45,
        description: 'Optimal for creative and artistic work'
    },
    coding: {
        name: 'Coding Sprint',
        workMinutes: 30,
        breakMinutes: 5,
        breakInterval: 30,
        description: 'Ideal for programming and development'
    },
    meeting: {
        name: 'Meeting Blocks',
        workMinutes: 60,
        breakMinutes: 15,
        breakInterval: 60,
        description: 'Structured time for meetings and calls'
    },
    writing: {
        name: 'Writing Session',
        workMinutes: 50,
        breakMinutes: 10,
        breakInterval: 50,
        description: 'Sustained focus for writing and content creation'
    },
    research: {
        name: 'Research Mode',
        workMinutes: 40,
        breakMinutes: 8,
        breakInterval: 40,
        description: 'Deep dive into research and analysis'
    },
    exercise: {
        name: 'Workout Timer',
        workMinutes: 20,
        breakMinutes: 2,
        breakInterval: 20,
        description: 'High-intensity intervals for fitness'
    }
};

const AI_PROMPTS = {
    goal_analysis: `You are a productivity expert. Analyze the user's goal and recommend the most suitable timer settings. 

User's goal: "{goal}"

Based on this goal, recommend:
1. Work session duration (in minutes)
2. Break duration (in minutes) 
3. Break interval (how often to take breaks, in minutes)
4. Brief reason for these settings

Respond in this exact JSON format:
{
  "workMinutes": number,
  "breakMinutes": number, 
  "breakInterval": number,
  "reason": "brief explanation"
}`,

    preset_recommendation: `You are a productivity coach. The user wants to optimize their timer for: "{goal}"

Available presets: study, deep_work, creative, coding, meeting, writing, research, exercise

Recommend the best preset and explain why in 1-2 sentences.

Respond in this exact JSON format:
{
  "preset": "preset_name",
  "reason": "brief explanation"
}`
};

export { AI_CONFIG, AI_PRESETS, AI_PROMPTS }; 