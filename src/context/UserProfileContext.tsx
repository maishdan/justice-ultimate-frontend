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
    
    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await refreshProfile();
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // Only proceed if user is authenticated and has a valid session
      if (authError || !user) {
        setProfile(null);
        return;
      }

      // Check if we have a valid session token
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        setProfile(null);
        return;
      }

      let { data, error, status } = await supabase
        .from('profiles')
        .select('first_name, last_name, full_name, avatar_url')
        .eq('id', user.id)
        .single();
        
      if (error && error.code === 'PGRST116') {
        // No profile row exists, so create one
        const emptyProfile = {
          id: user.id,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          full_name: user.user_metadata?.full_name || '',
          avatar_url: '',
        };
        await supabase.from('profiles').insert(emptyProfile);
        data = emptyProfile;
      }
      
      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.error('Profile fetch failed:', err);
      setProfile(null);
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