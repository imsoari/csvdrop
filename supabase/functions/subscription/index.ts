import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface SubscriptionData {
  type: 'free' | 'pro' | 'single';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body to get the intended method and data
    let requestBody: any = {};
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
        // Get user subscription
        const { data: subscription, error: getError } = await supabaseClient
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (getError && getError.code !== 'PGRST116') {
          throw getError;
        }

        // Check if pro subscription is expired
        if (subscription && subscription.type === 'pro' && subscription.current_period_end) {
          const now = new Date();
          const endDate = new Date(subscription.current_period_end);
          
          if (now > endDate) {
            // Subscription expired, update to free
            const { data: updatedSubscription, error: updateError } = await supabaseClient
              .from('subscriptions')
              .update({
                type: 'free',
                status: 'expired',
                download_count: 0,
              })
              .eq('user_id', user.id)
              .select()
              .single();

            if (updateError) {
              throw updateError;
            }

            return new Response(
              JSON.stringify({ subscription: updatedSubscription }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          }
        }

        return new Response(
          JSON.stringify({ subscription }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'POST': {
        // Create or update subscription
        const subscriptionData: SubscriptionData = requestBody;

        const { data: upsertedSubscription, error: upsertError } = await supabaseClient
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            type: subscriptionData.type,
            status: 'active',
            stripe_customer_id: subscriptionData.stripeCustomerId,
            stripe_subscription_id: subscriptionData.stripeSubscriptionId,
            current_period_start: subscriptionData.currentPeriodStart ? new Date(subscriptionData.currentPeriodStart).toISOString() : null,
            current_period_end: subscriptionData.currentPeriodEnd ? new Date(subscriptionData.currentPeriodEnd).toISOString() : null,
            download_count: subscriptionData.type === 'pro' ? 0 : undefined,
            single_download_used: subscriptionData.type === 'single' ? false : undefined,
          })
          .select()
          .single();

        if (upsertError) {
          throw upsertError;
        }

        return new Response(
          JSON.stringify({ subscription: upsertedSubscription }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'PUT': {
        // Update subscription (e.g., increment download count)
        const updateData = requestBody;
        
        const { data: currentSubscription, error: getCurrentError } = await supabaseClient
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (getCurrentError) {
          throw getCurrentError;
        }

        const updateFields: any = {};
        
        if (updateData.incrementDownloadCount) {
          updateFields.download_count = (currentSubscription.download_count || 0) + 1;
        }
        
        if (updateData.markSingleDownloadUsed) {
          updateFields.single_download_used = true;
        }

        if (updateData.type) {
          updateFields.type = updateData.type;
        }

        if (updateData.status) {
          updateFields.status = updateData.status;
        }

        const { data: updatedSubscription, error: updateError } = await supabaseClient
          .from('subscriptions')
          .update(updateFields)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        return new Response(
          JSON.stringify({ subscription: updatedSubscription }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      default: {
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }
  } catch {
    console.error('Error in subscription function');
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});