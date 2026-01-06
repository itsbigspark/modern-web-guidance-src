// Feature Detection and Polyfill Loading

document.addEventListener('DOMContentLoaded', () => {
    loadPolyfills();
});

function loadPolyfills() {
    const polyfills = [];

    // 1. Interest Invokers Polyfill
    // Check if 'interestForElement' or 'interestfor' is supported. 
    // Spec is evolving, sometimes it's interestAction or similar, but MCP said 'interestForElement'.
    const isInterestSupported = HTMLButtonElement.prototype.hasOwnProperty("interestForElement");
    
    if (!isInterestSupported) {
        console.log('Interest Invokers not supported. Loading polyfill...');
        polyfills.push('https://unpkg.com/interestfor@1.0.7/src/interestfor.min.js');
    }

    // 2. Popover API Polyfill
    const isPopoverSupported = HTMLDivElement.prototype.hasOwnProperty("popover");

    if (!isPopoverSupported) {
        console.log('Popover API not supported. Loading polyfill...');
        polyfills.push('https://unpkg.com/@oddbird/popover-polyfill@0.6.1/dist/popover.min.js');
    }

    // 3. CSS Anchor Positioning Polyfill
    // Check using CSS.supports
    const isAnchorPositioningSupported = CSS.supports('position-anchor: --foo');

    if (!isAnchorPositioningSupported) {
        console.log('CSS Anchor Positioning not supported. Loading polyfill...');
        polyfills.push('https://unpkg.com/@oddbird/css-anchor-positioning@0.8.0/dist/css-anchor-positioning.js');
    }

    // 4. Adaptive Loading (loading-placeholder) Polyfill
    const isAdaptiveLoadingSupported = 'loadingPlaceholder' in HTMLImageElement.prototype;

    if (!isAdaptiveLoadingSupported) {
         console.log('Adaptive Loading not supported. Loading polyfill...');
         // Note: Adaptive Loading polyfill url is HTTP, might be blocked by mixed content if served via HTTPS. 
         // Assuming local dev or http for now as per instructions.
         polyfills.push('http://example.github.io/adaptive-loading-polyfill/adaptive-loading.min.js');
    }
    
    // Load all required polyfills sequentially
    polyfills.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true; // or false if dependency order matters. 
        // For these specific polyfills, they are mostly independent, 
        // but popover might need to be loaded before interest for in some robust cases? 
        // Usually they bind on load.
        document.head.appendChild(script);
    });
}
