# Afterglow

Afterglow is a small Chrome Manifest V3 extension that shows one local loading screen while a page navigates. It has five built-in presets, a compact popup, and an on/off switch. It has no accounts, sync, uploads, analytics, or remote media.

## Install in Chrome

1. Download or clone this folder.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Choose **Load unpacked** and select this folder (the one containing `manifest.json`).
5. Pin Afterglow from Chrome's Extensions menu if you want quick access.

## Use

Open the Afterglow toolbar popup, choose a preset, and use the switch to pause or resume loading screens. The selected preset and enabled state are saved in `chrome.storage.local` on this browser profile.

The popup shows a preview for each preset. The page overlay loads only the selected preset, stays click-through, and goes away when the page finishes loading or its safety timeout expires. Its centered indicator is about 120 × 120 px (up to 150 px), uses `object-fit: contain`, and leaves the page visible. Animated WEBP assets use native image rendering, so the browser handles their animation and looping. Sad Ant is a static transparent PNG.

## Bundled presets

| Name | Media |
| --- | --- |
| Gandalf | Transparent animated WEBP |
| Kururin | Transparent animated WEBP |
| Sad Ant | Static transparent PNG |
| Psychic Pokémon | Transparent animated WEBP |
| Subway Runner | Transparent animated WEBP |

All media is bundled under `assets/`. No media is fetched from the network. The WEBP assets are displayed natively as images, and Sad Ant is a single-frame RGBA PNG. The popup and overlay load only the selected image source.

## Permissions and limitations

The extension uses `storage` for the two settings and `<all_urls>` so the content script can run on ordinary web pages. Chrome restricts extensions on browser-internal pages, the Chrome Web Store, and some other protected pages. The overlay covers document navigation and loading; it does not track route changes inside single-page applications or provide a browser download progress indicator.

The project contains no build step or external dependencies. The five supplied media assets did not include license information; no license file was added.

## Manual integrated check

After loading the unpacked folder, open the popup and confirm all five names appear. Select each preset, close and reopen the popup, and confirm the choice remains selected. In Stillroom, use **Begin the Ritual** to confirm the centered indicator appears and clears on completion, failure, and timeout. Verify animated WEBP images render and loop, Sad Ant stays static, and switching the selection changes the next operation. Browser-internal pages are not supported.
