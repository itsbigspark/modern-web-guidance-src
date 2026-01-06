// Feature Detection & Polyfill Loading

async function loadPolyfills() {
    const polyfills = [];

    // 1. Interest Invokers Polyfill
    // Checks for 'interestForElement' on HTMLButtonElement
    if (!HTMLButtonElement.prototype.hasOwnProperty("interestForElement")) {
        console.log("Polyfilling Interest Invokers...");
        polyfills.push(loadScript("https://unpkg.com/interestfor@1.0.7/src/interestfor.min.js"));
    }

    // 2. Popover API Polyfill
    // Checks for 'popover' on HTMLElement
    if (!HTMLElement.prototype.hasOwnProperty("popover")) {
         console.log("Polyfilling Popover API...");
         polyfills.push(loadScript("https://unpkg.com/@oddbird/popover-polyfill@0.6.1/dist/popover.min.js"));
    }

    // 3. CSS Anchor Positioning Polyfill
    // Checks for 'positionAnchor' in style
    if (!('positionAnchor' in document.documentElement.style)) {
        console.log("Polyfilling CSS Anchor Positioning...");
        polyfills.push(loadScript("https://unpkg.com/@oddbird/css-anchor-positioning@0.8.0/dist/css-anchor-positioning.js"));
    }

    // 4. Adaptive Loading Polyfill
    // Checks for 'loadingPlaceholder' on HTMLImageElement
    if (!('loadingPlaceholder' in HTMLImageElement.prototype)) {
        console.log("Polyfilling Adaptive Loading...");
        // Using the URL provided by best practices, ensuring it handles loading-placeholder attribute logic
        polyfills.push(loadScript("https://example.github.io/adaptive-loading-polyfill/adaptive-loading.min.js"));
    }

    await Promise.all(polyfills);
    console.log("All required polyfills loaded.");
}

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`Loaded ${src}`);
            resolve();
        };
        script.onerror = () => {
            console.warn(`Failed to load ${src}`);
            resolve(); // Resolve anyway to not block others
        };
        document.head.appendChild(script);
    });
}

// Initializer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPolyfills);
} else {
    loadPolyfills();
}
