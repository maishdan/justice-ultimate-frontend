<<<<<<< HEAD
import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white dark:bg-gray-900 shadow rounded-xl p-4 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm text-gray-700 dark:text-gray-300 ${className}`}>{children}</div>;
}
export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-xs text-gray-500 dark:text-gray-400 ${className}`}>{children}</div>;
=======
// src/components/ui/card.tsx
import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded border p-4 shadow-md bg-white text-black dark:bg-gray-800 dark:text-white">
      {children}
    </div>
  );
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
}
