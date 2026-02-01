// Auto-Copy Text Extension - Content Script
// Automatically copies selected text to clipboard

(function() {
    'use strict';

    // Extension state
    let isEnabled = true;
    let blacklistedDomains = [];
    let whitelistedDomains = [];
    let useWhitelist = false;
    let minTextLength = 3;
    let trimWhitespace = true;
    let avoidDuplicates = true;
    let notificationPosition = 'top-right';
    let notificationDuration = 2000;
    let lastCopiedText = '';
    let copyHistory = [];
    let selectionTimeout;

    // Initialize extension settings
    initializeSettings();

    // Listen for selection changes with debouncing
    document.addEventListener('mouseup', handleSelection);

    async function initializeSettings() {
        try {
            // Get stored settings
            const result = await getStorageData([
                'enabled', 'blacklistedDomains', 'whitelistedDomains', 'useWhitelist',
                'minTextLength', 'trimWhitespace', 'avoidDuplicates', 
                'notificationPosition', 'notificationDuration', 'copyHistory'
            ]);
            
            isEnabled = result.enabled !== false; // Default to true
            blacklistedDomains = result.blacklistedDomains || [];
            whitelistedDomains = result.whitelistedDomains || [];
            useWhitelist = result.useWhitelist || false;
            minTextLength = result.minTextLength || 3;
            trimWhitespace = result.trimWhitespace !== false;
            avoidDuplicates = result.avoidDuplicates !== false;
            notificationPosition = result.notificationPosition || 'top-right';
            notificationDuration = result.notificationDuration || 2000;
            copyHistory = result.copyHistory || [];

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
            debounceSelection();
        }
    }

    function debounceSelection() {
        // Clear existing timeout
        if (selectionTimeout) {
            clearTimeout(selectionTimeout);
        }
        
        // Set new timeout to avoid processing rapid selections
        selectionTimeout = setTimeout(processSelection, 200);
    }

    async function processSelection() {
        if (!isEnabled || !isDomainAllowed()) {
            return;
        }

        const selection = globalThis.getSelection();
        let selectedText = selection.toString();

        // Apply text processing
        selectedText = processText(selectedText);

        // Ignore empty selections, whitespace-only selections, or text below minimum length
        if (!selectedText || selectedText.length < minTextLength) {
            return;
        }

        // Avoid duplicates if enabled
        if (avoidDuplicates && selectedText === lastCopiedText) {
            return;
        }

        try {
            await copyToClipboard(selectedText);
            lastCopiedText = selectedText;
            
            // Add to history
            addToHistory(selectedText);
            
            showNotification(`Text copied: "${truncateText(selectedText, 50)}"`);
        } catch (error) {
            console.error('Auto-Copy: Failed to copy text:', error);
            showNotification('Failed to copy text', 'error');
        }
    }

    function processText(text) {
        if (!text) return text;
        
        // Trim whitespace if enabled
        if (trimWhitespace) {
            text = text.trim();
            // Replace multiple whitespace characters with single spaces
            text = text.replaceAll(/\s+/g, ' ');
        }
        
        return text;
    }

    function addToHistory(text) {
        // Remove existing occurrence if present
        copyHistory = copyHistory.filter(item => item !== text);
        
        // Add to beginning of history
        copyHistory.unshift(text);
        
        // Limit history to 20 items
        if (copyHistory.length > 20) {
            copyHistory = copyHistory.slice(0, 20);
        }
        
        // Save to storage
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ copyHistory });
        }
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
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

    function showNotification(message, type = 'success') {
        // Create subtle notification
        const notification = document.createElement('div');
        notification.textContent = message;
        
        // Get position styles
        const positions = getNotificationPosition();
        
        notification.style.cssText = `
            position: fixed;
            ${positions.css}
            background: ${type === 'error' ? '#f44336' : '#333'};
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
        }, notificationDuration);
    }

    function getNotificationPosition() {
        const positions = {
            'top-left': { css: 'top: 20px; left: 20px;' },
            'top-right': { css: 'top: 20px; right: 20px;' },
            'bottom-left': { css: 'bottom: 20px; left: 20px;' },
            'bottom-right': { css: 'bottom: 20px; right: 20px;' },
            'center': { css: 'top: 50%; left: 50%; transform: translate(-50%, -50%);' }
        };
        
        return positions[notificationPosition] || positions['top-right'];
    }

    // Listen for settings changes from popup
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'updateSettings') {
                isEnabled = request.settings.enabled;
                blacklistedDomains = request.settings.blacklistedDomains || [];
                whitelistedDomains = request.settings.whitelistedDomains || [];
                useWhitelist = request.settings.useWhitelist || false;
                minTextLength = request.settings.minTextLength || 3;
                trimWhitespace = request.settings.trimWhitespace !== false;
                avoidDuplicates = request.settings.avoidDuplicates !== false;
                notificationPosition = request.settings.notificationPosition || 'top-right';
                notificationDuration = request.settings.notificationDuration || 2000;
            } else if (request.action === 'getHistory') {
                sendResponse({ history: copyHistory });
            } else if (request.action === 'clearHistory') {
                copyHistory = [];
                chrome.storage.local.set({ copyHistory: [] });
                sendResponse({ success: true });
            } else if (request.action === 'copyFromHistory') {
                copyToClipboard(request.text);
                showNotification(`Copied from history: "${truncateText(request.text, 30)}"`);
                sendResponse({ success: true });
            }
        });
    }
})();
