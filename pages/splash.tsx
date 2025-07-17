import React from "react";
import Image from 'next/image';

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-green-700">
      <Image src="/logo.png" width={120} height={120} alt="JUA Logo" className="mb-4 animate-bounce" />
      {/* Placeholder for Lottie animation */}
      <div style={{ width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: 100, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="text-4xl text-yellow-300">🚗</span>
      </div>
      <div className="w-2/3 h-2 bg-gray-200 rounded-full mt-6 mb-2">
        <div className="h-2 bg-yellow-400 rounded-full animate-pulse" style={{ width: '80%' }} />
      </div>
      <h2 className="text-white text-2xl font-bold mt-4">Welcome, Daniwest!</h2>
      <p className="text-green-200 mt-2">Drive Your Dream Today</p>
    </div>
  );
} 