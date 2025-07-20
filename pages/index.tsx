import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="page-background min-h-screen w-full">
      <div className="glass-panel min-h-screen w-full flex flex-col items-center justify-center">
        <Image src="/logo.png" width={120} height={120} alt="JUA Logo" className="mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Welcome to Justice Ultimate Automobiles</h1>
        <p className="text-white mb-4 drop-shadow-lg">Drive Your Dream Today</p>
        <Link href="/splash" className="px-6 py-2 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 font-semibold">View Splash Screen</Link>
      </div>
    </div>
  );
} 