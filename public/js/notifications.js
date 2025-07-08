import { NOTIFICATION_SOUNDS, STORAGE_KEYS } from './config.js';

class NotificationManager {
    constructor() {
        this.soundEnabled = true;
        this.desktopEnabled = true;
        this.initialized = false;
    }

    initialize() {
        this.dialog = document.getElementById('notificationDialog');
        this.enableBtn = document.getElementById('enableNotifications');
        this.skipBtn = document.getElementById('skipNotifications');
        this.soundCheckbox = document.getElementById('soundNotification');
        this.desktopCheckbox = document.getElementById('desktopNotification');

        this.bindEvents();
        this.loadPreferences();
        
        if ('Notification' in window && Notification.permission === 'default') {
            this.showPermissionDialog();
        }
    }

    bindEvents() {
        this.enableBtn.addEventListener('click', () => this.requestPermission());
        this.skipBtn.addEventListener('click', () => this.skipNotifications());
        this.soundCheckbox.addEventListener('change', () => this.updatePreferences());
        this.desktopCheckbox.addEventListener('change', () => this.updatePreferences());
    }

    loadPreferences() {
        const preferences = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCE) || 'null');
        
        if (preferences) {
            this.soundEnabled = preferences.sound;
            this.desktopEnabled = preferences.desktop;
            this.soundCheckbox.checked = preferences.sound;
            this.desktopCheckbox.checked = preferences.desktop;
            this.initialized = true;
        } else {
            this.showPermissionDialog();
        }
    }

    updatePreferences() {
        this.soundEnabled = this.soundCheckbox.checked;
        this.desktopEnabled = this.desktopCheckbox.checked;
        
        localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFERENCE, JSON.stringify({
            sound: this.soundEnabled,
            desktop: this.desktopEnabled
        }));
    }

    showPermissionDialog() {
        if ('Notification' in window && !this.initialized) {
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                this.dialog.classList.remove('hidden');
            } else {
                this.desktopEnabled = Notification.permission === 'granted';
                this.desktopCheckbox.checked = this.desktopEnabled;
                this.initialized = true;
                this.updatePreferences();
            }
        }
    }

    async requestPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.desktopEnabled = permission === 'granted';
            this.desktopCheckbox.checked = this.desktopEnabled;
        }
        
        this.initialized = true;
        this.dialog.classList.add('hidden');
        this.updatePreferences();
    }

    skipNotifications() {
        this.desktopEnabled = false;
        this.desktopCheckbox.checked = false;
        this.initialized = true;
        this.dialog.classList.add('hidden');
        this.updatePreferences();
    }

    notify(title, options = {}) {
        if (this.soundEnabled) {
            this.playSound();
        }

        if (this.desktopEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/favicon.ico',
                ...options
            });
        }
    }

    playSound() {
        const audio = new Audio(NOTIFICATION_SOUNDS.WORK_COMPLETE);
        audio.play().catch(e => console.log('Audio playback failed:', e));
    }
}

const notificationManager = new NotificationManager();

document.addEventListener('DOMContentLoaded', () => {
    notificationManager.initialize();
});

export { notificationManager }; 