import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  speedMs?: number; // duration for one full loop
  className?: string;
}

// Simple, dependency-free marquee that loops children horizontally
export default function Marquee({ children, speedMs = 20000, className = '' }: MarqueeProps) {
  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      <style>{`
        @keyframes jua-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex w-[200%]"
        style={{
          animation: `jua-marquee ${speedMs}ms linear infinite`,
        }}
      >
        <div className="flex items-center gap-8 px-4">
          {children}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex items-center gap-8 px-4">
          {children}
        </div>
      </div>
    </div>
  );
}


