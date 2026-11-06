(() => {
  if (window !== window.top) return;
  const presets = globalThis.AFTERGLOW_PRESETS;
  const defaults = globalThis.AFTERGLOW_DEFAULTS;
  let overlay = null;
  let media = null;
  let hideTimer = 0;
  let enabled = defaults.enabled;
  let selectedPreset = defaults.selectedPreset;
  let activeOperationId = null;

  function release() {
    if (media instanceof HTMLImageElement) {
      media.removeAttribute("src");
    }
    media = null;
  }

  function removeOverlay() {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = 0;
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    release();
  }

  function displayPreset() {
    const preset = presets.find(item => item.id === selectedPreset) ?? presets[0];
    release();
    if (!overlay || !preset || !enabled) return;
    const frame = overlay.querySelector(".afterglow-frame");
    frame.replaceChildren();
    const image = document.createElement("img");
    image.className = "afterglow-media";
    image.alt = preset.name;
    image.decoding = "async";
    image.addEventListener("error", () => { if (media === image) hideOverlay(); }, { once: true });
    image.src = chrome.runtime.getURL(preset.src);
    media = image;
    frame.append(media);
  }

  function showOverlay({ force = false, timeoutMs = 30000 } = {}) {
    if (!enabled || document.visibilityState === "hidden" || (!force && document.readyState === "complete")) return;
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "afterglow-overlay";
      const frame = document.createElement("div");
      frame.className = "afterglow-frame";
      overlay.append(frame);
      (document.documentElement || document).append(overlay);
      displayPreset();
    } else {
      overlay.classList.remove("afterglow-leaving");
    }
    if (hideTimer) clearTimeout(hideTimer);
    const timeout = Number.isFinite(timeoutMs) ? Math.max(1000, Math.min(timeoutMs, 30000)) : 30000;
    // Safety valve if the page never emits its matching end event.
    hideTimer = setTimeout(() => {
      activeOperationId = null;
      removeOverlay();
    }, timeout);
  }

  function hideOverlay() {
    if (!overlay) return;
    overlay.classList.add("afterglow-leaving");
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(removeOverlay, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 190);
  }

  chrome.storage.local.get(defaults, stored => {
    selectedPreset = presets.some(item => item.id === stored.selectedPreset) ? stored.selectedPreset : defaults.selectedPreset;
    enabled = stored.enabled !== false;
    if (enabled && document.readyState !== "complete") showOverlay();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.selectedPreset) {
      selectedPreset = changes.selectedPreset.newValue ?? defaults.selectedPreset;
      displayPreset();
    }
    if (changes.enabled) {
      enabled = changes.enabled.newValue !== false;
      if (enabled && document.readyState !== "complete") showOverlay();
      else if (!enabled) removeOverlay();
    }
  });

  // Stillroom's in-page demo emits this event because it does not navigate.
  window.addEventListener("afterglow:demo-loading", event => {
    const detail = event.detail;
    if (!detail || typeof detail.operationId !== "string") return;
    if (detail.type === "start") {
      activeOperationId = detail.operationId;
      showOverlay({ force: true, timeoutMs: detail.timeoutMs });
    } else if (detail.type === "end" && detail.operationId === activeOperationId) {
      activeOperationId = null;
      hideOverlay();
    }
  });

  window.addEventListener("load", hideOverlay, { once: true });
  window.addEventListener("pagehide", removeOverlay, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      removeOverlay();
    }
  });
})();
