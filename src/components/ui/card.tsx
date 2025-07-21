// src/components/ui/card.tsx
import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border p-4 shadow-md glass-panel bg-gradient-to-br from-blue-700/80 via-blue-900/70 to-blue-950/90 border-blue-400/40 backdrop-blur-xl ring-2 ring-blue-400/20 hover:ring-blue-300/40 transition-all duration-300 text-white dark:text-white ${className}`}
      style={{ boxShadow: '0 8px 32px 0 rgba(0, 60, 255, 0.25)' }}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-xl font-bold text-black dark:text-white ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-sm text-gray-700 dark:text-gray-300 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-xs text-gray-500 dark:text-gray-400 mt-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-t ${className}`}
      style={{ width: "100%", height: "auto" }}
    />
  );
}
