import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced debug logging
if (typeof window !== 'undefined') {
  console.log('Environment check:');
  console.log('- Supabase URL:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING');
  console.log('- Supabase Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING');
  console.log('- All env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
}

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
🚨 SUPABASE CONFIGURATION ERROR 🚨

Missing required environment variables:
- VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}
- VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}

To fix this:
1. Copy values from .env.production to .env for local development
2. For production: Go to Netlify Dashboard → Site Settings → Environment Variables
3. Add the missing variables from your Supabase project
4. Redeploy your site

Current environment: ${import.meta.env.MODE}
  `;
  
  console.error(errorMessage);
  
  // Show user-friendly error in development
  if (import.meta.env.DEV) {
    alert(errorMessage);
  }
  
  throw new Error('Supabase configuration missing. Check environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

// Test connection on initialization
if (typeof window !== 'undefined') {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('✅ Supabase connection successful');
    }
  }).catch(err => {
    console.error('❌ Supabase connection failed:', err);
  });
}

// Types for our database
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  kyc_verified: boolean;
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
const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`${operationName} failed:`, error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error during ${operationName}. Please check your internet connection and Supabase configuration.`);
    }
    
    // Check if it's a Supabase configuration error
    if (error instanceof Error && error.message.includes('Invalid API key')) {
      throw new Error(`Supabase configuration error. Please check your API keys.`);
    }
    
    throw error;
  }
};

// Auth helpers with enhanced error handling
export const signUp = async (email: string, password: string) => {
  return withErrorHandling(async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      // Provide more specific error messages
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password format');
      }
      if (error.message.includes('Email rate limit exceeded')) {
        throw new Error('Too many signup attempts. Please try again later.');
      }
      throw new Error(error.message);
    }
    
    return { data, error: null };
  }, 'signup');
};

export const signIn = async (email: string, password: string) => {
  return withErrorHandling(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Supabase signin error:', error);
      // Provide more specific error messages
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please check your email and confirm your account');
      }
      throw new Error(error.message);
    }
    
    return { data, error: null };
  }, 'signin');
};

export const signOut = async () => {
  return withErrorHandling(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    return { error: null };
  }, 'signout');
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      // Check if this is just a missing auth session (normal for unauthenticated users)
      if (error.message === 'Auth session missing!') {
        return { user: null, error: null };
      }
      throw new Error(error.message);
    }
    return { user, error: null };
  } catch (error) {
    // Handle any other errors that might occur
    if (error instanceof Error && error.message === 'Auth session missing!') {
      return { user: null, error: null };
    }
    
    console.error('getCurrentUser failed:', error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error during getCurrentUser. Please check your internet connection.');
    }
    
    // Check if it's a Supabase configuration error
    if (error instanceof Error && error.message.includes('Invalid API key')) {
      throw new Error('Supabase configuration error. Please check your API keys.');
    }
    
    throw error;
  }
};

// Enhanced Edge Function caller with better error handling
const callEdgeFunction = async (functionName: string, body: any) => {
  try {
    console.log(`Calling edge function: ${functionName}`, { body });
    
    // Validate Supabase configuration before making the call
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration is missing. Please check your environment variables.');
    }
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
    });
    
    if (error) {
      console.error(`Edge function ${functionName} error:`, error);
      
      // Handle specific edge function errors
      if (error.message?.includes('Failed to fetch')) {
        throw new Error(`Unable to connect to ${functionName} function. Please check if the Edge Function is deployed and your Supabase configuration is correct.`);
      }
      
      if (error.message?.includes('Function not found')) {
        throw new Error(`Edge function '${functionName}' not found. Please ensure it's deployed to your Supabase project.`);
      }
      
      throw new Error(error.message || `Failed to call ${functionName} function`);
    }
    
    console.log(`Edge function ${functionName} response:`, data);
    return { data, error: null };
  } catch (error) {
    console.error(`Edge function ${functionName} failed:`, error);
    
    // Enhanced error handling for edge functions
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error calling ${functionName}. Please check your internet connection and ensure the Edge Function is deployed.`);
    }
    
    throw error;
  }
};

// Profile helpers with enhanced error handling
export const createOrUpdateProfile = async (profileData: {
  firstName: string;
  lastName: string;
  email: string;
  kycVerified?: boolean;
  hasSeenOnboarding?: boolean;
}) => {
  return withErrorHandling(async () => {
    return await callEdgeFunction('user-profile', profileData);
  }, 'createOrUpdateProfile');
};

export const updateProfile = async (updates: Partial<{
  firstName: string;
  lastName: string;
  email: string;
  kycVerified: boolean;
  hasSeenOnboarding: boolean;
}>) => {
  return withErrorHandling(async () => {
    return await callEdgeFunction('user-profile', { ...updates, _method: 'PUT' });
  }, 'updateProfile');
};

export const getProfile = async () => {
  return withErrorHandling(async () => {
    return await callEdgeFunction('user-profile', { _method: 'GET' });
  }, 'getProfile');
};

// Subscription helpers with enhanced error handling
export const getSubscription = async () => {
  return withErrorHandling(async () => {
    return await callEdgeFunction('subscription', { _method: 'GET' });
  }, 'getSubscription');
};

export const updateSubscription = async (updates: {
  incrementDownloadCount?: boolean;
  markSingleDownloadUsed?: boolean;
  type?: 'free' | 'pro' | 'single';
  status?: 'active' | 'cancelled' | 'expired';
}) => {
  return withErrorHandling(async () => {
    return await callEdgeFunction('subscription', { ...updates, _method: 'PUT' });
  }, 'updateSubscription');
};

// Download history helpers with enhanced error handling
export const recordDownload = async (downloadData: {
  fileName: string;
  rowCount: number;
  columnCount: number;
  fileSize: number;
  ticketNumber: string;
  downloadType: 'free' | 'pro' | 'single';
}) => {
  return withErrorHandling(async () => {
    return await callEdgeFunction('download-history', downloadData);
  }, 'recordDownload');
};

export const getDownloadHistory = async (page = 1, limit = 10) => {
  return withErrorHandling(async () => {
    return await callEdgeFunction('download-history', { page, limit, _method: 'GET' });
  }, 'getDownloadHistory');
};