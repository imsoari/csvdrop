# 🚨 URGENT: Supabase Setup Required

## Your site is live but needs Supabase configuration!

**Site URL**: https://peppy-cranachan-b96477.netlify.app
**Status**: ❌ Missing Supabase connection

## 🔧 Quick Fix (5 minutes)

### Option 1: Use Existing Supabase Project
If you already have a Supabase project:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:

```bash
# Copy these to Netlify environment variables
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Option 2: Create New Supabase Project
If you need a new project:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Choose organization and name: `csvdrop-production`
4. Set strong database password
5. Wait 2 minutes for setup
6. Go to **Settings** → **API** and copy the values above

## 🗄️ Database Setup

After creating/accessing your project:

### 1. Run Database Migration
```sql
-- Go to SQL Editor in Supabase Dashboard and run this:

-- Create custom types
CREATE TYPE subscription_type AS ENUM ('free', 'pro', 'single');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
CREATE TYPE download_type AS ENUM ('free', 'pro', 'single');

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  kyc_verified boolean DEFAULT false,
  has_seen_onboarding boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type subscription_type NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  download_count integer DEFAULT 0,
  single_download_used boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create download_history table
CREATE TABLE IF NOT EXISTS download_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  row_count integer NOT NULL DEFAULT 0,
  column_count integer NOT NULL DEFAULT 0,
  file_size bigint NOT NULL DEFAULT 0,
  ticket_number text UNIQUE NOT NULL,
  download_type download_type NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for subscriptions
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscription"
  ON subscriptions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create policies for download_history
CREATE POLICY "Users can read own download history"
  ON download_history FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own download history"
  ON download_history FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Service role policies (for webhooks)
CREATE POLICY "Service role can manage all user_profiles"
  ON user_profiles FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage all download_history"
  ON download_history FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_download_history_user_id ON download_history(user_id);
CREATE INDEX IF NOT EXISTS idx_download_history_ticket_number ON download_history(ticket_number);
```

### 2. Configure Authentication
1. Go to **Authentication** → **Settings**
2. Set **Site URL**: `https://peppy-cranachan-b96477.netlify.app`
3. Add **Redirect URLs**:
   - `https://peppy-cranachan-b96477.netlify.app/reset-password`
   - `https://peppy-cranachan-b96477.netlify.app/**`

## 🌐 Add to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Find site: `peppy-cranachan-b96477`
3. **Site settings** → **Environment variables**
4. Add these variables:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
VITE_STRIPE_PRO_PRICE_ID=price_1RYQ6mFCgX2xIDAt1rfMAaFx
VITE_STRIPE_SINGLE_PRICE_ID=price_1RYQxoFCgX2xIDAtcCtuzzAs
VITE_APP_DOMAIN=https://peppy-cranachan-b96477.netlify.app
```

5. **Deploy** → **Trigger deploy**

## ✅ Test Your Setup

After deployment:
1. Visit https://peppy-cranachan-b96477.netlify.app
2. Open browser console (F12)
3. Should see: "✅ Supabase connection successful"
4. Try signing up with a test email
5. Should work without "Failed to fetch" error

## 🚨 If Still Having Issues

Check browser console for specific errors:
- **"Invalid API key"**: Wrong Supabase credentials
- **"Network error"**: Environment variables not set
- **"CORS error"**: Wrong site URL in Supabase settings

Your CSVDROP will be fully functional once Supabase is configured! 🚀