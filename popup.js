const presets = globalThis.AFTERGLOW_PRESETS;
const defaults = globalThis.AFTERGLOW_DEFAULTS;
const list = document.querySelector("#preset-list");
const enabledInput = document.querySelector("#enabled");
const status = document.querySelector("#status");
const popup = document.querySelector(".popup");
let selectedPreset = defaults.selectedPreset;
let enabled = defaults.enabled;

for (const preset of presets) {
  const button = document.createElement("button");
  button.className = "preset";
  button.type = "button";
  button.dataset.id = preset.id;
  button.setAttribute("aria-pressed", "false");
  const preview = document.createElement("img");
  preview.className = "preview";
  preview.setAttribute("aria-hidden", "true");
  preview.src = chrome.runtime.getURL(preset.src);
  const name = document.createElement("span");
  name.className = "preset-name";
  name.textContent = preset.name;
  const check = document.createElement("span");
  check.className = "check";
  check.setAttribute("aria-hidden", "true");
  check.textContent = "✓";
  button.append(preview, name, check);
  button.addEventListener("click", async () => {
    if (!enabled) return;
    selectedPreset = preset.id;
    render();
    await chrome.storage.local.set({ selectedPreset });
  });
  list.append(button);
}

function render() {
  for (const button of list.children) {
    const selected = button.dataset.id === selectedPreset;
    button.setAttribute("aria-pressed", String(selected));
  }
  enabledInput.checked = enabled;
  popup.classList.toggle("is-disabled", !enabled);
  status.textContent = enabled ? `Showing ${presets.find(item => item.id === selectedPreset)?.name ?? "Gandalf"}` : "Afterglow is paused";
}

enabledInput.addEventListener("change", async () => {
  enabled = enabledInput.checked;
  render();
  await chrome.storage.local.set({ enabled });
});

chrome.storage.local.get(defaults, stored => {
  selectedPreset = presets.some(item => item.id === stored.selectedPreset) ? stored.selectedPreset : defaults.selectedPreset;
  enabled = stored.enabled !== false;
  render();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.selectedPreset) selectedPreset = changes.selectedPreset.newValue ?? defaults.selectedPreset;
  if (changes.enabled) enabled = changes.enabled.newValue !== false;
  render();
});
