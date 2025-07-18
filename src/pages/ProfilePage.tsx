import React from 'react';
import ProfileInfo from '../components/dashboard/customer/ProfileInfo';

export default function ProfilePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 to-black py-8 px-2 md:px-8">
      <div className="container mx-auto px-2 md:px-4">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          My Profile
        </h1>
        <ProfileInfo />
      </div>
    </div>
  );
} 