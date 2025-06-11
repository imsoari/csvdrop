import { useState, useEffect, useCallback } from 'react';

// Import the macSounds utility
import { 
  initMacSounds, 
  playStartupSound, 
  playClickSound, 
  playErrorSound, 
  playSuccessSound, 
  playDiskSound 
} from '../utils/macSounds';

/**
 * Custom hook to manage Macintosh sound effects
 * @param defaultEnabled - Whether sounds are enabled by default
 * @returns Sound control functions and state
 */
const useMacSounds = (defaultEnabled = true) => {
  // Check if sounds are enabled in local storage
  const getSavedSoundPreference = () => {
    const saved = localStorage.getItem('mac-sounds-enabled');
    return saved !== null ? saved === 'true' : defaultEnabled;
  };

  const [enabled, setEnabled] = useState<boolean>(getSavedSoundPreference);
  const [audioInitialized, setAudioInitialized] = useState<boolean>(false);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!audioInitialized) {
        initMacSounds();
        setAudioInitialized(true);
        
        // Remove event listeners after initialization
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };
    
    // Add event listeners for first user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [audioInitialized]);

  // Save sound preference to local storage when it changes
  useEffect(() => {
    localStorage.setItem('mac-sounds-enabled', String(enabled));
  }, [enabled]);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  // Sound playback functions that respect the enabled state
  const playStartup = useCallback(() => {
    if (enabled && audioInitialized) {
      playStartupSound();
    }
  }, [enabled, audioInitialized]);

  const playClick = useCallback(() => {
    if (enabled && audioInitialized) {
      playClickSound();
    }
  }, [enabled, audioInitialized]);

  const playError = useCallback(() => {
    if (enabled && audioInitialized) {
      playErrorSound();
    }
  }, [enabled, audioInitialized]);

  const playSuccess = useCallback(() => {
    if (enabled && audioInitialized) {
      playSuccessSound();
    }
  }, [enabled, audioInitialized]);

  const playDisk = useCallback(() => {
    if (enabled && audioInitialized) {
      playDiskSound();
    }
  }, [enabled, audioInitialized]);

  return {
    enabled,
    toggleSound,
    playStartup,
    playClick,
    playError,
    playSuccess,
    playDisk
  };
};

export default useMacSounds;
