# 🔧 Environment Variables Setup Guide

## 🚨 Critical: Your site is deployed but missing environment variables!

Your CSVDROP application is deployed at: https://peppy-cranachan-b96477.netlify.app

However, it's showing "Failed to fetch" errors because the environment variables aren't configured.

## 📋 Required Environment Variables

You need to set these in your **Netlify Dashboard**:

### 1. Supabase Configuration
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Stripe Configuration  
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
VITE_STRIPE_PRO_PRICE_ID=price_1RYQ6mFCgX2xIDAt1rfMAaFx
VITE_STRIPE_SINGLE_PRICE_ID=price_1RYQxoFCgX2xIDAtcCtuzzAs
```

### 3. Domain Configuration
```bash
VITE_APP_DOMAIN=https://peppy-cranachan-b96477.netlify.app
```

## 🔧 How to Set Environment Variables in Netlify

### Method 1: Netlify Dashboard (Recommended)
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Find your site: `peppy-cranachan-b96477`
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** for each one above
5. **Deploy** → **Trigger deploy** to rebuild with new variables

### Method 2: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variables
netlify env:set VITE_SUPABASE_URL "https://your-project-id.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key_here"
netlify env:set VITE_STRIPE_PUBLISHABLE_KEY "pk_live_your_stripe_key"
netlify env:set VITE_STRIPE_PRO_PRICE_ID "price_1RYQ6mFCgX2xIDAt1rfMAaFx"
netlify env:set VITE_STRIPE_SINGLE_PRICE_ID "price_1RYQxoFCgX2xIDAtcCtuzzAs"
netlify env:set VITE_APP_DOMAIN "https://peppy-cranachan-b96477.netlify.app"

# Trigger rebuild
netlify build
netlify deploy --prod
```

## 🔍 Where to Get These Values

### Supabase Values
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon/Public Key** → `VITE_SUPABASE_ANON_KEY`

### Stripe Values
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Switch to LIVE mode** (toggle in top-left)
3. Go to **Developers** → **API Keys**
4. Copy **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY`

## ⚡ Quick Fix (5 minutes)

1. **Get Supabase credentials** (2 minutes)
2. **Get Stripe publishable key** (1 minute)  
3. **Set in Netlify dashboard** (2 minutes)
4. **Trigger redeploy** (automatic)

## 🧪 Test Your Fix

After setting environment variables:

1. Go to https://peppy-cranachan-b96477.netlify.app
2. Try to sign up with a test email
3. Should work without "Failed to fetch" error
4. Check browser console for any remaining errors

## 🚨 Common Issues

### Issue: Still getting "Failed to fetch"
**Solution**: 
- Check all environment variables are set correctly
- Ensure no typos in variable names
- Verify Supabase project is active
- Check browser console for specific error messages

### Issue: "Invalid API key"
**Solution**:
- Verify you're using LIVE mode keys from Stripe
- Check Supabase anon key is correct
- Ensure no extra spaces in environment variables

### Issue: Environment variables not updating
**Solution**:
- Clear Netlify build cache
- Trigger a fresh deploy
- Check variable names match exactly (case-sensitive)

## ✅ Success Checklist

- [ ] Supabase URL and anon key set
- [ ] Stripe publishable key set  
- [ ] Price IDs configured
- [ ] Domain URL set
- [ ] Site redeployed
- [ ] Sign up form works
- [ ] No console errors

Once these are set, your CSVDROP will be fully functional! 🎉

---

**Need help?** Check the browser console (F12) for specific error messages.