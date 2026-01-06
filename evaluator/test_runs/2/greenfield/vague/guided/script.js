/**
 * Adaptive Loading Script
 * Swaps 'src' with 'loading-placeholder' if network is slow.
 */
function handleAdaptiveLoading() {
  const images = document.querySelectorAll('img[loading-placeholder]');
  
  // Check if Network Information API is supported
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    const isSlow = connection.saveData || 
                   connection.effectiveType === 'slow-2g' || 
                   connection.effectiveType === '2g' || 
                   connection.effectiveType === '3g';
                   
    if (isSlow) {
      console.log('Slow network detected (' + connection.effectiveType + '). Using placeholders.');
      images.forEach(img => {
        const placeholder = img.getAttribute('loading-placeholder');
        if (placeholder) {
          // Store original src in data attribute just in case
          img.dataset.originalSrc = img.src;
          img.src = placeholder;
        }
      });
    }
  }
}

// Run adaptive loading check immediately
handleAdaptiveLoading();

// Dynamically load polyfills if needed
(function loadPolyfills() {
  // 1. Interest Invokers (interestfor)
  if (!HTMLButtonElement.prototype.hasOwnProperty("interestForElement")) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/interestfor@1.0.7/src/interestfor.min.js';
    document.head.appendChild(script);
  }

  // 2. Popover API
  if (!HTMLDivElement.prototype.hasOwnProperty("popover")) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@oddbird/popover-polyfill@0.6.1/dist/popover.min.js';
    script.type = 'module';
    document.head.appendChild(script);
  }

  // 3. Anchor Positioning
  if (!('positionAnchor' in document.documentElement.style)) {
     const script = document.createElement('script');
     script.src = 'https://unpkg.com/@oddbird/css-anchor-positioning@0.8.0/dist/css-anchor-positioning.js';
     script.type = 'module';
     document.head.appendChild(script);
  }
})();
