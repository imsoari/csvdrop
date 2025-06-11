# 💳 Stripe Production Setup Guide

## 🎯 Quick Setup Checklist

### 1. Switch to Live Mode
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Toggle to "Live" mode** (top-left corner)
3. Complete account verification if prompted

### 2. Create Products

#### Pro Monthly Subscription
```
Product Name: CSVDROP Pro Monthly
Description: Unlimited CSV downloads and priority processing
Pricing Model: Recurring
Price: $9.99 USD
Billing Period: Monthly
```

**Steps:**
1. Products → Create Product
2. Fill in details above
3. **Copy the Price ID** (starts with `price_`) 
4. Save as `VITE_STRIPE_PRO_PRICE_ID`

#### Single Download
```
Product Name: CSVDROP Single Download  
Description: One-time CSV download access
Pricing Model: One-time
Price: $2.99 USD
```

**Steps:**
1. Products → Create Product
2. Fill in details above
3. **Copy the Price ID** (starts with `price_`)
4. Save as `VITE_STRIPE_SINGLE_PRICE_ID`

### 3. Get API Keys
1. Developers → API Keys
2. **Copy Publishable Key** (pk_live_...) → `VITE_STRIPE_PUBLISHABLE_KEY`
3. **Copy Secret Key** (sk_live_...) → `STRIPE_SECRET_KEY`

### 4. Set Up Webhook
1. Developers → Webhooks → Add Endpoint
2. **Endpoint URL**: `https://your-domain.com/functions/v1/stripe-webhook`
3. **Select Events**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **Copy Webhook Secret** (whsec_...) → `STRIPE_WEBHOOK_SECRET`

## 🧪 Testing Your Setup

### Test Cards (Use in Live Mode Testing)
```
# Successful Payment
4242 4242 4242 4242

# Declined Payment  
4000 0000 0000 0002

# Requires Authentication
4000 0025 0000 3155
```

### Test Subscription Flow
1. Create test customer in Stripe Dashboard
2. Use test card to complete checkout
3. Verify webhook receives events
4. Check database updates correctly

## 🔒 Security Best Practices

### Environment Variables
```bash
# ✅ DO: Use environment variables
STRIPE_SECRET_KEY=sk_live_...

# ❌ DON'T: Hardcode in source
const stripe = new Stripe('sk_live_hardcoded_key')
```

### Webhook Security
```typescript
// ✅ DO: Verify webhook signatures
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

// ❌ DON'T: Trust webhook data without verification
```

## 📊 Monitoring & Analytics

### Stripe Dashboard Metrics
- Monthly Recurring Revenue (MRR)
- Customer Lifetime Value (CLV)
- Churn Rate
- Failed Payment Rate

### Key Metrics to Track
- Conversion Rate (Free → Paid)
- Average Revenue Per User (ARPU)
- Payment Success Rate
- Subscription Retention

## 🚨 Common Issues & Solutions

### Issue: Webhook Not Receiving Events
**Solution:**
1. Check webhook URL is publicly accessible
2. Verify SSL certificate is valid
3. Check webhook secret matches environment variable
4. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/webhook`

### Issue: Payment Fails in Production
**Solution:**
1. Verify using live API keys (not test keys)
2. Check customer's payment method is valid
3. Ensure webhook handles `invoice.payment_failed` events
4. Review Stripe Dashboard for specific error messages

### Issue: Subscription Not Updating
**Solution:**
1. Check webhook endpoint is receiving events
2. Verify database connection in webhook handler
3. Ensure user ID mapping is correct
4. Check Supabase RLS policies allow updates

## 📞 Support Resources

### Stripe Support
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Status Page](https://status.stripe.com)

### Testing Tools
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)
- [API Testing](https://stripe.com/docs/api)

## ✅ Production Readiness Checklist

- [ ] Live mode activated
- [ ] Products created with correct pricing
- [ ] API keys configured in production environment
- [ ] Webhook endpoint configured and tested
- [ ] Payment flows tested end-to-end
- [ ] Error handling implemented
- [ ] Monitoring and alerts set up
- [ ] Customer support process defined

Your Stripe integration is now production-ready! 🎉