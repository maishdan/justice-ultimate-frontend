import { useEffect, useState } from 'react';

interface StepMarqueeProps<T> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
  intervalMs?: number; // default 60s per item
  className?: string;
}

export default function StepMarquee<T>({ items, renderItem, intervalMs = 60000, className = '' }: StepMarqueeProps<T>) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items?.length) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, Math.max(1000, intervalMs));
    return () => clearInterval(id);
  }, [items, intervalMs]);

  if (!items?.length) return null;

  return (
    <div className={`relative w-full flex items-center justify-center overflow-hidden ${className}`}>
      <div className="w-full flex items-center justify-center">
        {renderItem(items[index])}
      </div>
    </div>
  );
}


