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
      setProfile(data?.profile || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: {
    firstName: string;
    lastName: string;
    email: string;
    kycVerified?: boolean;
    hasSeenOnboarding?: boolean;
  }) => {
    try {
      const { data, error } = await createOrUpdateProfile(profileData);
      if (error) throw error;
      setProfile(data?.profile || null);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating profile:', error);
      return { data: null, error };
    }
  };

  const updateUserProfile = async (updates: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    kycVerified: boolean;
    hasSeenOnboarding: boolean;
  }>) => {
    try {
      const { data, error } = await updateProfile(updates);
      if (error) throw error;
      setProfile(data?.profile || null);
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