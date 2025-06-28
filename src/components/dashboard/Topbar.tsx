import React from 'react';
import { FiBell, FiGlobe, FiUser } from 'react-icons/fi';

const Topbar = () => {
  return (
    <header className="flex items-center justify-between bg-green-900 px-6 py-4 shadow-md">
      <div className="text-xl font-semibold">Welcome to Your Dashboard</div>

      <div className="flex items-center space-x-6">
        <button className="hover:text-yellow-400 transition duration-300">
          <FiGlobe size={20} />
        </button>

        <button className="hover:text-yellow-400 transition duration-300 relative">
          <FiBell size={20} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">3</span>
        </button>

        <div className="flex items-center space-x-2">
          <FiUser size={20} />
          <span className="font-medium">Daniel</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
