import React from 'react';

export default function History() {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl shadow-xl text-white relative overflow-hidden animate-fadein">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-6xl mb-4 animate-pulse drop-shadow-lg">📊</span>
        <h2 className="text-2xl font-bold mb-2 drop-shadow">Vehicle History & Reports</h2>
        <p className="text-lg text-blue-100 mb-4 max-w-md text-center">View detailed history and reports for your vehicles.</p>
        <span className="inline-block bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded-full shadow animate-shimmer">Coming Soon</span>
      </div>
    </div>
  );
} 