import React, { useState } from 'react';
import { X, CreditCard, Zap, Crown, Check, Sparkles, ExternalLink, AlertCircle } from 'lucide-react';
import { useStripe } from '../hooks/useStripe';
import { STRIPE_PRODUCTS } from '../lib/stripe';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadCount: number;
  userEmail?: string;
  userName?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  downloadCount,
  userEmail,
  userName
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'monthly'>('monthly');
  const { createCheckoutSession, loading, error, clearError } = useStripe();

  if (!isOpen) return null;

  const handlePayment = async (planType: 'single' | 'monthly') => {
    clearError();
    
    try {
      if (planType === 'monthly') {
        await createCheckoutSession('pro', userEmail, userName);
      } else {
        await createCheckoutSession('single', userEmail, userName);
      }
      
      // The user will be redirected to Stripe Checkout
      // Success handling will happen via webhook and URL parameters
      
    } catch (err) {
      console.error('Stripe checkout error:', err);
      // Error is already set by the hook
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30"
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 20px 40px rgba(0,0,0,0.15)'
           }}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/30 bg-white/30 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-light text-slate-900">
                  Choose Your Plan
                </h2>
                <p className="text-slate-600 text-sm font-light">Unlock unlimited CSV downloads</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-xl transition-all duration-300"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/60 backdrop-blur-xl rounded-2xl border border-red-200/50"
                 style={{
                   background: 'linear-gradient(135deg, rgba(254,242,242,0.6) 0%, rgba(254,226,226,0.3) 100%)',
                   boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 16px rgba(239,68,68,0.08)'
                 }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800 mb-1">Payment Error</h4>
                  <p className="text-sm text-red-700 font-light">{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="p-1 hover:bg-red-100 rounded-lg transition-all duration-300"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          )}

          {/* Plan Toggle */}
          <div className="bg-slate-100/60 backdrop-blur-xl rounded-2xl p-2 mb-6 flex border border-white/30"
               style={{
                 background: 'linear-gradient(135deg, rgba(248,250,252,0.6) 0%, rgba(241,245,249,0.3) 100%)',
                 boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 16px rgba(0,0,0,0.06)'
               }}>
            <button
              onClick={() => setSelectedPlan('single')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                selectedPlan === 'single'
                  ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              One-Time
            </button>
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                selectedPlan === 'monthly'
                  ? 'bg-slate-800 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <Crown className="w-4 h-4" />
              Monthly
            </button>
          </div>

          {/* Selected Plan Details */}
          <div className="mb-6">
            {selectedPlan === 'single' ? (
              <div className="bg-emerald-50/60 backdrop-blur-xl rounded-3xl p-6 border border-emerald-200/50"
                   style={{
                     background: 'linear-gradient(135deg, rgba(236,253,245,0.6) 0%, rgba(209,250,229,0.3) 100%)',
                     boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 32px rgba(16,185,129,0.08)'
                   }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-slate-900">{STRIPE_PRODUCTS.single.name}</h3>
                    <p className="text-emerald-700 font-light">Perfect for one-time use</p>
                  </div>
                </div>
                
                <div className="text-3xl font-light text-emerald-600 mb-4">
                  ${formatPrice(STRIPE_PRODUCTS.single.price)}
                </div>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-slate-700 font-light">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>One CSV download</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-700 font-light">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>All features included</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-700 font-light">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>No expiration</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="bg-slate-50/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 relative"
                   style={{
                     background: 'linear-gradient(135deg, rgba(248,250,252,0.6) 0%, rgba(241,245,249,0.3) 100%)',
                     boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.08)'
                   }}>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-slate-800 text-white px-4 py-1 rounded-full text-xs font-medium shadow-lg">
                    BEST VALUE
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-slate-900">{STRIPE_PRODUCTS.pro.name}</h3>
                    <p className="text-slate-700 font-light">For regular users</p>
                  </div>
                </div>
                
                <div className="text-3xl font-light text-slate-800 mb-4">
                  ${formatPrice(STRIPE_PRODUCTS.pro.price)}
                  <span className="text-lg text-slate-600">/{STRIPE_PRODUCTS.pro.interval}</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-slate-700 font-light">
                    <Check className="w-4 h-4 text-slate-600" />
                    <span>Unlimited downloads</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-700 font-light">
                    <Check className="w-4 h-4 text-slate-600" />
                    <span>Priority processing</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-700 font-light">
                    <Check className="w-4 h-4 text-slate-600" />
                    <span>Cancel anytime</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-700 font-light">
                    <Check className="w-4 h-4 text-slate-600" />
                    <span>Secure Stripe checkout</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Payment Button */}
          <button
            onClick={() => handlePayment(selectedPlan)}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
              selectedPlan === 'single'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ${formatPrice(selectedPlan === 'single' ? STRIPE_PRODUCTS.single.price : STRIPE_PRODUCTS.pro.price)}
                {selectedPlan === 'monthly' && `/${STRIPE_PRODUCTS.pro.interval}`}
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Stripe Notice */}
          <div className="mt-4 p-4 bg-blue-50/60 backdrop-blur-xl rounded-2xl border border-blue-200/50"
               style={{
                 background: 'linear-gradient(135deg, rgba(239,246,255,0.6) 0%, rgba(219,234,254,0.3) 100%)',
                 boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 16px rgba(59,130,246,0.08)'
               }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Secure Stripe Checkout</p>
                <p className="text-xs text-blue-600 font-light">You'll be redirected to Stripe's secure payment page</p>
              </div>
            </div>
          </div>

          {/* Usage Info */}
          <div className="mt-6 p-4 bg-slate-50/60 backdrop-blur-xl rounded-2xl border border-slate-200/50"
               style={{
                 background: 'linear-gradient(135deg, rgba(248,250,252,0.6) 0%, rgba(241,245,249,0.3) 100%)',
                 boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 16px rgba(0,0,0,0.06)'
               }}>
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1 font-light">Your current usage</p>
              <p className="font-medium text-slate-900">
                {downloadCount} download{downloadCount !== 1 ? 's' : ''} used
              </p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500 font-light">
              🔒 Secure payment • ⚡ Instant access • 💰 30-day guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;