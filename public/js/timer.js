import { DEFAULT_SETTINGS, STORAGE_KEYS } from './config.js';
import { notificationManager } from './notifications.js';
import { audioManager } from './audio.js';
import { historyManager } from './history.js';

class Timer {
    constructor() {
        this.workSeconds = 0;
        this.totalWorkSeconds = 0;
        this.workInterval = null;
        this.isWorkRunning = false;

        this.breakSeconds = 0;
        this.breakInterval = null;
        this.isBreak = false;

        
        this.settings = { ...DEFAULT_SETTINGS };

        this.initializeElements();
        this.bindEventListeners();
        this.loadSettings();
        this.updateDisplay();
    }

    initializeElements() {
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.workNameInput = document.getElementById('workName');
        this.workHoursInput = document.getElementById('workHours');
        this.workMinutesInput = document.getElementById('workMinutes');
        
        this.breakIntervalMinutesInput = document.getElementById('breakIntervalMinutes');
        this.breakMinutesInput = document.getElementById('breakMinutes');
        this.breakNoteInput = document.getElementById('breakNote');
        
        this.breakOverlay = document.getElementById('breakOverlay');
        this.breakTimeLeft = document.getElementById('breakTimeLeft');
        this.breakNoteDisplay = document.getElementById('breakNoteDisplay');
        this.skipBreakBtn = document.getElementById('skipBreak');
        
        this.sessionNameElement = document.getElementById('sessionName');
        this.sessionProgressElement = document.getElementById('sessionProgress');
    }

    bindEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());

        const handleBreakSettingChange = (event) => {
            const input = event.target;
            let value = parseInt(input.value);

            if (isNaN(value) || value < 1) {
                value = 1;
            } else if (value > 30) {
                value = 30;
            }
            input.value = value;

            this.settings.break.minutes = value;
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));

            if (this.isBreak) {
                this.updateDisplay();
            }
        };

        const handleWorkSettingChange = () => {
            this.totalWorkSeconds = (parseInt(this.workHoursInput.value) * 3600) + 
                              (parseInt(this.workMinutesInput.value) * 60);
            
            if (!this.isWorkRunning) {
                this.workSeconds = this.totalWorkSeconds;
                this.updateDisplay();
            }
            this.saveSettings();
        };

        this.breakMinutesInput.addEventListener('input', handleBreakSettingChange);
        this.breakMinutesInput.addEventListener('change', handleBreakSettingChange);

        [this.workHoursInput, this.workMinutesInput].forEach(input => {
            input.addEventListener('input', handleWorkSettingChange);
            input.addEventListener('change', handleWorkSettingChange);
        });

        this.breakIntervalMinutesInput.addEventListener('input', () => {
            let value = parseInt(this.breakIntervalMinutesInput.value);
            if (isNaN(value) || value < 1) {
                value = 25;
                this.breakIntervalMinutesInput.value = value;
            }
            this.saveSettings();
            if (!this.isWorkRunning) {
                this.totalWorkSeconds = this.totalWorkSeconds - (value * 60);
            }
        });

        [this.workNameInput, this.breakNoteInput].forEach(input => {
            input.addEventListener('change', () => this.saveSettings());
        });

        this.skipBreakBtn.addEventListener('click', () => this.skipBreak());
    }

    loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || 'null');
        if (savedSettings) {
            this.settings = savedSettings;
            
            this.workNameInput.value = this.settings.work.name;
            this.workHoursInput.value = this.settings.work.hours;
            this.workMinutesInput.value = this.settings.work.minutes;
            this.breakIntervalMinutesInput.value = this.settings.break.intervalMinutes;
            this.breakMinutesInput.value = this.settings.break.minutes;
        }
        
        this.totalWorkSeconds = (parseInt(this.workHoursInput.value) * 3600) + 
                               (parseInt(this.workMinutesInput.value) * 60);
        this.workSeconds = this.totalWorkSeconds;
    }

    saveSettings() {
        let breakMinutes = parseInt(this.breakMinutesInput.value);
        if (isNaN(breakMinutes) || breakMinutes < 1) {
            breakMinutes = 5;
            this.breakMinutesInput.value = 5;
        }

        this.settings = {
            work: {
                name: this.workNameInput.value,
                hours: parseInt(this.workHoursInput.value) || 2,
                minutes: parseInt(this.workMinutesInput.value) || 0
            },
            break: {
                minutes: breakMinutes,
                intervalMinutes: parseInt(this.breakIntervalMinutesInput.value) || 25
            }
        };
        
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    }

    start() {
        if (!this.isWorkRunning && !this.isBreak) {
            this.isWorkRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            
            notificationManager.notify(
                'Work Session Started',
                { body: 'Your work session has started' }
            );
            audioManager.playWorkStart();
            
            this.workInterval = setInterval(() => {
                if (this.workSeconds > 0) {
                    this.workSeconds--;
                    this.updateDisplay();
                    
                    const breakIntervalSeconds = parseInt(this.breakIntervalMinutesInput.value) * 60;
                    if (this.workSeconds > 0 && this.workSeconds % breakIntervalSeconds === 0) {
                        this.startBreak();
                    }
                } else {
                    this.sessionComplete();
                }
            }, 1000);
            
            historyManager.addEntry({
                action: 'Started Work',
                sessionName: this.workNameInput.value,
                duration: this.formatTime(this.workSeconds)
            });
        }
    }

    pause() {
        if (this.isWorkRunning) {
            this.isWorkRunning = false;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            clearInterval(this.workInterval);
            
            historyManager.addEntry({
                action: 'Paused',
                sessionName: this.workNameInput.value,
                duration: this.formatTime(this.workSeconds)
            });
        }
    }

    reset() {
        this.pause();
        this.workSeconds = this.totalWorkSeconds;
        
        if (this.isBreak) {
            clearInterval(this.breakInterval);
            this.isBreak = false;
            this.breakOverlay.classList.add('hidden');
        }
        
        this.updateDisplay();
        
        historyManager.addEntry({
            action: 'Reset',
            sessionName: this.workNameInput.value
        });
    }

    startBreak() {
        clearInterval(this.workInterval);
        this.isBreak = true;
        
        this.breakSeconds = parseInt(this.breakMinutesInput.value) * 60;
        this.breakNoteDisplay.textContent = this.breakNoteInput.value || 'Take a refreshing break!';
        this.breakOverlay.classList.remove('hidden');
        
        this.updateBreakDisplay(); 
        this.breakInterval = setInterval(() => {
            if (this.breakSeconds > 0) {
                this.breakSeconds--;
                this.updateBreakDisplay();
            } else {
                this.endBreak();
            }
        }, 1000);
        
        notificationManager.notify(
            'Break Time!',
            { body: this.breakNoteInput.value || 'Time for a short break!' }
        );
        audioManager.playBreakStart();
        
        historyManager.addEntry({
            action: 'Started Break',
            sessionName: this.workNameInput.value,
            note: this.breakNoteInput.value
        });
    }

    endBreak() {
        clearInterval(this.breakInterval);
        this.isBreak = false;
        this.breakOverlay.classList.add('hidden');
        
        if (this.workSeconds > 0) {
            this.isWorkRunning = true;
            this.workInterval = setInterval(() => {
                if (this.workSeconds > 0) {
                    this.workSeconds--;
                    this.updateDisplay();
                    
                    const breakIntervalSeconds = parseInt(this.breakIntervalMinutesInput.value) * 60;
                    if (this.workSeconds > 0 && this.workSeconds % breakIntervalSeconds === 0) {
                        this.startBreak();
                    }
                } else {
                    this.sessionComplete();
                }
            }, 1000);
        }
        
        notificationManager.notify(
            'Break Complete!',
            { body: 'Time to get back to work!' }
        );
        
        historyManager.addEntry({
            action: 'Ended Break',
            sessionName: this.workNameInput.value
        });
    }

    skipBreak() {
        clearInterval(this.breakInterval);
        this.isBreak = false;
        this.breakOverlay.classList.add('hidden');
        
        if (this.workSeconds > 0) {
            this.isWorkRunning = true;
            this.workInterval = setInterval(() => {
                if (this.workSeconds > 0) {
                    this.workSeconds--;
                    this.updateDisplay();
                    
                    
                    const breakIntervalSeconds = parseInt(this.breakIntervalMinutesInput.value) * 60;
                    if (this.workSeconds > 0 && this.workSeconds % breakIntervalSeconds === 0) {
                        this.startBreak();
                    }
                } else {
                    this.sessionComplete();
                }
            }, 1000);
        }
        
        historyManager.addEntry({
            action: 'Skipped Break',
            sessionName: this.workNameInput.value
        });
    }

    sessionComplete() {
        this.pause();
        notificationManager.notify(
            'Session Complete!',
            { body: 'Great job! You\'ve completed your work session.' }
        );
        audioManager.playSessionEnd();
        
        historyManager.addEntry({
            action: 'Completed',
            sessionName: this.workNameInput.value,
            duration: this.formatTime(this.totalWorkSeconds)
        });
    }

    updateDisplay() {
        const hours = Math.floor(this.workSeconds / 3600);
        const minutes = Math.floor((this.workSeconds % 3600) / 60);
        const seconds = this.workSeconds % 60;

        this.hoursElement.textContent = this.padNumber(hours);
        this.minutesElement.textContent = this.padNumber(minutes);
        this.secondsElement.textContent = this.padNumber(seconds);

        this.updateSessionInfo();
    }

    updateBreakDisplay() {
        const minutes = Math.floor(this.breakSeconds / 60);
        const seconds = this.breakSeconds % 60;
        if (this.breakTimeLeft) {
            this.breakTimeLeft.textContent = `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
        }
    }

    updateSessionInfo() {
        this.sessionNameElement.textContent = this.isBreak ? 'Break Time' : this.workNameInput.value;
        const progress = ((this.totalWorkSeconds - this.workSeconds) / this.totalWorkSeconds * 100).toFixed(1);
        this.sessionProgressElement.textContent = `Progress: ${progress}%`;
    }

    formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${this.padNumber(h)}:${this.padNumber(m)}:${this.padNumber(s)}`;
    }

    padNumber(number) {
        return number.toString().padStart(2, '0');
    }
}

export const timer = new Timer(); 