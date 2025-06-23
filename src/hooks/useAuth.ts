import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser, signIn, signUp, signOut } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    getCurrentUser().then(({ user }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (result.error) {
      throw new Error(result.error.message || 'Sign in failed');
    }
    return result.data;
  };

  const register = async (email: string, password: string) => {
    const result = await signUp(email, password);
    if (result.error) {
      throw new Error(result.error.message || 'Sign up failed');
    }
    return result.data;
  };

  const logout = async () => {
    const result = await signOut();
    if (result.error) {
      throw new Error(result.error.message || 'Sign out failed');
    }
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};