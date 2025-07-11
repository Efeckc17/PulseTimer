import { NOTIFICATION_SOUNDS, STORAGE_KEYS } from './config.js';

class AudioManager {
    constructor() {
        this.enabled = true;
        this.initialized = false;
        this.audioContext = null;
    }

    initialize() {
        const preferences = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCE) || 'null');
        if (preferences) {
            this.enabled = preferences.sound;
        }

        document.addEventListener('click', () => {
            if (!this.initialized) {
                this.initializeAudio();
            }
        });

        const soundCheckbox = document.getElementById('soundNotification');
        if (soundCheckbox) {
            soundCheckbox.checked = this.enabled;
            soundCheckbox.addEventListener('change', () => {
                this.enabled = soundCheckbox.checked;
                this.updatePreferences();
            });
        }
    }

    async initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            this.initialized = true;
        } catch (error) {
            console.log('Audio initialization failed:', error);
            this.enabled = false;
            const soundCheckbox = document.getElementById('soundNotification');
            if (soundCheckbox) {
                soundCheckbox.checked = false;
            }
            this.updatePreferences();
        }
    }

    updatePreferences() {
        const preferences = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCE) || '{}');
        preferences.sound = this.enabled;
        localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFERENCE, JSON.stringify(preferences));
    }

    async playSound(soundType) {
        if (!this.enabled) return;

        if (!this.initialized) {
            await this.initializeAudio();
        }

        try {
            const audio = new Audio(soundType);
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Audio playback failed:', error);
                    if (error.name === 'NotAllowedError') {
                        this.initialized = false;
                    }
                });
            }
        } catch (e) {
            console.log('Audio playback failed:', e);
        }
    }

    playWorkStart() {
        return this.playSound(NOTIFICATION_SOUNDS.WORK_START);
    }

    playBreakStart() {
        return this.playSound(NOTIFICATION_SOUNDS.BREAK_START);
    }

    playSessionEnd() {
        return this.playSound(NOTIFICATION_SOUNDS.SESSION_END);
    }
}

const audioManager = new AudioManager();

export { audioManager }; 