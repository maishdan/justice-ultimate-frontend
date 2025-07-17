import React from "react";
import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    } else {
      alert('To install, use your browser\'s install option.');
    }
  };

  return (
    <header className="w-full flex items-center justify-between p-4 bg-blue-950 text-white">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
        <span className="font-bold text-lg">Justice Ultimate Automobiles</span>
      </div>
      <button
        className="ml-2 px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-black text-xs rounded shadow font-semibold transition-colors"
        style={{ fontFamily: 'inherit' }}
        onClick={handleInstall}
      >
        Install JUA
      </button>
    </header>
  );
} 