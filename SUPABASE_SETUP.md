# 🗄️ Supabase Production Setup Guide

## 🎯 Quick Setup Checklist

### 1. Create Production Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create New Project
3. Choose a strong database password
4. Select region closest to your users
5. Wait for project to be ready (~2 minutes)

### 2. Get Environment Variables
1. Go to Settings → API
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon/Public Key** → `VITE_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY` (for edge functions)

### 3. Set Edge Function Environment Variables
**CRITICAL**: Edge functions need their own environment variables set as Supabase secrets:

```bash
# Set required environment variables for edge functions
supabase secrets set SUPABASE_URL=https://your-project-id.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your_supabase_anon_key_here
supabase secrets set STRIPE_SECRET_KEY=sk_live_your_key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

**Note**: Replace `your-project-id` and `your_supabase_anon_key_here` with your actual Supabase project details from step 2.

### 4. Run Database Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Push migrations to production
supabase db push
```

### 5. Deploy Edge Functions
```bash
# Deploy all edge functions (AFTER setting environment variables)
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session  
supabase functions deploy stripe-webhook
supabase functions deploy user-profile
supabase functions deploy subscription
supabase functions deploy download-history
```

## 🚨 Troubleshooting Edge Function Errors

### Error: "Failed to fetch" or "TypeError: Failed to fetch"
This indicates missing environment variables in the edge function runtime.

**Solution:**
1. Verify environment variables are set:
```bash
supabase secrets list
```

2. Set missing variables:
```bash
supabase secrets set SUPABASE_URL=https://your-project-id.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Redeploy all functions:
```bash
supabase functions deploy --no-verify-jwt
```

### Error: "Unauthorized" from edge functions
This indicates the Supabase client cannot authenticate properly.

**Solution:**
1. Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correctly set
2. Verify the anon key has the correct permissions
3. Redeploy the affected functions

## 📧 Email Configuration

### 1. Configure Auth Settings
1. Go to Authentication → Settings
2. **Site URL**: `https://your-domain.com`
3. **Redirect URLs**: 
   - `https://your-domain.com/reset-password`
   - `https://your-domain.com/auth/callback`

### 2. Customize Email Templates

#### Confirm Signup Template
```html
<h2 style="color: #7c3aed;">Welcome to CSVDROP!</h2>
<p>Thanks for signing up! Please confirm your email address to get started with CSV file consolidation.</p>
<div style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold;">
    Confirm Your Account
  </a>
</div>
<p style="color: #6b7280; font-size: 14px;">
  If you didn't create an account, you can safely ignore this email.
</p>
<hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
<p style="color: #9ca3af; font-size: 12px;">
  CSVDROP - Professional CSV File Consolidation<br>
  <a href="https://your-domain.com" style="color: #7c3aed;">your-domain.com</a>
</p>
```

#### Reset Password Template
```html
<h2 style="color: #7c3aed;">Reset Your CSVDROP Password</h2>
<p>We received a request to reset your password for your CSVDROP account.</p>
<div style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold;">
    Reset Your Password
  </a>
</div>
<p style="color: #ef4444; font-size: 14px;">
  This link will expire in 24 hours for security reasons.
</p>
<p style="color: #6b7280; font-size: 14px;">
  If you didn't request this password reset, you can safely ignore this email.
</p>
<hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
<p style="color: #9ca3af; font-size: 12px;">
  CSVDROP - Professional CSV File Consolidation<br>
  <a href="https://your-domain.com" style="color: #7c3aed;">your-domain.com</a>
</p>
```

### 3. Custom Email Domain (Optional)
1. Go to Authentication → Settings → SMTP Settings
2. Configure custom SMTP server
3. Set up DKIM/SPF records for better deliverability

## 🔒 Security Configuration

### 1. Row Level Security (RLS)
All tables already have RLS enabled. Verify policies:

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- View existing policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### 2. API Settings
1. Go to Settings → API
2. **JWT expiry**: 3600 seconds (1 hour)
3. **Enable email confirmations**: Yes
4. **Enable phone confirmations**: No (unless needed)

### 3. Database Backups
1. Go to Settings → Database
2. Enable **Point-in-time Recovery**
3. Set backup retention period (7-30 days recommended)

## 📊 Monitoring & Logs

### 1. Enable Logging
1. Go to Logs → Settings
2. Enable all log types:
   - Database logs
   - API logs
   - Auth logs
   - Function logs

### 2. Set Up Alerts
1. Go to Settings → Alerts
2. Configure alerts for:
   - High error rates
   - Database connection issues
   - Function timeouts
   - Storage limits

## 🚀 Performance Optimization

### 1. Database Indexes
```sql
-- Verify important indexes exist
\d+ user_profiles
\d+ subscriptions  
\d+ download_history

-- Add custom indexes if needed
CREATE INDEX IF NOT EXISTS idx_download_history_created_at_desc 
ON download_history (created_at DESC);
```

### 2. Connection Pooling
1. Go to Settings → Database
2. **Connection pooling mode**: Transaction
3. **Pool size**: 15 (adjust based on usage)

### 3. Edge Functions Optimization
```typescript
// Use connection pooling in functions
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  {
    db: {
      schema: 'public',
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

## 🧪 Testing Production Setup

### 1. Database Connection Test
```bash
# Test database connection
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

### 2. Edge Functions Test
```bash
# Test each function
curl -X POST https://[project-ref].supabase.co/functions/v1/user-profile \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json"
```

### 3. Auth Flow Test
1. Test user registration
2. Check email delivery
3. Verify email confirmation
4. Test password reset

## 🚨 Common Issues & Solutions

### Issue: Edge Functions Not Deploying
**Solution:**
```bash
# Check function logs
supabase functions logs create-checkout-session

# Redeploy with verbose output
supabase functions deploy create-checkout-session --debug
```

### Issue: Email Not Sending
**Solution:**
1. Check SMTP configuration
2. Verify domain DNS settings
3. Check spam folder
4. Review auth logs for errors

### Issue: Database Connection Errors
**Solution:**
1. Check connection string format
2. Verify IP allowlist settings
3. Check connection pool limits
4. Review database logs

### Issue: Edge Functions "Failed to fetch" Error
**Solution:**
1. Verify environment variables are set:
```bash
supabase secrets list
```
2. Set missing variables:
```bash
supabase secrets set SUPABASE_URL=https://your-project-id.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your_supabase_anon_key_here
```
3. Redeploy all functions:
```bash
supabase functions deploy --no-verify-jwt
```

## 📞 Support Resources

### Supabase Support
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase Status](https://status.supabase.com)

### Useful Commands
```bash
# Check project status
supabase status

# View function logs
supabase functions logs [function-name]

# Reset database (DANGER!)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --project-id [project-ref] > types/database.ts

# List all secrets
supabase secrets list

# Set a secret
supabase secrets set KEY=value

# Unset a secret
supabase secrets unset KEY
```

## ✅ Production Readiness Checklist

- [ ] Production project created
- [ ] Environment variables configured
- [ ] **Edge function secrets set (SUPABASE_URL, SUPABASE_ANON_KEY)**
- [ ] Database migrations deployed
- [ ] Edge functions deployed
- [ ] Email templates customized
- [ ] RLS policies verified
- [ ] Backups enabled
- [ ] Monitoring configured
- [ ] Performance optimized
- [ ] Security settings reviewed
- [ ] **Edge functions tested and working**

Your Supabase backend is now production-ready! 🎉