/**
 * Adaptive Loading Script
 * Detects network condition and loads appropriate image quality.
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroImage = document.getElementById('hero-image');
  
  // Adaptive Loading Logic
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  const updateImageSource = () => {
    let isSlow = false;
    
    if (connection) {
      // Check for Save-Data mode or slow connection types
      if (connection.saveData === true) {
        isSlow = true;
      } else {
        const effectiveType = connection.effectiveType; // 'slow-2g', '2g', '3g', '4g'
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          isSlow = true;
        }
      }
    }
    
    if (isSlow) {
      console.log('Adaptive Loading: Slow connection detected. Loading placeholder.');
      heroImage.src = 'hero-placeholder.png';
    } else {
      console.log('Adaptive Loading: Fast connection detected. Loading high-res image.');
      heroImage.src = 'hero.png';
    }
  };

  // Initial check
  updateImageSource();

  // Listen for connection changes (optional but good practice)
  if (connection) {
    connection.addEventListener('change', updateImageSource);
  }
});
