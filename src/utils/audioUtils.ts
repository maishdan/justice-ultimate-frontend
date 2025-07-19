/**
 * Audio Utilities for Justice Ultimate Automobiles
 * Handles audio loading and playback with proper error handling
 */

/**
 * Play car start sound with error handling
 */
export const playCarStartSound = async (): Promise<void> => {
  try {
    // Check if audio has already been played
    const hasPlayed = sessionStorage.getItem("carStartPlayed");
    if (hasPlayed) {
      return;
    }

    // Create audio element
    const audio = new Audio("/car-start.mp3");
    
    // Set audio properties
    audio.volume = 0.5; // 50% volume
    audio.preload = "auto";
    
    // Add error handling
    audio.onerror = (e) => {
      console.warn("🚫 Car start audio failed to load:", e);
      // Don't throw error, just log it
    };
    
    // Try to play
    await audio.play();
    console.log("✅ Car start sound played successfully");
    
    // Mark as played
    sessionStorage.setItem("carStartPlayed", "true");
    
  } catch (error) {
    console.warn("🚫 Car start sound playback failed:", error);
    // Don't throw error, just log it
    // This could be due to autoplay policy or missing file
  }
};

/**
 * Reset car start sound (for testing)
 */
export const resetCarStartSound = (): void => {
  sessionStorage.removeItem("carStartPlayed");
  console.log("🔄 Car start sound reset");
};

/**
 * Check if audio is supported
 */
export const isAudioSupported = (): boolean => {
  return typeof Audio !== 'undefined';
};

/**
 * Check if autoplay is allowed
 */
export const isAutoplayAllowed = async (): Promise<boolean> => {
  try {
    const audio = new Audio();
    audio.volume = 0;
    await audio.play();
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Play notification sound
 */
export const playNotificationSound = async (): Promise<void> => {
  try {
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.3;
    await audio.play();
  } catch (error) {
    console.warn("Notification sound failed:", error);
  }
};

/**
 * Play success sound
 */
export const playSuccessSound = async (): Promise<void> => {
  try {
    const audio = new Audio("/success.mp3");
    audio.volume = 0.4;
    await audio.play();
  } catch (error) {
    console.warn("Success sound failed:", error);
  }
};

/**
 * Play error sound
 */
export const playErrorSound = async (): Promise<void> => {
  try {
    const audio = new Audio("/error.mp3");
    audio.volume = 0.3;
    await audio.play();
  } catch (error) {
    console.warn("Error sound failed:", error);
  }
}; 