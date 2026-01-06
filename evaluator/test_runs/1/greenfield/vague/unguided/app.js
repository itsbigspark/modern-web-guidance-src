// Adaptive Loading Logic
const updateImageQuality = () => {
    const img = document.getElementById('hero-img');
    if (!img) return;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    // Determine if we should load high quality
    // Default to High Quality unless explicit signal for slow network
    let shouldLoadHighRes = true;

    if (connection) {
        // If Save-Data is on, respect it
        if (connection.saveData === true) {
            shouldLoadHighRes = false;
        }
        // If connection is effectively 2g or slow-2g, stay low res
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            shouldLoadHighRes = false;
        }
    }

    if (shouldLoadHighRes) {
        const highResUrl = img.dataset.highRes;
        if (highResUrl && img.src !== highResUrl) {
            console.log('Upgrading to high-res image');
            img.src = highResUrl;
        }
    } else {
        console.log('Staying on low-res image due to network conditions');
    }
};

// Initial check
updateImageQuality();

// Listen for network changes
if (navigator.connection) {
    navigator.connection.addEventListener('change', updateImageQuality);
}

// Popover Hover Interaction
// Since "Interest Invokers" are experimental, we implement hover behavior with JS
// to ensure the "tooltip" experience works as requested.
const btn = document.getElementById('details-btn');
const popover = document.getElementById('ingredients-popover');

if (btn && popover) {
    let hideTimeout;

    const showPopover = () => {
        clearTimeout(hideTimeout);
        try {
            // Only show if not already open to avoid flashing
            if (!popover.matches(':popover-open')) {
                popover.showPopover();
            }
        } catch (e) {
            // Fallback or ignore if not supported
            console.warn('Popover API error:', e);
        }
    };

    const hidePopover = () => {
        hideTimeout = setTimeout(() => {
            try {
                popover.hidePopover();
            } catch (e) {}
        }, 200); // 200ms grace period to move mouse to popover
    };

    // Button Events
    btn.addEventListener('mouseenter', showPopover);
    btn.addEventListener('mouseleave', hidePopover);
    btn.addEventListener('focus', showPopover);
    btn.addEventListener('blur', hidePopover);

    // Popover Events (to keep it open when hovering the content)
    popover.addEventListener('mouseenter', showPopover);
    popover.addEventListener('mouseleave', hidePopover);
}
