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
    const enabledCheckbox = document.getElementById('enabled');
    const blacklistMode = document.getElementById('blacklistMode');
    const whitelistMode = document.getElementById('whitelistMode');
    const blacklistDomains = document.getElementById('blacklistDomains');
    const whitelistDomains = document.getElementById('whitelistDomains');
    const saveButton = document.getElementById('save');
    const status = document.getElementById('status');

    // Load current settings
    loadSettings();

    // Save settings when button is clicked
    saveButton.addEventListener('click', saveSettings);

    async function loadSettings() {
        try {
            const response = await sendMessage({ action: 'getSettings' });
            
            enabledCheckbox.checked = response.enabled;
            
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
                    .filter(domain => domain.length > 0)
            };

            await sendMessage({ action: 'updateSettings', settings });
            showStatus('Settings saved successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to save settings:', error);
            showStatus('Failed to save settings', 'error');
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
