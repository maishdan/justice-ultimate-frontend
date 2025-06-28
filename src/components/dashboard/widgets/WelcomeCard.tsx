import React from 'react';

interface WelcomeCardProps {
  user?: {
    name?: string;
    // Add other user properties here if needed
  };
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ user }) => {
  return (
    <div className="bg-green-800 hover:shadow-2xl hover:scale-[1.02] transition-all rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-2">👋 Welcome back, {user?.name || 'Guest'}!</h2>
      <p className="text-sm mb-4 text-gray-300">
        Here’s a quick glance at your activity.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-950 p-4 rounded shadow-md">
          <p className="text-sm text-gray-400">Cars Booked</p>
          <p className="text-xl font-bold">2</p>
        </div>
        <div className="bg-green-950 p-4 rounded shadow-md">
          <p className="text-sm text-gray-400">Test Drives</p>
          <p className="text-xl font-bold">1</p>
        </div>
        <div className="bg-green-950 p-4 rounded shadow-md">
          <p className="text-sm text-gray-400">Messages</p>
          <p className="text-xl font-bold">5</p>
        </div>
        <div className="bg-green-950 p-4 rounded shadow-md">
          <p className="text-sm text-gray-400">Verification</p>
          <p className="text-xl font-bold">✔️ Verified</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
