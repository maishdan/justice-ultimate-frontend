import React from 'react';

export function Input({ placeholder, className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`border px-4 py-2 rounded-lg w-full dark:bg-gray-800 dark:text-white ${className}`} placeholder={placeholder} {...props} />;
}
export function TextArea({ placeholder, className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`border px-4 py-2 rounded-lg w-full dark:bg-gray-800 dark:text-white ${className}`}
      placeholder={placeholder}
      {...props}
    />
  );
}
export function SearchInput({ placeholder, className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="search"
        className="border px-4 py-2 rounded-lg w-full dark:bg-gray-800 dark:text-white pl-10"
        placeholder={placeholder}
        {...props}
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        🔍
      </span>
    </div>
  );
}