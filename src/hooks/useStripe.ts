import { useState } from 'react';
import { getStripe, STRIPE_PRODUCTS, StripeProductType } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createCheckoutSession = async (
    productType: StripeProductType,
    userEmail?: string,
    userName?: string
  ) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const product = STRIPE_PRODUCTS[productType];
      
      // Create checkout session via Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: product.priceId,
          mode: productType === 'pro' ? 'subscription' : 'payment',
          customerEmail: userEmail || user.email,
          customerName: userName,
          userId: user.id,
          productType,
          successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}&success=true`,
          cancelUrl: `${window.location.origin}?canceled=true`,
        },
      });

      if (functionError) {
        // Provide more detailed error message based on the error
        let errorMessage = functionError.message || 'Failed to create checkout session';
        
        // Check for specific error patterns
        if (errorMessage.includes('subscription')) {
          errorMessage = 'There was an issue with your subscription. Please try again or contact support.';
        } else if (errorMessage.includes('customer')) {
          errorMessage = 'There was an issue with your customer profile. Please complete your profile information first.';
        } else if (errorMessage.includes('stripe')) {
          errorMessage = 'Our payment processor is currently experiencing issues. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      if (!data?.sessionId) {
        throw new Error('No session ID returned from checkout creation. Please try again.');
      }

      // Redirect to Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Failed to redirect to checkout. Please try again.');
      }

    } catch (err) {
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Provide more user-friendly error messages
        if (errorMessage.includes('Failed to create subscription record')) {
          errorMessage = 'We couldn\'t create your subscription. Please try again or contact support.';
        } else if (errorMessage.includes('Failed to update subscription record')) {
          errorMessage = 'We couldn\'t update your subscription. Please try again or contact support.';
        }
      }
      
      setError(errorMessage);
      console.error('Stripe checkout error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPortalSession = async () => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('create-portal-session', {
        body: {
          returnUrl: window.location.origin,
        },
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to create portal session');
      }

      if (!data?.url) {
        throw new Error('No portal URL returned');
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Stripe portal error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    createPortalSession,
    loading,
    error,
    clearError: () => setError(null),
  };
};