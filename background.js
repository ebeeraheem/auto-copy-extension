// Auto-Copy Text Extension - Background Script
// Manages extension state and settings

// Initialize default settings
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        enabled: true,
        blacklistedDomains: [],
        whitelistedDomains: [],
        useWhitelist: false
    });
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        chrome.storage.local.get(['enabled', 'blacklistedDomains', 'whitelistedDomains', 'useWhitelist'], (result) => {
            sendResponse({
                enabled: result.enabled !== false,
                blacklistedDomains: result.blacklistedDomains || [],
                whitelistedDomains: result.whitelistedDomains || [],
                useWhitelist: result.useWhitelist || false
            });
        });
        return true; // Keep message channel open for async response
    }

    if (request.action === 'updateSettings') {
        chrome.storage.local.set(request.settings, () => {
            // Notify all content scripts of the change
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
            });
            sendResponse({ success: true });
        });
        return true;
    }
});