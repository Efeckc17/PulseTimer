export const DEFAULT_SETTINGS = {
    work: {
        name: 'Work Time',
        hours: 0,
        minutes: 25
    },
    break: {
        name: 'Break Time',
        hours: 0,
        minutes: 5,
        intervalHours: 0,
        intervalMinutes: 25
    },
    notifications: {
        sound: true,
        desktop: true
    }
};

export const STORAGE_KEYS = {
    SETTINGS: 'pulseTimer_settings',
    HISTORY: 'pulseTimer_history',
    NOTIFICATION_PREFERENCE: 'pulseTimer_notifications'
};

export const NOTIFICATION_SOUNDS = {
    WORK_START: '/sounds/start.mp3',
    BREAK_START: '/sounds/break-start.mp3',
    SESSION_END: '/sounds/end.mp3'
}; 