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

document.addEventListener('DOMContentLoaded', () => {
    // Get all UI elements
    const enabledCheckbox = document.getElementById('enabled');
    const blacklistMode = document.getElementById('blacklistMode');
    const whitelistMode = document.getElementById('whitelistMode');
    const blacklistDomains = document.getElementById('blacklistDomains');
    const whitelistDomains = document.getElementById('whitelistDomains');
    const notificationPosition = document.getElementById('notificationPosition');
    const notificationDuration = document.getElementById('notificationDuration');
    const saveButton = document.getElementById('save');
    const status = document.getElementById('status');

    // Settings management elements
    const exportSettingsBtn = document.getElementById('exportSettings');
    const importSettingsBtn = document.getElementById('importSettings');
    const importFile = document.getElementById('importFile');

    // Load current settings
    loadSettings();

    // Event listeners
    saveButton.addEventListener('click', saveSettings);
    exportSettingsBtn.addEventListener('click', exportSettings);
    importSettingsBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', importSettings);

    async function loadSettings() {
        try {
            const response = await sendMessage({ action: 'getSettings' });

            enabledCheckbox.checked = response.enabled;
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
