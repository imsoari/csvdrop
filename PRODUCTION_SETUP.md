# 🚀 CSVDROP Production Setup Guide

## 1. 🔧 Environment Variables Setup

### Step 1: Supabase Production Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing one
3. Go to Settings → API
4. Copy your production values:
   - `VITE_SUPABASE_URL`: Your project URL
   - `VITE_SUPABASE_ANON_KEY`: Your anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Service role key (for edge functions)

### Step 2: Stripe Production Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Switch to LIVE mode** (toggle in top left)
3. Create Products:

#### Pro Monthly Subscription ($9.99/month)
```bash
# In Stripe Dashboard:
1. Products → Add Product
2. Name: "CSVDROP Pro Monthly"
3. Pricing: $9.99 USD, Recurring monthly
4. Copy the Price ID (starts with price_)
```

#### Single Download ($2.99 one-time)
```bash
# In Stripe Dashboard:
1. Products → Add Product  
2. Name: "CSVDROP Single Download"
3. Pricing: $2.99 USD, One-time payment
4. Copy the Price ID (starts with price_)
```

4. Get API Keys:
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Publishable key (pk_live_...)
   - `STRIPE_SECRET_KEY`: Secret key (sk_live_...)

5. Set up Webhook:
   - Endpoint URL: `https://your-domain.com/functions/v1/stripe-webhook`
   - Events to send:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy webhook secret (whsec_...)

## 2. 🌐 Domain & Hosting Setup

### Option A: Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard
4. Set up custom domain in Netlify DNS settings

### Option B: Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Framework preset: Vite
3. Add environment variables in Vercel dashboard
4. Set up custom domain in Vercel domains settings

### Domain Configuration
1. Purchase domain (recommended: csvdrop.com)
2. Point DNS to your hosting provider
3. Enable SSL/HTTPS (automatic with Netlify/Vercel)
4. Update `VITE_APP_DOMAIN` environment variable

## 3. 📧 Email Configuration

### Supabase Email Templates
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize these templates:

#### Confirm Signup Template
```html
<h2>Welcome to CSVDROP!</h2>
<p>Thanks for signing up! Please confirm your email address to get started.</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your account</a></p>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

#### Reset Password Template  
```html
<h2>Reset Your CSVDROP Password</h2>
<p>We received a request to reset your password.</p>
<p><a href="{{ .ConfirmationURL }}">Reset your password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
<p>This link will expire in 24 hours.</p>
```

#### Magic Link Template (if needed)
```html
<h2>Sign in to CSVDROP</h2>
<p>Click the link below to sign in to your account:</p>
<p><a href="{{ .ConfirmationURL }}">Sign in to CSVDROP</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

### Custom Email Domain (Optional)
1. Set up custom email domain in Supabase
2. Configure DKIM/SPF records
3. Update email templates with your branding

## 4. 🧪 End-to-End Testing Checklist

### Authentication Flow
- [ ] User registration with email confirmation
- [ ] User login with correct credentials
- [ ] Password reset flow
- [ ] Email verification process
- [ ] KYC verification process

### File Processing
- [ ] Upload CSV files (various formats)
- [ ] File validation and error handling
- [ ] CSV consolidation with different options
- [ ] Column selection and filtering
- [ ] Data preview functionality

### Payment Flows
- [ ] Free plan limitations (1 download)
- [ ] Pro subscription checkout
- [ ] Single download purchase
- [ ] Payment success/failure handling
- [ ] Webhook processing
- [ ] Subscription management portal

### User Dashboard
- [ ] Profile management
- [ ] Download history
- [ ] Subscription status
- [ ] Billing portal access

### Error Handling
- [ ] Network errors
- [ ] Payment failures
- [ ] File processing errors
- [ ] Authentication errors

## 5. 🔒 Security Checklist

### Database Security
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Proper user policies configured
- [ ] Service role key secured
- [ ] Database backups enabled

### API Security
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Webhook signature verification

### Frontend Security
- [ ] Environment variables properly configured
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced
- [ ] Security headers configured

## 6. 📊 Monitoring & Analytics

### Error Monitoring (Optional)
```bash
# Add Sentry for error tracking
npm install @sentry/react @sentry/tracing
```

### Analytics (Optional)
```bash
# Add Google Analytics
npm install gtag
```

### Performance Monitoring
- [ ] Core Web Vitals tracking
- [ ] Page load performance
- [ ] API response times
- [ ] Error rates

## 7. 🚀 Go-Live Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Stripe products created and tested
- [ ] Domain configured with SSL
- [ ] Email templates customized
- [ ] End-to-end testing completed
- [ ] Error monitoring set up

### Launch Day
- [ ] Deploy to production
- [ ] Test all critical flows
- [ ] Monitor error rates
- [ ] Check payment processing
- [ ] Verify email delivery

### Post-Launch
- [ ] Monitor user signups
- [ ] Track conversion rates
- [ ] Gather user feedback
- [ ] Plan feature updates

## 🎯 Quick Start Commands

```bash
# 1. Set up environment variables
cp .env.production .env
# Edit .env with your actual values

# 2. Test locally with production config
npm run dev

# 3. Build for production
npm run build

# 4. Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod

# 5. Deploy to Vercel  
npm install -g vercel
vercel --prod
```

## 📞 Support

If you encounter any issues during setup:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Test Stripe webhooks with Stripe CLI
4. Check Supabase logs for database issues

Your CSVDROP application is production-ready! 🎉