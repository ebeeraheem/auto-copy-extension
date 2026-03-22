// Auto-Copy Text Extension - Background Script
// Manages extension state and settings

// Initialize default settings
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        enabled: true,
        blacklistedDomains: [],
        whitelistedDomains: [],
        useWhitelist: false,
        notificationPosition: 'top-right',
        notificationDuration: 2000
    });
});

// Helper function to get settings
function getSettings(sendResponse) {
    chrome.storage.local.get([
        'enabled', 'blacklistedDomains', 'whitelistedDomains', 'useWhitelist',
        'notificationPosition', 'notificationDuration'
    ], (result) => {
        sendResponse({
            enabled: result.enabled !== false,
            blacklistedDomains: result.blacklistedDomains || [],
            whitelistedDomains: result.whitelistedDomains || [],
            useWhitelist: result.useWhitelist || false,
            notificationPosition: result.notificationPosition || 'top-right',
            notificationDuration: result.notificationDuration || 2000
        });
    });
}

// Helper function to notify content scripts
function notifyContentScripts(request, callback) {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
                chrome.tabs.sendMessage(tab.id, request, () => {
                    // Ignore errors for tabs that don't have the content script
                    if (chrome.runtime.lastError) {
                        // Silent fail
                    }
                });
            }
        });
        callback();
    });
}

// Helper function to update settings
function updateSettings(request, sendResponse) {
    chrome.storage.local.set(request.settings, () => {
        // Notify all content scripts of the change
        notifyContentScripts(request, () => {
            sendResponse({ success: true });
        });
    });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        getSettings(sendResponse);
        return true; // Keep message channel open for async response
    }

    if (request.action === 'updateSettings') {
        updateSettings(request, sendResponse);
        return true;
    }

    if (request.action === 'exportSettings') {
        chrome.storage.local.get(null, (result) => {
            sendResponse({ settings: result });
        });
        return true;
    }

    if (request.action === 'importSettings') {
        chrome.storage.local.set(request.settings, () => {
            // Notify all content scripts of the change
            notifyContentScripts({ action: 'updateSettings', settings: request.settings }, () => {
                sendResponse({ success: true });
            });
        });
        return true;
    }
});
