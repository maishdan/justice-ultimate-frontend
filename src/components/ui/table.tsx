import React from 'react';

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full border-collapse dark:text-white">{children}</table>;
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-100 dark:bg-gray-700">{children}</thead>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b dark:border-gray-600">{children}</tr>;
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{children}</td>;
}
export function TableHeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <th className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </th>
  );
}