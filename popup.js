// Auto-Copy Text Extension - Popup Script
// Manages extension settings interface

function sendMessage(message) {
    return new Promise((resolve, reject) => {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        } else if (typeof browser !== 'undefined' && browser.runtime) {
            browser.runtime.sendMessage(message)
                .then(resolve)
                .catch(reject);
        } else {
            reject(new Error('Extension API not available'));
        }
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

document.addEventListener('DOMContentLoaded', () => {
    // Get all UI elements
    const enabledCheckbox = document.getElementById('enabled');
    const blacklistMode = document.getElementById('blacklistMode');
    const whitelistMode = document.getElementById('whitelistMode');
    const blacklistDomains = document.getElementById('blacklistDomains');
    const whitelistDomains = document.getElementById('whitelistDomains');
    const trimWhitespace = document.getElementById('trimWhitespace');
    const avoidDuplicates = document.getElementById('avoidDuplicates');
    const minTextLength = document.getElementById('minTextLength');
    const notificationPosition = document.getElementById('notificationPosition');
    const notificationDuration = document.getElementById('notificationDuration');
    const saveButton = document.getElementById('save');
    const status = document.getElementById('status');
    
    // History elements
    const viewHistoryBtn = document.getElementById('viewHistory');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const historyPanel = document.getElementById('historyPanel');
    const closeHistoryBtn = document.getElementById('closeHistory');
    const historyList = document.getElementById('historyList');
    
    // Settings management elements
    const exportSettingsBtn = document.getElementById('exportSettings');
    const importSettingsBtn = document.getElementById('importSettings');
    const importFile = document.getElementById('importFile');

    // Load current settings
    loadSettings();

    // Event listeners
    saveButton.addEventListener('click', saveSettings);
    viewHistoryBtn.addEventListener('click', showHistory);
    clearHistoryBtn.addEventListener('click', clearHistory);
    closeHistoryBtn.addEventListener('click', hideHistory);
    exportSettingsBtn.addEventListener('click', exportSettings);
    importSettingsBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', importSettings);

    async function loadSettings() {
        try {
            const response = await sendMessage({ action: 'getSettings' });
            
            enabledCheckbox.checked = response.enabled;
            trimWhitespace.checked = response.trimWhitespace;
            avoidDuplicates.checked = response.avoidDuplicates;
            minTextLength.value = response.minTextLength || 3;
            notificationPosition.value = response.notificationPosition || 'top-right';
            notificationDuration.value = response.notificationDuration || 2000;
            
            if (response.useWhitelist) {
                whitelistMode.checked = true;
            } else {
                blacklistMode.checked = true;
            }
            
            blacklistDomains.value = (response.blacklistedDomains || []).join('\n');
            whitelistDomains.value = (response.whitelistedDomains || []).join('\n');
            
        } catch (error) {
            console.error('Failed to load settings:', error);
            showStatus('Failed to load settings', 'error');
        }
    }

    async function saveSettings() {
        try {
            const settings = {
                enabled: enabledCheckbox.checked,
                useWhitelist: whitelistMode.checked,
                blacklistedDomains: blacklistDomains.value
                    .split('\n')
                    .map(domain => domain.trim())
                    .filter(domain => domain.length > 0),
                whitelistedDomains: whitelistDomains.value
                    .split('\n')
                    .map(domain => domain.trim())
                    .filter(domain => domain.length > 0),
                trimWhitespace: trimWhitespace.checked,
                avoidDuplicates: avoidDuplicates.checked,
                minTextLength: Number.parseInt(minTextLength.value) || 3,
                notificationPosition: notificationPosition.value,
                notificationDuration: Number.parseInt(notificationDuration.value) || 2000
            };

            await sendMessage({ action: 'updateSettings', settings });
            showStatus('Settings saved successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to save settings:', error);
            showStatus('Failed to save settings', 'error');
        }
    }

    async function showHistory() {
        try {
            const response = await sendMessage({ action: 'getHistory' });
            const history = response.history || [];
            
            historyList.innerHTML = '';
            
            if (history.length === 0) {
                historyList.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">No history yet</div>';
            } else {
                history.forEach((text, index) => {
                    const item = document.createElement('div');
                    item.className = 'history-item';
                    item.textContent = truncateText(text, 80);
                    item.title = text; // Show full text on hover
                    item.addEventListener('click', () => copyFromHistory(text));
                    historyList.appendChild(item);
                });
            }
            
            historyPanel.classList.remove('hidden');
        } catch (error) {
            console.error('Failed to load history:', error);
            showStatus('Failed to load history', 'error');
        }
    }

    function hideHistory() {
        historyPanel.classList.add('hidden');
    }

    async function clearHistory() {
        if (confirm('Are you sure you want to clear the copy history?')) {
            try {
                await sendMessage({ action: 'clearHistory' });
                showStatus('History cleared successfully!', 'success');
                hideHistory();
            } catch (error) {
                console.error('Failed to clear history:', error);
                showStatus('Failed to clear history', 'error');
            }
        }
    }

    async function copyFromHistory(text) {
        try {
            // Send message to current tab to copy the text
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'copyFromHistory', text });
                showStatus('Copied from history!', 'success');
                hideHistory();
            }
        } catch (error) {
            console.error('Failed to copy from history:', error);
            showStatus('Failed to copy from history', 'error');
        }
    }

    async function exportSettings() {
        try {
            const response = await sendMessage({ action: 'exportSettings' });
            const settings = response.settings;
            
            const dataStr = JSON.stringify(settings, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = 'auto-copy-settings.json';
            link.click();
            
            showStatus('Settings exported successfully!', 'success');
        } catch (error) {
            console.error('Failed to export settings:', error);
            showStatus('Failed to export settings', 'error');
        }
    }

    async function importSettings() {
        const file = importFile.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const settings = JSON.parse(text);
            
            await sendMessage({ action: 'importSettings', settings });
            showStatus('Settings imported successfully!', 'success');
            
            // Reload the popup to show imported settings
            setTimeout(() => {
                loadSettings();
            }, 1000);
            
        } catch (error) {
            console.error('Failed to import settings:', error);
            showStatus('Failed to import settings - invalid file', 'error');
        }
    }

    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        
        setTimeout(() => {
            status.textContent = '';
            status.className = 'status';
        }, 3000);
    }
});
