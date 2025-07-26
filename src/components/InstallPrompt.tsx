import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor, RefreshCw } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showInstallStart, setShowInstallStart] = useState(false);
  const [showInstallSuccess, setShowInstallSuccess] = useState(false);

  useEffect(() => {
    // Detect device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setDeviceType(isMobile ? 'mobile' : 'desktop');

    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        setShowPrompt(false);
        return true;
      }
      return false;
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!checkIfInstalled()) {
        setShowPrompt(true);
      }
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    // Listen for custom trigger install event from header
    const handleTriggerInstall = () => {
      if (deferredPrompt && !isInstalled) {
        handleInstall();
      } else if (!deferredPrompt && !isInstalled) {
        setShowPrompt(true);
      }
    };

    // Check if already installed on load
    if (!checkIfInstalled()) {
      // Show prompt after a delay if not installed
      const timer = setTimeout(() => {
        if (deferredPrompt && !isInstalled) {
          setShowPrompt(true);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('triggerInstall', handleTriggerInstall);

    // Listen for service worker update
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) return;
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
                setWaitingWorker(newWorker);
              }
            });
          }
        });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('triggerInstall', handleTriggerInstall);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support beforeinstallprompt
      if (deviceType === 'mobile') {
        alert('To install the app:\n\n1. Tap the share button\n2. Select "Add to Home Screen"\n3. Tap "Add"');
      } else {
        alert('To install the app:\n\n1. Click the install icon in your browser\'s address bar\n2. Click "Install"');
      }
      return;
    }
    setShowInstallStart(true);
    setIsInstalling(true);
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
        setShowInstallStart(false);
        setShowInstallSuccess(true);
        setTimeout(() => {
          setShowInstallSuccess(false);
          window.location.reload();
        }, 2000);
      } else {
        setShowInstallStart(false);
      }
    } catch (error) {
      setShowInstallStart(false);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Hide for 24 hours
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  // Check if prompt was recently dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        setShowPrompt(false);
      } else {
        localStorage.removeItem('installPromptDismissed');
      }
    }
  }, []);

  if (updateAvailable) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="glass-panel backdrop-blur-xl bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border border-yellow-300/30 rounded-2xl shadow-2xl p-4 max-w-sm w-[95vw] md:w-[400px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-black animate-spin" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">New Update Available</h3>
                <p className="text-white/70 text-xs">A new version of Justice Ultimate Automobiles is ready. Please update to get the latest features and improvements.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-bold py-2 px-4 rounded-xl text-sm transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Update Now
              </button>
            </div>
            <div className="mt-3 text-xs text-white/60">
              <p>✨ Fast updates • Seamless experience</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (isInstalled || !showPrompt) {
    return null;
  }

  // Left-side install start popup
  if (showInstallStart) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-6 left-6 z-[9999]"
        >
          <div className="glass-panel backdrop-blur-xl bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 border border-yellow-300/30 rounded-2xl shadow-2xl p-4 w-[320px] flex items-center gap-3">
            <Download className="w-8 h-8 text-black animate-bounce" />
            <div>
              <h3 className="text-black font-bold text-base">Installing Justice Ultimate...</h3>
              <p className="text-black/70 text-xs">Please confirm the install prompt in your browser.</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Left-side install success popup
  if (showInstallSuccess) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-6 left-6 z-[9999]"
        >
          <div className="glass-panel backdrop-blur-xl bg-gradient-to-r from-green-400/30 to-green-500/30 border border-green-300/30 rounded-2xl shadow-2xl p-4 w-[320px] flex items-center gap-3">
            <Download className="w-8 h-8 text-green-700 animate-bounce" />
            <div>
              <h3 className="text-green-900 font-bold text-base">Justice Ultimate Installed!</h3>
              <p className="text-green-900/70 text-xs">The app was installed successfully. Opening now...</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="glass-panel backdrop-blur-xl bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border border-yellow-300/30 rounded-2xl shadow-2xl p-4 max-w-sm w-[95vw] md:w-[400px]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                {deviceType === 'mobile' ? (
                  <Smartphone className="w-5 h-5 text-black" />
                ) : (
                  <Monitor className="w-5 h-5 text-black" />
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Install Justice Ultimate</h3>
                <p className="text-white/70 text-xs">
                  {deviceType === 'mobile' 
                    ? 'Get quick access on your phone' 
                    : 'Install as a desktop app'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-bold py-2 px-4 rounded-xl text-sm transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInstalling ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Installing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Install App
                </>
              )}
            </button>
          </div>
          
          <div className="mt-3 text-xs text-white/60">
            <p>✨ Works offline • Auto-updates • Fast loading</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 