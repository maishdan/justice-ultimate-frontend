import React from 'react';
import { FiBell, FiGlobe, FiUser } from 'react-icons/fi';

const Topbar = () => {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-500 px-4 md:px-6 py-4 shadow-md text-white w-full min-w-0">
      <div className="text-xl font-semibold drop-shadow">Welcome to Your Dashboard</div>

      <div className="flex items-center space-x-6">
        <button className="hover:text-yellow-400 transition duration-300">
          <FiGlobe size={20} />
        </button>

        <button className="hover:text-yellow-400 transition duration-300 relative">
          <FiBell size={20} />
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 rounded-full text-xs w-5 h-5 flex items-center justify-center">3</span>
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
