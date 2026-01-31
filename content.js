// Auto-Copy Text Extension - Content Script
// Automatically copies selected text to clipboard

(function() {
    'use strict';

    // Extension state
    let isEnabled = true;
    let blacklistedDomains = [];
    let whitelistedDomains = [];
    let useWhitelist = false;

    // Initialize extension settings
    initializeSettings();

    // Listen for selection changes
    document.addEventListener('mouseup', handleSelection);

    async function initializeSettings() {
        try {
            // Get stored settings
            const result = await getStorageData(['enabled', 'blacklistedDomains', 'whitelistedDomains', 'useWhitelist']);
            
            isEnabled = result.enabled !== false; // Default to true
            blacklistedDomains = result.blacklistedDomains || [];
            whitelistedDomains = result.whitelistedDomains || [];
            useWhitelist = result.useWhitelist || false;

            // Check if current domain is allowed
            if (!isDomainAllowed()) {
                return; // Exit if domain is not allowed
            }
        } catch (error) {
            console.error('Auto-Copy: Settings initialization failed:', error);
        }
    }

    function getStorageData(keys) {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.get(keys, resolve);
            } else if (typeof browser !== 'undefined' && browser.storage) {
                browser.storage.local.get(keys).then(resolve);
            } else {
                resolve({});
            }
        });
    }

    function isDomainAllowed() {
        const currentDomain = globalThis.location.hostname;

        if (useWhitelist) {
            return whitelistedDomains.some(domain => 
                currentDomain.includes(domain) || domain.includes(currentDomain)
            );
        } else {
            return !blacklistedDomains.some(domain => 
                currentDomain.includes(domain) || domain.includes(currentDomain)
            );
        }
    }

    function handleSelection(event) {
        // Only process if mouse button was released (actual selection)
        if (event.button === 0) { // Left mouse button
            processSelection();
        }
    }

    async function processSelection() {
        if (!isEnabled || !isDomainAllowed()) {
            return;
        }

        const selection = globalThis.getSelection();
        const selectedText = selection.toString();

        // Ignore empty selections or whitespace-only selections
        if (!selectedText || selectedText.length === 0) {
            return;
        }

        try {
            await copyToClipboard(selectedText);
            showNotification('Text copied to clipboard');
        } catch (error) {
            console.error('Auto-Copy: Failed to copy text:', error);
        }
    }

    async function copyToClipboard(text) {
        if (navigator?.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return;
            } catch (error) {
                console.error('Auto-Copy: Modern clipboard API failed:', error);
            }
        }
    }

    function showNotification(message) {
        // Create subtle notification
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;

        document.body.appendChild(notification);

        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 2000);
    }

    // Listen for settings changes from popup
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'updateSettings') {
                isEnabled = request.settings.enabled;
                blacklistedDomains = request.settings.blacklistedDomains || [];
                whitelistedDomains = request.settings.whitelistedDomains || [];
                useWhitelist = request.settings.useWhitelist || false;
            }
        });
    }
})();
