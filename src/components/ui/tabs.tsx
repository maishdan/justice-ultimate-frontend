import React from 'react';

export function Tabs({ children }: { children: React.ReactNode }) {
  return <div className="tabs-container">{children}</div>;
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 border-b dark:border-gray-700 mb-4">{children}</div>;
}

export function TabsTrigger({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium ${
        selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 dark:text-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

export function TabsContent({ children }: { children: React.ReactNode }) {
  return <div className="py-4">{children}</div>;
}
