import React from 'react';

const ThemeAccessibilityControls = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-2">Theme & Accessibility</h2>
      <p className="text-sm">🌓 Toggle dark/light mode</p>
      <p className="text-sm">🔠 Adjust font size</p>
    </div>
  );
};

export default ThemeAccessibilityControls;