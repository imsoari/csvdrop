# 🎯 CSVDROP Stripe Setup - Final Steps

## ✅ Your Webhook Information
- **Webhook ID**: `we_1RYTpsFCgX2xIDAtWa9reiL0`
- **Webhook Endpoint**: Already created! ✅

## 🔍 Get Your Price IDs (Critical Step)

You have the **Product IDs**, but you need the **Price IDs** for your environment variables:

### Step 1: Get Pro Plan Price ID
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Products**
2. Click on **Pro Plan Subscription** (`prod_STMqzcmAni41Qn`)
3. In the **Pricing** section, copy the **Price ID** (starts with `price_`)
4. This goes in: `VITE_STRIPE_PRO_PRICE_ID=price_xxxxx`

### Step 2: Get Single Purchase Price ID  
1. Click on **Single Purchase** (`prod_STNjipXsa9mIaP`)
2. In the **Pricing** section, copy the **Price ID** (starts with `price_`)
3. This goes in: `VITE_STRIPE_SINGLE_PRICE_ID=price_xxxxx`

### Step 3: Get Webhook Secret
1. Go to **Developers** → **Webhooks**
2. Click on your webhook (`we_1RYTpsFCgX2xIDAtWa9reiL0`)
3. Click **"Reveal"** next to **Signing secret**
4. Copy the secret (starts with `whsec_`)
5. This goes in: `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`

## 🔧 Update Your Environment Variables

Add these to your `.env` file:

```bash
# Stripe Configuration (LIVE KEYS)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_from_step_3

# Stripe Price IDs (from steps 1 & 2 above)
VITE_STRIPE_PRO_PRICE_ID=price_your_pro_price_id_here
VITE_STRIPE_SINGLE_PRICE_ID=price_your_single_price_id_here
```

## 🧪 Test Your Setup

### Quick Test Commands
```bash
# 1. Test webhook endpoint
curl -X POST https://your-domain.com/functions/v1/stripe-webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# 2. Test with Stripe CLI
stripe listen --forward-to https://your-domain.com/functions/v1/stripe-webhook
stripe trigger checkout.session.completed
```

## 🚀 You're Almost Live!

### Remaining Tasks (15 minutes):
1. ✅ **Webhook Created** (Done!)
2. 🔍 **Get Price IDs** (5 minutes)
3. 🔑 **Update Environment Variables** (2 minutes)
4. 🧪 **Test Payment Flow** (5 minutes)
5. 🌐 **Deploy to Production** (3 minutes)

## 🎯 Quick Verification

After updating your environment variables, test this flow:
1. User signs up → ✅
2. User completes KYC → ✅  
3. User uploads CSV files → ✅
4. User tries to download → Payment modal appears → ✅
5. User completes payment → Webhook fires → ✅
6. User can download immediately → ✅

## 📞 Need Help?

If you get stuck:
1. Check Stripe Dashboard → Webhooks → Recent deliveries
2. Check Supabase → Edge Functions → Logs
3. Verify all environment variables are set correctly

**You're literally minutes away from going live!** 🎉

---

## 🎊 Ready to Launch?

Once you have your Price IDs and environment variables set:

```bash
# Build for production
npm run build

# Deploy to your hosting platform
# (Netlify, Vercel, etc.)
```

**Your CSVDROP is ready to start making money!** 💰