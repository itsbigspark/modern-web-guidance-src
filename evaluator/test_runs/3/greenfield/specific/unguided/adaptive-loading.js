/**
 * Adaptive Loading Script
 * 
 * Checks the user's network connection and determines whether to load
 * the full resolution image or keep the low-quality placeholder.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if the Network Information API is supported
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    // Default to 'fast' if API is not supported, unless we want to be conservative
    // But usually we fallback to normal loading if we can't tell.
    const isSlow = connection ? (
        connection.saveData === true || // Data Saver is on
        ['slow-2g', '2g', '3g'].includes(connection.effectiveType) // Effective connection type is slow
    ) : false; // If unknown, assume fast/standard

    const heroImg = document.getElementById('hero-img');
    
    if (heroImg) {
        const fullSrc = heroImg.getAttribute('data-src-full');
        const placeholderSrc = heroImg.getAttribute('data-src-placeholder');

        if (isSlow) {
            console.log('Use Adaptive Loading: Slow network detected. Keeping placeholder or loading low-res.');
            // If the src is currently set to full (e.g. via HTML default), we might want to swap it
            // But usually we set strict defaults in HTML.
            // In our HTML, we set src to full by default (for SEO/NoJS), but we could have set it to placeholder.
            // Let's assume we want to SWAP to placeholder if we detect slow, 
            // OR ideally we started with placeholder and swap to full if FAST.
            
            // However, to avoid double download if the browser already started full, 
            // the best pattern is: <img src="placeholder" data-src="full"> and swap if FAST.
            // BUT, for SEO, we often want src="full".
            // Let's implement the logic requested: "show a placeholder on slow networks".
            
            // If we are currently loading full (from HTML), and we detect slow, we might stop it?
            // Browsers preloaders make this hard. 
            // Better pattern: src="placeholder" initially?
            
            // Let's update the Logic:
            // If we assume the HTML has src="full", it's too late.
            // But if we use the `<img src>`...
            
            // Refined approach for this demo:
            // If the usage is critical, providing a `loading-placeholder` attribute suggests we care about this.
            // We will set the src to placeholder if it's not already.
            
            if (placeholderSrc) { // If we have a placeholder
               // Check if we can intercept
               // In a real app we'd use <img src="placeholder"> by default.
            }
        } else {
            // Fast network
            console.log('Adaptive Loading: Fast network. Ensuring high-res image.');
            // If we were using placeholder by default, swap now.
            // In our HTML, I put the full URL in src.
            // So this script is mostly a "check" or "verification" in this specific setup, 
            // UNLESS I change the HTML to default to placeholder.
            // Let's change HTML to default to full (common case), 
            // AND maybe I should check `saveData` specifically.
        }
    }
});

// To truly implement "Adaptive Loading" where we SAVE data, 
// the image src in HTML should probably be the small one, 
// and we upgrade it if fast.
// Let's check the HTML I wrote... 
// I wrote src="...full...".
// This means the browser will start downloading the full image immediately.
// Changing it to placeholder in JS might be too late to save bandwidth, 
// but it fulfills the "show placeholder" VISUAL requirement if the full one takes long?
// No, the placeholder is for *while* it loads.
// The "Adaptive Loading" request usually implies "Don't load the big one if slow".

// I will create a refined version of index.html that uses the placeholder as the `src` initial value?
// Or I'll rely on the `loading="lazy"` which I added. 
// If I use `loading="lazy"`, the browser hasn't loaded it yet if it's off screen.
// My hero is "below the fold" (intro section is 80vh).
// So `loading="lazy"` gives us a chance to swap the `src` before it loads!
// Perfect.

// Updated logic:
// 1. Image has `src="full"` (or placeholder?) and `loading="lazy"`.
// 2. JS runs. 
// 3. If connection is slow -> set `src` to `data-src-placeholder`.
// 4. If connection is fast -> leave it (or set to `data-src-full`).

// Code:
const updateHeroImage = () => {
    const heroImg = document.getElementById('hero-img');
    if (!heroImg) return;
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlow = connection ? (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) : false;

    if (isSlow) {
        console.log('Adaptive Loading: Downgrading to placeholder');
        const placeholder = heroImg.getAttribute('data-src-placeholder');
        if (placeholder) heroImg.src = placeholder;
    }
    // Else keep default (which is full)
};

updateHeroImage();
