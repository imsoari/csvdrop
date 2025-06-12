/**
 * Mobile utilities for CSV DROP app
 * Handles mobile-specific functionality like viewport height adjustments
 */

/**
 * Sets the viewport height CSS variable to handle mobile browser viewport issues
 * This fixes the problem with 100vh not accounting for mobile browser UI elements
 */
export function setupMobileViewport(): void {
  // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // We listen to the resize event and orientation change
  window.addEventListener('resize', () => {
    // We execute the same script as before
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
  
  window.addEventListener('orientationchange', () => {
    // Small timeout to ensure the browser has completed the orientation change
    setTimeout(() => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 100);
  });
}

/**
 * Adds touch-specific event handlers for mobile devices
 * @param element - The element to enhance with touch events
 */
export const enhanceTouchInteractions = (element: HTMLElement): void => {
  if (!element) return;
  
  // Double tap prevention (common mobile issue)
  let lastTap = 0;
  element.addEventListener('touchend', (e: TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
      e.preventDefault();
    }
    lastTap = currentTime;
  });
}

/**
 * Detects if the current device is a mobile device
 * @returns True if the device is mobile
 */
export function isMobileDevice(): boolean {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}
