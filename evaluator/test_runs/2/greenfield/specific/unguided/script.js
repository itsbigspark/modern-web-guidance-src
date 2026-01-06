/**
 * Adaptive Loading Script
 * Swaps the hero image source based on the user's effective connection type.
 */

document.addEventListener('DOMContentLoaded', () => {
    const heroImg = document.getElementById('hero-img');
    const highResSrc = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1600&q=80';
    const lowResSrc = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=200&q=10&blur=5';

    // Check if the Network Information API is supported
    if ('connection' in navigator) {
        const connection = navigator.connection;
        const effectiveType = connection.effectiveType;
        const saveData = connection.saveData;

        console.log(`Effective connection type: ${effectiveType}`);
        console.log(`Save-Data enabled: ${saveData}`);

        // If on 2g or specifically requested save-data, use the low-res placeholder
        if (effectiveType === '2g' || effectiveType === 'slow-2g' || saveData) {
            console.log('Using low-quality image for slow network.');
            heroImg.src = lowResSrc;
            // Optionally we can load the high res one lazily later, but for this demo step we stick to the placeholder to prove the point.
            heroImg.alt += ' (Low bandwidth mode)';
        } else {
            console.log('Using high-quality image.');
            heroImg.src = highResSrc;
        }
    } else {
        // Fallback for browsers without Network Information API
        console.log('Network Information API not supported. Defaulting to high-quality image.');
        heroImg.src = highResSrc;
    }
});
