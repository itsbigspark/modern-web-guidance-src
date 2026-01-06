// Feature Detection and Polyfill Loading

(async function() {
  const polyfills = [];

  // 1. Interest Invokers (for nice hover popovers)
  if (!HTMLButtonElement.prototype.hasOwnProperty("interestForElement")) {
    console.log("Polyfilling Interest Invokers...");
    polyfills.push(loadScript('https://unpkg.com/interestfor@1.0.7/src/interestfor.min.js'));
  }

  // 2. Popover API
  if (!HTMLElement.prototype.hasOwnProperty("popover")) {
    console.log("Polyfilling Popover API...");
    polyfills.push(loadScript('https://unpkg.com/@oddbird/popover-polyfill@0.6.1/dist/popover.min.js'));
  }

  // 3. CSS Anchor Positioning
  // Simple check for JS support or CSS support
  if (!window.CSS || !CSS.supports("position-anchor: --foo")) {
    console.log("Polyfilling Anchor Positioning...");
    polyfills.push(loadScript('https://unpkg.com/@oddbird/css-anchor-positioning@0.8.0/dist/css-anchor-positioning.js'));
  }

  // 4. Adaptive Loading / loading-placeholder
  // Check if HTMLImageElement has loadingPlaceholder
  if (!('loadingPlaceholder' in HTMLImageElement.prototype)) {
    console.log("Polyfilling Adaptive Loading...");
    polyfills.push(loadScript('http://example.github.io/adaptive-loading-polyfill/adaptive-loading.min.js'));
  }

  try {
    await Promise.all(polyfills);
    console.log("All necessary polyfills loaded.");
  } catch (err) {
    console.error("Error loading polyfills:", err);
  }
})();

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    
    // For module scripts if needed, but these are mostly UMD/global
    // checking specific polyfills instructions, most are just scripts.
    if (src.includes('interestfor')) {
        script.type = 'module'; // interestfor is often a module
    }

    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
