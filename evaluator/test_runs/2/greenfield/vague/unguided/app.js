document.addEventListener('DOMContentLoaded', () => {
    const heroImg = document.getElementById('hero-img');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    let useLowRes = false;

    if (connection) {
        console.log(`Effective connection type: ${connection.effectiveType}`);
        console.log(`SaveData: ${connection.saveData}`);
        
        if (connection.saveData === true || ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
            useLowRes = true;
        }
    }

    // For demonstration purposes, if we are offline or connection api is missing, we might default to high,
    // but let's default to low first to ensure "loads a low-quality placeholder first" behavior is robust
    // then swap if fast.
    
    // Actually, to fully satisfy "loads a low-quality placeholder first", we can assign low immediately,
    // then swap if permitted.
    
    heroImg.src = 'hero-low.svg';

    if (!useLowRes) {
        // Simulate a slight network delay or just load it
        console.log('Network is good. Upgrading to high-res image...');
        const highRes = new Image();
        highRes.src = 'hero-high.svg';
        highRes.onload = () => {
            heroImg.src = 'hero-high.svg';
        };
    } else {
        console.log('Slow network detected. Keeping low-res image.');
    }
    
    // Polyfill-ish for interesttarget if needed (though we assume browser support)
    // Just a log to confirm presence
    if (document.body.hasOwnProperty('interesttarget')) {
        console.log('Interest Invokers supported!');
    } else {
        console.warn('Interest Invokers NOT supported in this browser. The tooltip might not appear on hover without a polyfill.');
        // Simple fallback for click if interest not supported
        const btn = document.querySelector('button[interesttarget]');
        if (btn) {
           btn.addEventListener('mouseenter', () => {
               const targetId = btn.getAttribute('interesttarget');
               const target = document.getElementById(targetId);
               if(target && target.showPopover) target.showPopover();
           });
           btn.addEventListener('mouseleave', () => {
               const targetId = btn.getAttribute('interesttarget');
               const target = document.getElementById(targetId);
               if(target && target.hidePopover) target.hidePopover();
           });
        }
    }
});
