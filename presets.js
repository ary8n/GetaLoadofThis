// Shared by the popup and the isolated content script.
globalThis.AFTERGLOW_PRESETS = [
  { id: "gandalf", name: "Gandalf", type: "image", src: "assets/gandalf_you_shall_not_pass_transparent.webp", animated: true },
  { id: "subway", name: "Subway Runner", type: "image", src: "assets/subway_runner_loading.webp", animated: true },
  { id: "kururin", name: "Kururin", type: "image", src: "assets/kururin_transparent.webp", animated: true },
  { id: "slowduck", name: "Psychic Pokémon", type: "image", src: "assets/slowduck_cutout.webp", animated: true },
  { id: "sad-ant", name: "Sad Ant", type: "image", src: "assets/sad_ant_transparent.png", animated: false }
];

globalThis.AFTERGLOW_DEFAULTS = { selectedPreset: "gandalf", enabled: true };
