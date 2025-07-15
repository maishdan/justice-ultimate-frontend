import React from 'react';

export default function GuestNavbar() {
  return (
    <nav className="w-full bg-white/90 dark:bg-gray-900/90 shadow-md py-3 px-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <img src="/logo192.png" alt="Justice Ultimate Automobiles" className="h-10 w-10 rounded-full shadow" />
        <span className="text-xl font-bold text-blue-800 dark:text-green-300 tracking-tight">Justice <span className="text-green-600 dark:text-yellow-400">Ultimate</span> Automobiles</span>
      </div>
      <div className="hidden md:flex gap-6 items-center">
        <a href="/" className="hover:text-green-600 dark:hover:text-yellow-400 font-medium">Home</a>
        <a href="/services" className="hover:text-green-600 dark:hover:text-yellow-400 font-medium">Services</a>
        <a href="/vehicle-catalogue" className="hover:text-green-600 dark:hover:text-yellow-400 font-medium">Showroom</a>
        <a href="/about" className="hover:text-green-600 dark:hover:text-yellow-400 font-medium">Company</a>
        <a href="/contact" className="hover:text-green-600 dark:hover:text-yellow-400 font-medium">Contact Us</a>
      </div>
      <div className="flex gap-2 items-center">
        <a href="/register" className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-semibold shadow">Register</a>
        <a href="/login" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow">Login</a>
        {/* Language and dark mode toggles (placeholders) */}
        <button className="ml-2 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs font-bold">EN</button>
        <button className="ml-2 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs font-bold">🌙</button>
      </div>
    </nav>
  );
} 