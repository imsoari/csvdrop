import React, { useState } from 'react';
import { X, FileText, Zap, Crown, ArrowRight, Sparkles, Check, ExternalLink, User, Mail, AlertCircle } from 'lucide-react';
import { useStripe } from '../hooks/useStripe';
import { STRIPE_PRODUCTS } from '../lib/stripe';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (kycData?: { firstName: string; lastName: string; email: string }) => void;
  onPlanSelect?: (plan: 'free' | 'pro') => void;
  userEmail?: string;
  userName?: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  isOpen, 
  onClose, 
  onComplete,
  onPlanSelect,
  userEmail,
  userName
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | null>(null);
  const [kycData, setKycData] = useState({
    firstName: '',
    lastName: '',
    email: userEmail || ''
  });
  const [kycErrors, setKycErrors] = useState<Record<string, string>>({});
  const { createCheckoutSession, loading } = useStripe();

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to CSVDROP",
      description: "Merge multiple CSV files into one organized dataset",
      icon: <FileText className="w-12 h-12 text-white" />,
      gradient: "from-violet-500 to-purple-600"
    },
    {
      title: "Simple 3-Step Process",
      description: "Upload → Configure → Download",
      icon: <Zap className="w-12 h-12 text-white" />,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Choose Your Plan",
      description: "Start free or upgrade for unlimited downloads",
      icon: <Crown className="w-12 h-12 text-white" />,
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Complete Your Profile",
      description: "Quick verification to secure your account",
      icon: <User className="w-12 h-12 text-white" />,
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const validateKYC = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!kycData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (kycData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!kycData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (kycData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!kycData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kycData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setKycErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      // Plan selection step
      if (!selectedPlan) return;
      
      if (selectedPlan === 'pro') {
        try {
          await createCheckoutSession('pro', userEmail, userName);
          // User will be redirected to Stripe
          return;
        } catch (error) {
          console.error('Failed to create checkout session:', error);
          // Fall back to free plan
          setSelectedPlan('free');
        }
      }
      
      // Continue to KYC step
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      // KYC step - validate and complete
      if (!validateKYC()) return;
      
      onComplete({
        firstName: kycData.firstName.trim(),
        lastName: kycData.lastName.trim(),
        email: kycData.email.trim()
      });
      onClose();
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    if (currentStep === 2) {
      // Skip plan selection, default to free
      setSelectedPlan('free');
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  const handlePlanSelect = (plan: 'free' | 'pro') => {
    setSelectedPlan(plan);
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30"
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
             boxShadow: '0 40px 80px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)'
           }}>
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/30 bg-gradient-to-r from-gray-50/80 to-gray-100/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Quick Setup</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-xl transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${steps[currentStep].gradient} rounded-3xl shadow-lg mb-4 sm:mb-6 transform hover:rotate-6 transition-transform duration-300`}>
            {steps[currentStep].icon}
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            {steps[currentStep].title}
          </h3>
          
          <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
            {steps[currentStep].description}
          </p>

          {/* Step-specific content */}
          {currentStep === 2 && (
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {/* Free Plan */}
              <button
                onClick={() => handlePlanSelect('free')}
                className={`w-full p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedPlan === 'free'
                    ? 'border-blue-400 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 shadow-lg'
                    : 'border-gray-200 bg-white/60 hover:border-blue-300'
                }`}
                style={{
                  background: selectedPlan === 'free' 
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                  boxShadow: selectedPlan === 'free'
                    ? '0 15px 35px -5px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.6)'
                    : '0 8px 20px -5px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'
                }}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-base sm:text-lg font-bold text-gray-900">Free Plan</div>
                      <div className="text-xs sm:text-sm text-blue-600 font-medium">Perfect to try it out</div>
                    </div>
                  </div>
                  {selectedPlan === 'free' && (
                    <div className="p-1 bg-blue-500 rounded-full">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-left space-y-1 sm:space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span>1 free download</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span>All consolidation features</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </button>
              
              {/* Pro Plan */}
              <button
                onClick={() => handlePlanSelect('pro')}
                className={`w-full p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] relative ${
                  selectedPlan === 'pro'
                    ? 'border-purple-400 bg-gradient-to-r from-purple-50/80 to-pink-50/80 shadow-lg'
                    : 'border-gray-200 bg-white/60 hover:border-purple-300'
                }`}
                style={{
                  background: selectedPlan === 'pro' 
                    ? 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(168,85,247,0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                  boxShadow: selectedPlan === 'pro'
                    ? '0 15px 35px -5px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.6)'
                    : '0 8px 20px -5px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'
                }}
              >
                <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    RECOMMENDED
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                      <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-base sm:text-lg font-bold text-gray-900">Pro Plan</div>
                      <div className="text-xs sm:text-sm text-purple-600 font-medium">
                        ${formatPrice(STRIPE_PRODUCTS.pro.price)}/{STRIPE_PRODUCTS.pro.interval}
                      </div>
                    </div>
                  </div>
                  {selectedPlan === 'pro' && (
                    <div className="p-1 bg-purple-500 rounded-full">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-left space-y-1 sm:space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                    <span>Unlimited downloads</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                    <span>Priority processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                    <span>Secure Stripe checkout</span>
                  </div>
                </div>
              </button>

              {/* Stripe Notice for Pro Plan */}
              {selectedPlan === 'pro' && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/50"
                     style={{
                       background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)',
                       boxShadow: '0 8px 20px -5px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.6)'
                     }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-blue-800">Secure Stripe Checkout</p>
                      <p className="text-xs text-blue-600">You'll be redirected to complete payment securely</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* KYC Form */}
          {currentStep === 3 && (
            <div className="space-y-4 mb-6 text-left">
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/50 mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Quick Verification Required</p>
                    <p className="text-xs text-blue-600">We need this information to secure your account and enable file processing</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={kycData.firstName}
                    onChange={(e) => setKycData(prev => ({ ...prev, firstName: e.target.value }))}
                    className={`w-full px-3 py-2 bg-white/80 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                      kycErrors.firstName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="John"
                  />
                  {kycErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{kycErrors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={kycData.lastName}
                    onChange={(e) => setKycData(prev => ({ ...prev, lastName: e.target.value }))}
                    className={`w-full px-3 py-2 bg-white/80 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                      kycErrors.lastName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="Doe"
                  />
                  {kycErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{kycErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={kycData.email}
                  onChange={(e) => setKycData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-2 bg-white/80 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    kycErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="john.doe@example.com"
                />
                {kycErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{kycErrors.email}</p>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-2 sm:py-3 px-4 sm:px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              {currentStep === 2 ? 'Use Free Plan' : 'Skip'}
            </button>
            <button
              onClick={handleNext}
              disabled={(currentStep === 2 && !selectedPlan) || loading}
              className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base ${
                (currentStep === 2 && !selectedPlan) || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </>
              ) : (
                <>
                  {selectedPlan === 'pro' ? (
                    <>
                      Start Pro Plan
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;