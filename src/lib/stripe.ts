import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key');
}

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Stripe product configuration - Updated with your actual Price IDs
export const STRIPE_PRODUCTS = {
  pro: {
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_1RYQ6mFCgX2xIDAt1rfMAaFx',
    productId: 'prod_STMqzcmAni41Qn', // Your Pro Plan Product ID
    name: 'Pro Monthly',
    price: 999, // $9.99 in cents
    currency: 'usd',
    interval: 'month'
  },
  single: {
    priceId: import.meta.env.VITE_STRIPE_SINGLE_PRICE_ID || 'price_1RYQxoFCgX2xIDAtcCtuzzAs',
    productId: 'prod_STNjipXsa9mIaP', // Your Single Purchase Product ID
    name: 'Single Download',
    price: 299, // $2.99 in cents
    currency: 'usd',
    interval: null
  }
} as const;

export type StripeProductType = keyof typeof STRIPE_PRODUCTS;