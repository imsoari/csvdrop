import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing signature or webhook secret' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          // Handle subscription creation
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          // Find user by customer ID or email
          const { data: existingSubscription } = await supabaseClient
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', session.customer as string)
            .single();

          if (existingSubscription) {
            // Update existing subscription
            await supabaseClient
              .from('subscriptions')
              .update({
                type: 'pro',
                status: 'active',
                stripe_subscription_id: subscription.id,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                download_count: 0,
              })
              .eq('stripe_customer_id', session.customer as string);
          }
        } else if (session.mode === 'payment') {
          // Handle one-time payment for single download
          const { data: existingSubscription } = await supabaseClient
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', session.customer as string)
            .single();

          if (existingSubscription) {
            await supabaseClient
              .from('subscriptions')
              .update({
                type: 'single',
                status: 'active',
                single_download_used: false,
              })
              .eq('stripe_customer_id', session.customer as string);
          }
        }
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        
        await supabaseClient
          .from('subscriptions')
          .update({
            status: updatedSubscription.status === 'active' ? 'active' : 'cancelled',
            current_period_start: new Date(updatedSubscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', updatedSubscription.id);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        
        await supabaseClient
          .from('subscriptions')
          .update({
            type: 'free',
            status: 'cancelled',
            download_count: 0,
          })
          .eq('stripe_subscription_id', deletedSubscription.id);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          // Reset download count for new billing period
          await supabaseClient
            .from('subscriptions')
            .update({
              download_count: 0,
            })
            .eq('stripe_subscription_id', invoice.subscription as string);
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        
        if (failedInvoice.subscription) {
          // Mark subscription as past due or cancelled
          await supabaseClient
            .from('subscriptions')
            .update({
              status: 'cancelled',
            })
            .eq('stripe_subscription_id', failedInvoice.subscription as string);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});