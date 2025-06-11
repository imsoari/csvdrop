/**
 * Mock Authentication Service for Development
 * This provides a fake authentication flow without requiring Supabase
 */

import { User } from '@supabase/supabase-js';

// Mock user data
const MOCK_USERS = [
  {
    id: 'mock-user-1',
    email: 'demo@example.com',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-user-2',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
  }
];

// Store current user in localStorage
const LOCAL_STORAGE_KEY = 'csvdrop-mock-auth-user';

// Mock authentication methods
export const mockSignIn = async (email: string, password: string) => {
  // For demo purposes, any password works for mock users
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    return { data: { user }, error: null };
  }
  
  return { 
    data: { user: null }, 
    error: { message: 'Invalid credentials' } 
  };
};

export const mockSignUp = async (email: string, password: string) => {
  // Check if user already exists
  const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    return { 
      data: { user: null }, 
      error: { message: 'User already exists' } 
    };
  }
  
  // Create new mock user
  const newUser = {
    id: `mock-user-${Date.now()}`,
    email: email,
    created_at: new Date().toISOString(),
  };
  
  // Add to mock users array
  MOCK_USERS.push(newUser);
  
  // Set as current user
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
  
  return { data: { user: newUser }, error: null };
};

export const mockSignOut = async () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  return { error: null };
};

export const mockGetCurrentUser = async () => {
  const userJson = localStorage.getItem(LOCAL_STORAGE_KEY);
  const user = userJson ? JSON.parse(userJson) : null;
  return { user };
};

// Mock event emitter for auth state changes
type AuthChangeCallback = (event: string, session: { user: User | null }) => void;
const authCallbacks: AuthChangeCallback[] = [];

export const mockAuthStateChange = (callback: AuthChangeCallback) => {
  authCallbacks.push(callback);
  
  // Return mock subscription
  return {
    data: {
      subscription: {
        unsubscribe: () => {
          const index = authCallbacks.indexOf(callback);
          if (index > -1) {
            authCallbacks.splice(index, 1);
          }
        }
      }
    }
  };
};

// Helper to trigger auth state change events
export const triggerAuthChange = (event: string, user: User | null) => {
  authCallbacks.forEach(callback => callback(event, { user }));
};

// Mock Supabase client
export const mockSupabase = {
  auth: {
    onAuthStateChange: mockAuthStateChange,
    getUser: mockGetCurrentUser,
    signUp: mockSignUp,
    signIn: mockSignIn,
    signOut: mockSignOut
  }
};
