import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CheckoutSessionRequest {
  priceId: string;
  mode: 'subscription' | 'payment';
  customerEmail: string;
  customerName?: string;
  userId: string;
  productType: 'pro' | 'single';
  successUrl: string;
  cancelUrl: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication
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

    const requestData: CheckoutSessionRequest = await req.json();

    // Get or create Stripe customer
    let customer: Stripe.Customer;
    
    // Check if user already has a Stripe customer ID
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('stripe_customer_id, id')
      .eq('user_id', user.id)
      .maybeSingle(); // Use maybeSingle instead of single to handle case where no record exists

    if (subscription?.stripe_customer_id) {
      // Retrieve existing customer
      customer = await stripe.customers.retrieve(subscription.stripe_customer_id) as Stripe.Customer;
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: requestData.customerEmail,
        name: requestData.customerName,
        metadata: {
          supabase_user_id: user.id,
        },
      });

      // Create or update subscription record with customer ID
      if (subscription) {
        // Update existing subscription
        const { error: updateError } = await supabaseClient
          .from('subscriptions')
          .update({
            stripe_customer_id: customer.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id);

        if (updateError) {
          console.error('Error updating subscription with customer ID:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update subscription record.' }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      } else {
        // Create new subscription record
        const { error: insertError } = await supabaseClient
          .from('subscriptions')
          .insert({
            user_id: user.id,
            stripe_customer_id: customer.id,
            status: 'incomplete',
            product_type: requestData.productType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error creating subscription record:', insertError);
          return new Response(
            JSON.stringify({ error: 'Failed to create subscription record.' }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }
    }

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: requestData.priceId,
          quantity: 1,
        },
      ],
      mode: requestData.mode,
      success_url: requestData.successUrl,
      cancel_url: requestData.cancelUrl,
      metadata: {
        user_id: user.id,
        product_type: requestData.productType,
      },
    };

    // Add subscription-specific parameters
    if (requestData.mode === 'subscription') {
      sessionParams.subscription_data = {
        metadata: {
          user_id: user.id,
          product_type: requestData.productType,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});