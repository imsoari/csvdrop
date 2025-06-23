import { useState, useEffect } from 'react';
import { UserProfile, getProfile, createOrUpdateProfile, updateProfile } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await getProfile();
      if (error) throw error;
      setProfile(data || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    hasSeenOnboarding?: boolean;
  }) => {
    try {
      // Use default values for required fields if not provided
      const completeProfileData = {
        firstName: profileData.firstName || 'User',
        lastName: profileData.lastName || '',
        email: profileData.email || user?.email || '',
        hasSeenOnboarding: profileData.hasSeenOnboarding || false,
      };
      
      const { data, error } = await createOrUpdateProfile(completeProfileData);
      if (error) throw error;
      setProfile(data || null);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating profile:', error);
      return { data: null, error };
    }
  };

  const updateUserProfile = async (updates: Partial<{
    firstName: string;
    lastName: string;
    hasSeenOnboarding: boolean;
  }>) => {
    try {
      const { data, error } = await updateProfile(updates);
      if (error) throw error;
      setProfile(data || null);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, error };
    }
  };

  return {
    profile,
    loading,
    createProfile,
    updateProfile: updateUserProfile,
    refetch: fetchProfile,
  };
};