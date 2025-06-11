# 📊 CSVDROP - Professional CSV File Consolidator

A modern, professional SaaS application for CSV file consolidation and processing. Upload multiple CSV files, configure consolidation settings, and download merged datasets with advanced features like smart data point mapping and deduplication.

![CSVDROP Screenshot](public/Screenshot%202025-06-10%20at%2010.53.51%20PM.png)

## 🚀 Features

### Core Functionality
- **Multi-file Upload**: Upload up to 3 CSV files simultaneously (max 50MB each)
- **Smart Consolidation**: Merge, union, or intersect data with intelligent column alignment
- **Data Point Mapping**: Automatically detect and map similar columns across files
- **Advanced Deduplication**: Remove duplicate rows with customizable options
- **Real-time Processing**: Client-side processing for maximum security and speed

### User Experience
- **Professional UI/UX**: Beautiful, responsive design with smooth animations
- **User Authentication**: Secure email/password authentication with verification
- **KYC Verification**: Identity verification for secure file processing
- **Subscription Management**: Freemium model with Pro and single-purchase options
- **Download History**: Track all your file processing activities

### Technical Features
- **Secure Processing**: All CSV processing happens client-side
- **Payment Integration**: Stripe integration for subscriptions and one-time purchases
- **Real-time Updates**: Webhook-driven subscription management
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Vite** for build tooling

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** with Row Level Security (RLS)
- **Supabase Edge Functions** (Deno runtime)
- **Stripe** for payment processing

### Infrastructure
- **Netlify** for frontend hosting
- **Supabase** for backend services
- **Stripe** for payment infrastructure

## 🏗️ Architecture

```
Frontend (React/TypeScript)
├── Authentication & User Management
├── CSV Processing Engine
├── Payment Integration
├── Dashboard & Analytics
└── Responsive UI Components

Backend (Supabase)
├── PostgreSQL Database
├── Edge Functions (Deno)
├── Authentication Service
├── Real-time Subscriptions
└── Webhook Handlers

External Services
├── Stripe (Payments)
├── Netlify (Hosting)
└── Email (SMTP)
```

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Stripe account (for payments)
- Netlify account (for deployment)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/imsoari/csvdrop.git
cd csvdrop
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.production .env

# Update with your credentials:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_PRO_PRICE_ID=your_pro_price_id
VITE_STRIPE_SINGLE_PRICE_ID=your_single_price_id
```

### 3. Database Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Deploy edge functions
supabase functions deploy --no-verify-jwt
```

### 4. Development
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## 🗄️ Database Schema

### Tables
- **user_profiles**: User information and KYC status
- **subscriptions**: Subscription management and usage tracking
- **download_history**: Complete download audit trail

### Security
- Row Level Security (RLS) enabled on all tables
- User-specific data access policies
- Service role access for webhooks

## 💳 Payment Integration

### Subscription Plans
- **Free**: 1 download limit
- **Pro**: $9.99/month - Unlimited downloads
- **Single**: $2.99 - One-time download

### Stripe Configuration
- Secure checkout sessions
- Webhook-driven subscription updates
- Customer portal for self-service
- Automatic billing and renewals

## 🔧 Configuration Files

### Key Files
- `supabase/migrations/`: Database schema and migrations
- `supabase/functions/`: Edge functions for API endpoints
- `src/utils/csvProcessor.ts`: Core CSV processing logic
- `src/hooks/`: React hooks for state management
- `src/components/`: Reusable UI components

### Environment Variables
See `.env.production` for complete configuration template.

## 🚀 Deployment

### Frontend (Netlify)
```bash
# Build and deploy
npm run build
netlify deploy --prod
```

### Backend (Supabase)
```bash
# Deploy functions and migrations
supabase db push
supabase functions deploy --no-verify-jwt
```

## 📊 Features in Detail

### CSV Processing Engine
- **Smart Parsing**: Handles various CSV formats and encodings
- **Column Alignment**: Intelligent header matching and alignment
- **Data Validation**: Comprehensive file and data validation
- **Memory Efficient**: Optimized for large file processing

### User Management
- **Authentication**: Email/password with verification
- **KYC Process**: Identity verification workflow
- **Profile Management**: User dashboard and settings
- **Session Management**: Secure JWT-based sessions

### Payment System
- **Stripe Integration**: Secure payment processing
- **Subscription Management**: Automated billing and renewals
- **Usage Tracking**: Download limits and usage analytics
- **Customer Portal**: Self-service billing management

## 🔒 Security

### Data Protection
- **Client-side Processing**: CSV files never leave the browser
- **Encryption**: All data encrypted in transit and at rest
- **RLS Policies**: Database-level security enforcement
- **Input Validation**: Comprehensive sanitization

### Authentication Security
- **JWT Tokens**: Secure session management
- **Email Verification**: Required account activation
- **KYC Verification**: Identity validation for file access
- **Rate Limiting**: API abuse prevention

## 📈 Analytics & Monitoring

### Built-in Analytics
- **User Behavior**: File upload and processing patterns
- **Conversion Tracking**: Free to paid conversion metrics
- **Error Monitoring**: Comprehensive error tracking
- **Performance Metrics**: Processing speed and efficiency

### Business Metrics
- **Revenue Tracking**: Subscription and one-time payment analytics
- **User Engagement**: Dashboard usage and feature adoption
- **File Processing**: Volume and success rate metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Setup Guide](SUPABASE_SETUP.md)
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
- [Environment Setup](ENVIRONMENT_SETUP.md)

### Contact
- **Email**: support@csvdrop.com
- **Issues**: [GitHub Issues](https://github.com/imsoari/csvdrop/issues)
- **Discussions**: [GitHub Discussions](https://github.com/imsoari/csvdrop/discussions)

## 🎯 Roadmap

### Upcoming Features
- [ ] API Access for developers
- [ ] Bulk file processing
- [ ] Advanced data visualization
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Enterprise SSO integration

### Performance Improvements
- [ ] Web Workers for background processing
- [ ] Progressive file loading
- [ ] Advanced caching strategies
- [ ] CDN integration for assets

---

**Built with ❤️ for data professionals who need reliable CSV consolidation tools.**

## 🏆 Production Ready

This application is production-ready with:
- ✅ Complete authentication system
- ✅ Full payment integration
- ✅ Advanced CSV processing
- ✅ User dashboard and analytics
- ✅ Subscription management
- ✅ Professional UI/UX
- ✅ Comprehensive error handling
- ✅ Security best practices
- ✅ Responsive design
- ✅ Performance optimization

Ready to process millions of CSV rows and generate revenue from day one! 🚀