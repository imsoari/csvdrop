# 🔗 Stripe Webhook Setup Guide

## Your Stripe Products
- **Single Purchase**: `prod_STNjipXsa9mIaP`
- **Pro Plan Subscription**: `prod_STMqzcmAni41Qn`

## Step-by-Step Webhook Configuration

### 1. Access Stripe Dashboard
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Switch to LIVE mode** (toggle in top-left)
3. Navigate to **Developers** → **Webhooks**

### 2. Create Webhook Endpoint
1. Click **"Add endpoint"**
2. **Endpoint URL**: `https://your-domain.com/functions/v1/stripe-webhook`
   *(Replace with your actual domain)*

### 3. Configure Events
Select these **5 events** (exactly):

```
✅ checkout.session.completed
   - Triggers when payment is successful
   - Updates user subscription status

✅ customer.subscription.updated  
   - Triggers when subscription changes
   - Handles plan upgrades/downgrades

✅ customer.subscription.deleted
   - Triggers when subscription is cancelled
   - Reverts user to free plan

✅ invoice.payment_succeeded
   - Triggers on successful recurring payments
   - Resets monthly download count

✅ invoice.payment_failed
   - Triggers when payment fails
   - Handles failed subscription renewals
```

### 4. Webhook Settings
- **Description**: `CSVDROP Payment Processing Webhook`
- **API Version**: `2023-10-16` (or latest)
- **Filter events**: Select the 5 events above

### 5. Get Webhook Secret
1. After creating the webhook, click on it
2. Click **"Reveal"** next to **Signing secret**
3. Copy the secret (starts with `whsec_`)
4. Add to your environment variables as `STRIPE_WEBHOOK_SECRET`

## 🧪 Testing Your Webhook

### Using Stripe CLI (Recommended)
```bash
# Install Stripe CLI
# Download from: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Test webhook locally
stripe listen --forward-to localhost:3000/functions/v1/stripe-webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

### Manual Testing
1. Create a test purchase using Stripe test cards
2. Check webhook delivery in Stripe Dashboard
3. Verify your database updates correctly
4. Check application behavior matches expected flow

## 🔒 Security Verification

Your webhook handler already includes proper security:

```typescript
// Webhook signature verification (already implemented)
const signature = req.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

## 📊 Monitoring Webhooks

### Stripe Dashboard
1. Go to **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. Monitor **Recent deliveries** tab
4. Check for failed deliveries and retry them

### Expected Webhook Flow
```
User Purchase → Stripe Checkout → Webhook Fired → Database Updated → User Access Granted
```

## 🚨 Troubleshooting

### Webhook Not Receiving Events
1. **Check URL**: Ensure webhook URL is publicly accessible
2. **Verify SSL**: Your domain must have valid SSL certificate
3. **Test Connectivity**: Use `curl` to test your endpoint
4. **Check Logs**: Review Supabase function logs

### Webhook Receiving But Not Processing
1. **Check Signature**: Verify webhook secret is correct
2. **Review Logs**: Check Supabase edge function logs
3. **Test Events**: Use Stripe CLI to send test events
4. **Database Access**: Ensure webhook can write to database

### Common Error Messages
- `Invalid signature`: Wrong webhook secret
- `Endpoint timeout`: Function taking too long to respond
- `404 Not Found`: Incorrect webhook URL

## ✅ Verification Checklist

- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] All 5 required events selected
- [ ] Webhook secret copied to environment variables
- [ ] Webhook URL points to your production domain
- [ ] SSL certificate valid on your domain
- [ ] Test webhook delivery successful
- [ ] Database updates correctly on webhook events
- [ ] User access updates immediately after payment

## 🎯 Next Steps

1. **Set up webhook** using the configuration above
2. **Test payment flow** end-to-end
3. **Monitor webhook deliveries** in Stripe Dashboard
4. **Deploy to production** with confidence

Your webhook is now ready to handle all CSVDROP payment events! 🚀