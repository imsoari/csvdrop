import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  kycVerified?: boolean;
  hasSeenOnboarding?: boolean;
}

function validateProfileData(data: Partial<UserProfileData>, isRequired: boolean = true): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (isRequired || data.firstName !== undefined) {
    if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.trim().length === 0) {
      errors.push('firstName is required and must be a non-empty string');
    }
  }

  if (isRequired || data.lastName !== undefined) {
    if (!data.lastName || typeof data.lastName !== 'string' || data.lastName.trim().length === 0) {
      errors.push('lastName is required and must be a non-empty string');
    }
  }

  if (isRequired || data.email !== undefined) {
    if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
      errors.push('email is required and must be a non-empty string');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        errors.push('email must be a valid email address');
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables and validate they exist
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing environment variables:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey
      });
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error', 
          details: 'Missing required environment variables' 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase client with proper configuration for edge functions
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      console.error('Authentication error');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body to get the intended method and data
    let requestBody: Record<string, unknown> = {};
    try {
      const bodyText = await req.text();
      if (bodyText) {
        requestBody = JSON.parse(bodyText);
      }
    } catch {
      // If body parsing fails, continue with empty object
    }

    // Determine the actual method - check _method field first, then fall back to req.method
    const method = requestBody._method || req.method;

    switch (method) {
      case 'GET': {
        // Get user profile
        const { data: profile } = await supabaseClient
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile) {
          console.error('Error fetching profile');
          return new Response(
            JSON.stringify({ error: 'Failed to fetch profile' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ profile: profile || null }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'POST': {
        // Create or update user profile
        const profileData: UserProfileData = requestBody;

        // Validate required fields for profile creation
        const { isValid: isValidCreate, errors: createErrors } = validateProfileData(profileData, true);
        if (!isValidCreate) {
          return new Response(
            JSON.stringify({ error: 'Validation failed', details: createErrors }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const { data: upsertedProfile } = await supabaseClient
          .from('user_profiles')
          .upsert({
            id: user.id,
            first_name: profileData.firstName.trim(),
            last_name: profileData.lastName.trim(),
            email: profileData.email.trim(),
            kyc_verified: profileData.kycVerified ?? false,
            has_seen_onboarding: profileData.hasSeenOnboarding ?? false,
          })
          .select()
          .single();

        // Create default subscription if it doesn't exist
        const { data: existingSubscription } = await supabaseClient
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!existingSubscription) {
          const { error: subscriptionError } = await supabaseClient
            .from('subscriptions')
            .insert({
              user_id: user.id,
              type: 'free',
              status: 'active',
            });

          if (subscriptionError) {
            console.error('Error creating subscription:', subscriptionError);
            // Don't throw here, profile creation should still succeed
          }
        }

        return new Response(
          JSON.stringify({ profile: upsertedProfile }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'PUT': {
        // Update specific profile fields
        const updateData: Partial<UserProfileData> = requestBody;
        
        // Validate fields that are being updated
        const { isValid: isValidUpdate, errors: updateErrors } = validateProfileData(updateData, false);
        if (!isValidUpdate) {
          return new Response(
            JSON.stringify({ error: 'Validation failed', details: updateErrors }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const updateFields: Record<string, unknown> = {};
        if (updateData.firstName) updateFields.first_name = updateData.firstName.trim();
        if (updateData.lastName) updateFields.last_name = updateData.lastName.trim();
        if (updateData.email) updateFields.email = updateData.email.trim();
        if (updateData.kycVerified !== undefined) updateFields.kyc_verified = updateData.kycVerified;
        if (updateData.hasSeenOnboarding !== undefined) updateFields.has_seen_onboarding = updateData.hasSeenOnboarding;

        const { data: updatedProfile } = await supabaseClient
          .from('user_profiles')
          .update(updateFields)
          .eq('id', user.id)
          .select()
          .single();

        return new Response(
          JSON.stringify({ profile: updatedProfile }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      default: {
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch {
    console.error('Error in user-profile function');
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});