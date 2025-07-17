import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

interface WelcomeCardProps {
  user?: {
    name?: string;
    role?: string;
  };
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ user }) => {
  if (!user || !user.name || !user.role) return null;
  return (
    <div className="bg-green-800 rounded-lg p-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-1">Welcome, {user.name}!</h2>
        <p className="text-base text-green-100 font-semibold mb-1">{user.role}</p>
      </div>
    </div>
  );
};

export default WelcomeCard;
