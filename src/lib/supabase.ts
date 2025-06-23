import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { mockSupabase, mockSignIn, mockSignUp, mockSignOut, mockGetCurrentUser } from './mockAuth';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Determine if we should use mock authentication
const useMockAuth = !supabaseUrl || !supabaseAnonKey || import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Enhanced debug logging
if (typeof window !== 'undefined') {
  console.log('Environment check:');
  console.log('- Supabase URL:', supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : 'MISSING');
  console.log('- Supabase Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 8)}...` : 'MISSING');
  console.log('- Using Mock Auth:', useMockAuth ? 'YES' : 'NO');
}

// Create client based on environment
let supabaseClient: SupabaseClient | typeof mockSupabase;

if (useMockAuth) {
  console.log('🔧 Using mock authentication for development');
  supabaseClient = mockSupabase;
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'csvdrop-web'
      }
    }
  });
}

export const supabase = supabaseClient;

// Types for our database
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  has_seen_onboarding: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  type: 'free' | 'pro' | 'single';
  status: 'active' | 'cancelled' | 'expired';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  download_count: number;
  single_download_used: boolean;
  created_at: string;
  updated_at: string;
}

export interface DownloadHistory {
  id: string;
  user_id: string;
  file_name: string;
  row_count: number;
  column_count: number;
  file_size: number;
  ticket_number: string;
  download_type: 'free' | 'pro' | 'single';
  created_at: string;
}

// Enhanced error handling wrapper
const withErrorHandling = async <T>(operation: () => Promise<T>, operationName: string): Promise<T> => {
  try {
    return await operation();
  } catch (error: unknown) {
    console.error(`Error in ${operationName}:`, error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Please check your connection');
    }
    
    throw error;
  }
};

// Auth helpers with enhanced error handling
export const signUp = async (email: string, password: string): Promise<{ data: { user: any } | null, error: any | null }> => {
  if (useMockAuth) {
    return mockSignUp(email);
  }
  
  try {
    const result = await (supabase as any).auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/welcome',
      },
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return { data: result.data, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Sign up failed';
    return { data: null, error: { message } };
  }
};

export const signIn = async (email: string, password: string) => {
  if (useMockAuth) {
    return mockSignIn(email);
  }
  
  try {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return { data: result.data, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Sign in failed';
    return { data: null, error: { message } };
  }
};

export const signOut = async () => {
  if (useMockAuth) {
    return mockSignOut();
  }
  
  try {
    const result = await supabase.auth.signOut();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return { error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Sign out failed';
    return { error: { message } };
  }
};

export const getCurrentUser = async (): Promise<{ user: any | null, error?: any }> => {
  if (useMockAuth) {
    const result = await mockGetCurrentUser();
    return { user: result.user || null, error: result.error || null };
  }
  
  try {
    // First try to get from existing session
    const sessionResult = await supabase.auth.getSession();
    if (sessionResult.data?.session?.user) {
      return { user: sessionResult.data.session.user, error: null };
    }
    
    // If no session, try to get user directly
    const userResult = await supabase.auth.getUser();
    return { user: userResult.data?.user || null, error: userResult.error };
  } catch (error: unknown) {
    console.error('Error getting current user:', error);
    return { user: null, error: error };
  }
};

// Edge function caller with better error handling
export const callEdgeFunction = async (functionName: string, body: Record<string, unknown>) => {
  if (useMockAuth) {
    // Mock implementation for edge functions
    console.log(`Mock edge function call to ${functionName}`, body);
    return { data: { success: true }, error: null };
  }
  
  return withErrorHandling(
    async () => {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body,
      });
      
      if (error) throw error;
      return { data, error: null };
    },
    `edgeFunction:${functionName}`
  );
};

// Mock implementations for database operations
export const createOrUpdateProfile = async (profileData: {
  firstName: string;
  lastName: string;
  email: string;
  hasSeenOnboarding?: boolean;
}): Promise<{ data: UserProfile | null, error: Error | null }> => {
  // In mock mode, just return success
  if (useMockAuth) {
    const mockProfile: UserProfile = {
      id: 'mock-profile-id',
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      email: profileData.email,
      has_seen_onboarding: profileData.hasSeenOnboarding || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { data: mockProfile, error: null };
  }
  
  // Real implementation would go here
  return { data: null, error: null };
};

export const updateProfile = async (updates: Partial<{
  firstName: string;
  lastName: string;
  hasSeenOnboarding: boolean;
}>): Promise<{ data: UserProfile | null, error: Error | null }> => {
  // In mock mode, just return success
  if (useMockAuth) {
    const mockProfile: UserProfile = {
      id: 'mock-profile-id',
      first_name: updates.firstName || 'User',
      last_name: updates.lastName || '',
      email: 'mock@example.com',
      has_seen_onboarding: updates.hasSeenOnboarding || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { data: mockProfile, error: null };
  }
  
  // Real implementation would go here
  return { data: null, error: null };
};

export const getProfile = async () => {
  // In mock mode, return mock profile
  if (useMockAuth) {
    return { 
      data: { 
        id: 'mock-profile-id',
        first_name: 'Demo',
        last_name: 'User',
        email: 'demo@example.com',
        has_seen_onboarding: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, 
      error: null 
    };
  }
  
  // Real implementation would go here
  return { data: null, error: null };
};

export const getSubscription = async () => {
  // In mock mode, return mock subscription
  if (useMockAuth) {
    return { 
      data: { 
        id: 'mock-subscription-id',
        user_id: 'mock-user-id',
        type: 'pro',
        status: 'active',
        download_count: 5,
        single_download_used: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, 
      error: null 
    };
  }
  
  // Real implementation would go here
  return { data: null, error: null };
};

export const updateSubscription = async (updates: {
  incrementDownloadCount?: boolean;
  markSingleDownloadUsed?: boolean;
  type?: 'free' | 'pro' | 'single';
  status?: 'active' | 'cancelled' | 'expired';
}) => {
  // In mock mode, just return success
  if (useMockAuth) {
    return { data: { id: 'mock-subscription-id', ...updates }, error: null };
  }
  
  // Real implementation would go here
  return { data: null, error: null };
};

export const recordDownload = async (downloadData: {
  fileName: string;
  rowCount: number;
  columnCount: number;
  fileSize: number;
  ticketNumber: string;
  downloadType: 'free' | 'pro' | 'single';
}) => {
  // In mock mode, just return success
  if (useMockAuth) {
    return { data: { id: 'mock-download-id', ...downloadData }, error: null };
  }
  
  // Real implementation would go here
  return { data: null, error: null };
};

export const getDownloadHistory = async (page = 1, limit = 10) => {
  // In mock mode, return mock download history with pagination support
  if (useMockAuth) {
    const mockItems = Array(limit).fill(null).map((_, i) => ({
      id: `mock-download-${(page-1)*limit + i}`,
      user_id: 'mock-user-id',
      file_name: `sample-file-${(page-1)*limit + i}.csv`,
      row_count: 1000 + i * 500,
      column_count: 5 + i,
      file_size: 2048 + i * 1024,
      ticket_number: `TKT-${1000 + (page-1)*limit + i}`,
      download_type: i % 2 === 0 ? 'free' : 'pro',
      created_at: new Date(Date.now() - ((page-1)*limit + i) * 86400000).toISOString()
    }));
    
    return { 
      data: mockItems,
      pagination: { currentPage: page, totalPages: 5, limit },
      error: null 
    };
  }
  
  // Real implementation would go here
  return { data: null, error: null };
};

// Test connection on initialization (only for real Supabase)
if (!useMockAuth && typeof window !== 'undefined') {
  try {
    supabase.auth.getSession().then((response) => {
      if (response.error) {
        console.error('Supabase connection test failed:', response.error);
      } else {
        console.log('Supabase connection successful');
      }
    }).catch((err: Error) => {
      console.error('Supabase connection failed:', err);
    });
  } catch (err: unknown) {
    console.error('Failed to test Supabase connection:', err);
  }
}