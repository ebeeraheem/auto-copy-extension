# Auto-Copy Text Browser Extension

A minimal, secure browser extension that automatically copies selected text to the clipboard.

## Features

- 🔄 **Automatic copying**: Text is copied immediately upon selection
- 🛡️ **Secure**: No external requests, minimal permissions
- 🎛️ **Configurable**: On/off toggle, domain whitelist/blacklist
- 🔔 **Visual feedback**: Subtle notification when text is copied
- 🌐 **Cross-browser**: Works on Edge, Chrome, and Firefox
- ⚡ **Lightweight**: Minimal resource usage

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
2. Simply select text on any webpage
3. The text will be copied to your clipboard automatically
4. A small notification will appear confirming the copy

### Configuration

Click the extension icon to access settings:

- **Enable/Disable**: Toggle the auto-copy functionality
- **Domain Control**: Choose between blacklist or whitelist mode
  - **Blacklist Mode**: Auto-copy works everywhere except specified domains
  - **Whitelist Mode**: Auto-copy only works on specified domains
- **Domain Lists**: Add domains (one per line) to control where the extension works

### Security Notes

This extension:
- ✅ Only requests minimal necessary permissions
- ✅ Contains no external network requests
- ✅ Stores no data outside your browser
- ✅ Uses modern, secure APIs
- ✅ All code is visible and auditable

## Browser Compatibility

| Browser | Manifest Version | Status |
|---------|------------------|--------|
| Edge (Chromium) | V3 | ✅ Full Support |
| Chrome | V3 | ✅ Full Support |
| Firefox (Latest) | V2/V3 | ✅ Full Support |
| Firefox (Older) | V2 | ✅ Compatible |

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
3. Select text and verify it's copied to clipboard
4. Test the popup settings
5. Verify domain blacklist/whitelist functionality

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
- Try refreshing the webpage

**Text not copying:**
- Modern browsers may require HTTPS for clipboard access
- Check browser console for error messages
- Ensure extension has proper permissions

**Notification not showing:**
- Check if the website blocks extension notifications
- Verify extension is enabled for the current domain

## Privacy

This extension:
- Does not collect any user data
- Does not send data to external servers
- Only accesses clipboard to write selected text
- Stores settings locally in your browser only

## License

This extension is provided as-is for educational and personal use. Feel free to modify and distribute according to your needs.