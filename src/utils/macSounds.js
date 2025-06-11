/**
 * Macintosh Theme Sounds Utility
 * Programmatically generates classic Macintosh UI sounds using Web Audio API
 */

let audioContext = null;

// Initialize audio context on first user interaction
export const initMacSounds = () => {
  if (!audioContext) {
    try {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
      console.log('Mac sounds initialized');
    } catch (error) {
      console.error('Web Audio API not supported:', error);
    }
  }
};

// Classic Mac startup chime
export const playStartupSound = () => {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const now = audioContext.currentTime;
    
    // First note (C major chord)
    oscillator.frequency.setValueAtTime(261.63, now); // C4
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
    
    // Fade to second note (F major)
    oscillator.frequency.setValueAtTime(349.23, now + 0.4); // F4
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.5);
    
    // Fade out
    gainNode.gain.linearRampToValueAtTime(0, now + 1.2);
    
    oscillator.start(now);
    oscillator.stop(now + 1.2);
  } catch (error) {
    console.error('Error playing startup sound:', error);
  }
};

// Button click sound
export const playClickSound = () => {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.value = 800;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  } catch (error) {
    console.error('Error playing click sound:', error);
  }
};

// Error sound
export const playErrorSound = () => {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const now = audioContext.currentTime;
    
    // Two descending tones
    oscillator.frequency.setValueAtTime(330, now);
    gainNode.gain.setValueAtTime(0.1, now);
    
    oscillator.frequency.setValueAtTime(165, now + 0.15);
    gainNode.gain.setValueAtTime(0.1, now + 0.15);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  } catch (error) {
    console.error('Error playing error sound:', error);
  }
};

// Success sound
export const playSuccessSound = () => {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const now = audioContext.currentTime;
    
    // Two ascending tones
    oscillator.frequency.setValueAtTime(440, now); // A4
    gainNode.gain.setValueAtTime(0.1, now);
    
    oscillator.frequency.setValueAtTime(880, now + 0.15); // A5
    gainNode.gain.setValueAtTime(0.1, now + 0.15);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  } catch (error) {
    console.error('Error playing success sound:', error);
  }
};

// Disk insertion/ejection sound
export const playDiskSound = () => {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    oscillator.type = 'sawtooth';
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const now = audioContext.currentTime;
    
    oscillator.frequency.setValueAtTime(150, now);
    gainNode.gain.setValueAtTime(0.03, now);
    oscillator.frequency.linearRampToValueAtTime(40, now + 0.15);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.15);
    
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  } catch (error) {
    console.error('Error playing disk sound:', error);
  }
};

export default {
  initMacSounds,
  playStartupSound,
  playClickSound,
  playErrorSound,
  playSuccessSound,
  playDiskSound
};
