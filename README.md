# Auto-Copy Text Browser Extension

A powerful, configurable browser extension that automatically copies selected text to the clipboard with advanced features.

## Features

- 🔄 **Automatic copying**: Text is copied immediately upon mouse selection
- 🎛️ **Smart text processing**: Configurable text filtering and cleaning
- 📋 **Copy history**: Track and re-copy from your recent selections
- 🔔 **Customizable notifications**: Configurable position and duration
- 🛡️ **Domain control**: Advanced whitelist/blacklist functionality
- 📊 **Settings management**: Export/import your configuration
- 🚫 **Duplicate prevention**: Avoid copying the same text repeatedly
- 🎯 **Minimum length filtering**: Set minimum text length for copying
- ✨ **Whitespace trimming**: Automatically clean up copied text
- 🌐 **Cross-browser**: Works on Edge, Chrome, and Firefox
- ⚡ **Lightweight**: Minimal resource usage with performance optimizations
- 🛡️ **Secure**: No external requests, minimal permissions

## Installation

### Microsoft Edge (Chromium-based)

1. Download/clone this extension to a folder on your computer
2. Open Microsoft Edge and navigate to `edge://extensions/`
3. Enable "Developer mode" using the toggle in the left sidebar
4. Click "Load unpacked" button
5. Select the folder containing the extension files
6. The extension should now appear in your extensions list

### Mozilla Firefox

#### For Latest Firefox (Temporary Installation)

1. Download/clone this extension to a folder on your computer
2. Rename `manifest_v2.json` to `manifest.json` (backup the original first)
3. Open Firefox and navigate to `about:debugging`
4. Click "This Firefox" in the left sidebar
5. Click "Load Temporary Add-on"
6. Navigate to the extension folder and select `manifest.json`
7. The extension will be loaded temporarily (until Firefox restarts)

#### For Distribution

To create a proper Firefox add-on:

1. Use `manifest_v2.json` as your `manifest.json`
2. Create a ZIP file containing all extension files
3. Submit to Mozilla Add-ons for review, or use `about:config` to enable unsigned add-ons for development

## Usage

### Basic Operation

1. Once installed, the extension works automatically
2. Simply select text with your mouse on any webpage
3. The text will be copied to your clipboard automatically
4. A customizable notification will appear confirming the copy
5. View and manage your copy history through the popup

### Configuration

Click the extension icon to access comprehensive settings:

#### Main Controls

- **Enable/Disable**: Toggle the auto-copy functionality

#### Text Processing Options

- **Trim whitespace**: Automatically clean up extra spaces and line breaks
- **Avoid duplicate copies**: Skip copying the same text repeatedly
- **Minimum text length**: Set minimum character count for copying (prevents accidental single-character copies)

#### Notification Settings

- **Position**: Choose where notifications appear (top-right, top-left, bottom-right, bottom-left, center)
- **Duration**: Set how long notifications stay visible (500ms to 10 seconds)

#### Domain Control

- **Blacklist Mode**: Auto-copy works everywhere except specified domains
- **Whitelist Mode**: Auto-copy only works on specified domains
- **Domain Lists**: Add domains (one per line) to control where the extension works

#### Copy History

- **View History**: Browse your last 20 copied items
- **Re-copy**: Click any history item to copy it again
- **Clear History**: Remove all stored history

#### Settings Management

- **Export Settings**: Download your complete configuration as JSON
- **Import Settings**: Upload and restore a previously exported configuration

### Security Notes

This extension:

- ✅ Only requests minimal necessary permissions
- ✅ Contains no external network requests
- ✅ Stores data only locally in your browser
- ✅ Uses modern, secure APIs
- ✅ All code is visible and auditable
- ✅ Copy history is stored locally and never transmitted
- ✅ Settings can be exported/imported for backup purposes

## Browser Compatibility

| Browser          | Manifest Version | Status          |
| ---------------- | ---------------- | --------------- |
| Edge (Chromium)  | V3               | ✅ Full Support |
| Chrome           | V3               | ✅ Full Support |
| Firefox (Latest) | V2/V3            | ✅ Full Support |
| Firefox (Older)  | V2               | ✅ Compatible   |

## File Structure

```
auto-copy-extension/
├── manifest.json          # Manifest V3 for Chromium browsers
├── manifest_v2.json       # Manifest V2 for Firefox compatibility
├── background.js          # Background script for settings management
├── content.js             # Main auto-copy logic
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── popup.css              # Popup styling
├── icons/                 # Extension icons (you'll need to add these)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

## Creating Icons

You'll need to create three icon files in the `icons/` folder:

- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

These should be simple clipboard or copy-related icons.

## Development

### Testing

1. Load the extension as described in installation
2. Visit any webpage with selectable text
3. Select text with your mouse and verify it's copied to clipboard
4. Test all popup settings including:
    - Text processing options (trim whitespace, minimum length, duplicate prevention)
    - Notification customization (position, duration)
    - Copy history functionality
    - Settings export/import
5. Verify domain blacklist/whitelist functionality
6. Test that keyboard selections (Ctrl+A, arrow keys) don't trigger copying

### Debugging

- Use browser developer tools console to see any error messages
- Content script logs will appear in the webpage's console
- Background script logs appear in the extension's background page console

## Packaging for Distribution

### For Chrome/Edge Web Store

1. Ensure `manifest.json` is the Manifest V3 version
2. Create a ZIP file with all extension files
3. Submit to Chrome Web Store or Edge Add-ons store

### For Firefox Add-ons

1. Use `manifest_v2.json` as your `manifest.json`
2. Create a ZIP file with all extension files
3. Submit to Mozilla Add-ons (AMO) for review

## Troubleshooting

**Extension not working:**

- Check that it's enabled in your browser's extension settings
- Verify the domain isn't blacklisted in extension settings
- Ensure minimum text length requirement is met
- Try refreshing the webpage

**Text not copying:**

- Modern browsers may require HTTPS for clipboard access
- Check browser console for error messages
- Ensure extension has proper permissions
- Verify text meets minimum length requirement

**Notification not showing:**

- Check if the website blocks extension notifications
- Verify extension is enabled for the current domain
- Check notification settings (position and duration)

**History not working:**

- Verify extension has storage permissions
- Check if browser storage quota has been reached
- Try clearing and rebuilding history

**Settings not saving:**

- Check browser console for error messages
- Verify extension has storage permissions
- Try exporting settings to backup your configuration

**Keyboard selections copying:**

- This is by design - only mouse selections trigger copying
- Keyboard selections (Ctrl+A, arrow keys, etc.) are intentionally ignored

## Privacy

This extension:

- Does not collect any user data
- Does not send data to external servers
- Only accesses clipboard to write selected text
- Stores settings and copy history locally in your browser only
- Copy history is limited to 20 items and never leaves your device
- Settings export creates a local file that you control
- No analytics, tracking, or telemetry of any kind

## License

This extension is provided as-is for educational and personal use. Feel free to modify and distribute according to your needs.
