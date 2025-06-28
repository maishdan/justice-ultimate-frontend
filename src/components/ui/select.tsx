import React from 'react';

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="border px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white w-full">{children}</select>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}
export function SelectGroup({ children }: { children: React.ReactNode }) {
  return <optgroup>{children}</optgroup>;
}