import React from 'react';

interface LoadingScreenProps {
  text?: string;
  progress?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ text = 'Loading...', progress = 0 }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center">
      <div className="loading-spinner mx-auto mb-4" aria-label="Loading spinner" />
      <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200" aria-live="polite">
        {text}
      </h2>
      <div className="progress-bar w-64 mx-auto" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{progress}% Complete</p>
    </div>
  </div>
);

export default LoadingScreen; 