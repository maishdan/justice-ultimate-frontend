import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface UserProfile {
  first_name?: string;
  last_name?: string;
  full_name?: string; // for backward compatibility
  avatar_url?: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  updateProfile: (profile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    refreshProfile();
    // Optionally, listen to auth state changes and refresh
  }, []);

  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, full_name, avatar_url')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
  };

  // Expose a function to update profile instantly
  const updateProfile = (newProfile: UserProfile) => setProfile(newProfile);

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, refreshProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error('useUserProfile must be used within a UserProfileProvider');
  return context;
} 