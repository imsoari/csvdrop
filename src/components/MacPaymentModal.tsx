import React, { useState } from 'react';
import '../styles/macintosh.css';
import { useStripe } from '../hooks/useStripe';
import { StripeProductType } from '../lib/stripe';

interface MacPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (data: any) => void;
  downloadCount?: number;
  userEmail?: string;
  userName?: string;
  playClick?: () => void;
  playSuccess?: () => void;
}

const MacPaymentModal: React.FC<MacPaymentModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userName,
  playClick
}) => {
  const [selectedPlan, setSelectedPlan] = useState<StripeProductType>('pro');
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createCheckoutSession, loading: stripeLoading, error: stripeError } = useStripe();
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playClick) playClick();
    
    setProcessing(true);
    setErrorMessage(null);
    
    try {
      // Create Stripe checkout session
      await createCheckoutSession(
        selectedPlan === 'pro' ? 'pro' : 'single',
        userEmail,
        userName
      );
      
      // Note: createCheckoutSession already redirects to Stripe
      // This point will only be reached if something went wrong with the redirect
      setErrorMessage('Failed to redirect to Stripe checkout. Please try again.');
      setProcessing(false);
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      setProcessing(false);
    }
  };
  
  return (
    <div className="mac-modal-overlay">
      <div className="mac-modal">
        <div className="mac-modal-title">
          Upgrade Your Account
        </div>
        <div className="mac-modal-content">
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">Choose a Plan</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`mac-window cursor-pointer ${selectedPlan === 'single' ? 'border-4' : ''}`}
                    style={{ background: 'linear-gradient(to bottom right, #66FF99, #00FF9F)' }}
                    onClick={() => {
                      setSelectedPlan('single');
                      playClick?.();
                    }}
                  >
                    <div className="mac-window-title">
                      Single Download
                    </div>
                    <div className="mac-window-content p-4">
                      <div className="text-center">
                        <div className="text-xl font-bold">$2.99</div>
                        <ul className="text-sm mt-2 space-y-1 text-left">
                          <li>• One-time purchase</li>
                          <li>• 1 CSV file</li>
                          <li>• Basic AI analysis</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`mac-window cursor-pointer ${selectedPlan === 'pro' ? 'border-4' : ''}`}
                    style={{ background: 'linear-gradient(to bottom right, #66FF99, #00FF9F)' }}
                    onClick={() => {
                      setSelectedPlan('pro');
                      playClick?.();
                    }}
                  >
                    <div className="mac-window-title">
                      Pro Plan
                    </div>
                    <div className="mac-window-content p-4">
                      <div className="text-center">
                        <div className="text-xl font-bold">$9.99/month</div>
                        <ul className="text-sm mt-2 space-y-1 text-left">
                          <li>• Unlimited CSV files</li>
                          <li>• Advanced AI analysis</li>
                          <li>• Email support</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold mb-4">Secure Payment with Stripe</h2>
                
                <div className="mb-8 p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 mr-2">
                      <img src="/stripe-logo.png" alt="Stripe" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-sm">Your payment will be securely processed by Stripe.</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">When you click "Pay Now", you'll be redirected to Stripe's secure payment page to complete your transaction.</p>
                  <p className="text-sm text-gray-600">No credit card information is collected on this site.</p>
                </div>
                
                {(stripeError || errorMessage) && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {stripeError || errorMessage}
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="mac-button mr-2"
                    onClick={() => {
                      if (playClick) playClick();
                      onClose();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="mac-button mac-button-primary"
                    disabled={processing || stripeLoading}
                  >
                    {processing || stripeLoading ? 'Processing...' : `Pay with Stripe $${selectedPlan === 'single' ? '2.99' : '9.99'}`}
                  </button>
                </div>
              </form>
        </div>
      </div>
    </div>
  );
};

export default MacPaymentModal;
