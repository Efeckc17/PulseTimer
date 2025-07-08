import { timer } from './timer.js';
import { notificationManager } from './notifications.js';
import { historyManager } from './history.js';

// UI
const toggleTimerBtn = document.getElementById('toggleTimer');
const toggleSettingsBtn = document.getElementById('toggleSettings');
const timerDisplay = document.querySelector('.timer-display');
const settingsPanel = document.querySelector('.settings-panel');
const timeSpans = document.querySelectorAll('.time-section span');


toggleTimerBtn.addEventListener('click', () => {
    const isVisible = !timerDisplay.classList.contains('masked');
    
    if (isVisible) {
       
        timerDisplay.classList.add('masked');
        timeSpans.forEach(span => {
            span.dataset.originalText = span.textContent;
            span.textContent = '**';
        });
    } else {
       
        timerDisplay.classList.remove('masked');
        timeSpans.forEach(span => {
            span.textContent = span.dataset.originalText || span.textContent;
        });
    }
    
    const icon = toggleTimerBtn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});


toggleSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('collapsed');
    toggleSettingsBtn.classList.toggle('collapsed');
});


const originalUpdateDisplay = timer.updateDisplay;
timer.updateDisplay = function() {
    originalUpdateDisplay.call(this);
    if (timerDisplay.classList.contains('masked')) {
        timeSpans.forEach(span => {
            span.textContent = '**';
        });
    }
};

window.pulseTimer = {
    timer,
    notificationManager,
    historyManager
}; 