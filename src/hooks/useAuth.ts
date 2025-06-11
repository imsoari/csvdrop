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
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await signIn(email, password);
    return { data, error };
  };

  const register = async (email: string, password: string) => {
    const { data, error } = await signUp(email, password);
    return { data, error };
  };

  const logout = async () => {
    const { error } = await signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};