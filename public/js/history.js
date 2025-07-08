import { STORAGE_KEYS } from './config.js';

class HistoryManager {
    constructor() {
        this.history = [];
        this.historyList = document.getElementById('historyList');
        this.loadHistory();
    }

    loadHistory() {
        const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
        this.history = savedHistory;
        this.renderHistory();
    }

    saveHistory() {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(this.history));
    }

    addEntry(entry) {
        const now = new Date();
        const historyEntry = {
            ...entry,
            timestamp: now.toISOString(),
            timeString: now.toLocaleTimeString()
        };

        this.history.unshift(historyEntry);
        
        // only last 50 
        if (this.history.length > 50) {
            this.history.pop();
        }

        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = '';
        
        this.history.forEach(entry => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const mainInfo = document.createElement('div');
            mainInfo.className = 'history-main-info';
            mainInfo.innerHTML = `
                <span class="history-time">${entry.timeString}</span>
                <span class="history-action">${entry.action} ${entry.sessionName}</span>
            `;

            const details = document.createElement('div');
            details.className = 'history-details';
            
            if (entry.duration) {
                details.innerHTML += `<span>Duration: ${entry.duration}</span>`;
            }
            
            if (entry.note) {
                details.innerHTML += `<span class="history-note">${entry.note}</span>`;
            }

            historyItem.appendChild(mainInfo);
            if (details.innerHTML) {
                historyItem.appendChild(details);
            }

            this.historyList.appendChild(historyItem);
        });
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.renderHistory();
    }
}

export const historyManager = new HistoryManager(); 