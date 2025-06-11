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
  onPaymentSuccess,
  downloadCount = 0,
  userEmail,
  userName,
  playClick,
  playSuccess
}) => {
  const [selectedPlan, setSelectedPlan] = useState<StripeProductType>('pro');
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const { createCheckoutSession, loading: stripeLoading, error: stripeError } = useStripe();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: ''
  });
  
  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    try {
      // If using PayPal, we'll still use Stripe Checkout which supports PayPal
      await createCheckoutSession(selectedPlan, userEmail, userName);
      
      // Note: We won't actually get here because the user is redirected to Stripe
      // But for completeness and in case the redirect fails
      setSuccess(true);
      playSuccess?.();
      
      if (onPaymentSuccess) {
        onPaymentSuccess({
          plan: selectedPlan,
          paymentMethod,
          email: userEmail
        });
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      console.error('Payment error:', error);
    }
  };
  
  return (
    <div className="mac-modal-overlay">
      <div className="mac-modal">
        <div className="mac-modal-title">
          Upgrade Your Account
        </div>
        <div className="mac-modal-content">
          {success ? (
            <div className="text-center py-6">
              <div className="mac-icon mac-icon-success w-16 h-16 mx-auto mb-4"></div>
              <h2 className="text-lg font-bold mb-2">Payment Successful!</h2>
              <p>Thank you for upgrading your account.</p>
              <p className="text-sm mt-4">You will be redirected shortly...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">Choose a Plan</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`mac-window cursor-pointer ${selectedPlan === 'single' ? 'border-4' : ''}`}
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
                <h2 className="text-lg font-bold mb-2">Payment Information</h2>
                
                <div className="mb-4">
                  <label className="block mb-1">Payment Method:</label>
                  <select
                    name="paymentMethod"
                    className="mac-select w-full"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="creditCard">Credit Card</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
                
                {paymentMethod === 'creditCard' && (
                  <>
                    <div className="mb-4">
                      <label className="block mb-1">Card Number:</label>
                      <input
                        type="text"
                        name="cardNumber"
                        className="mac-input w-full"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block mb-1">Name on Card:</label>
                      <input
                        type="text"
                        name="cardName"
                        className="mac-input w-full"
                        value={formData.cardName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label className="block mb-1">Expiry Date:</label>
                        <input
                          type="text"
                          name="expiry"
                          className="mac-input w-full"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-1">CVC:</label>
                        <input
                          type="text"
                          name="cvc"
                          className="mac-input w-full"
                          placeholder="123"
                          value={formData.cvc}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {paymentMethod === 'paypal' && (
                  <div className="text-center py-4">
                    <p>You will be redirected to PayPal to complete your payment.</p>
                  </div>
                )}
                
                <div className="mac-ai-assistant p-4 mt-6">
                  <div className="flex items-center mb-2">
                    <div className="mac-icon mac-icon-ai w-8 h-8 mr-2"></div>
                    <h3 className="font-bold">AI Assistant</h3>
                  </div>
                  <p className="mac-ai-text">
                    Upgrading your account will give you access to advanced AI features for CSV processing. Your payment will be securely processed by Stripe.
                  </p>
                </div>
                
                {(stripeError || errorMessage) && (
                  <div className="mac-error-box p-3 mt-4 border border-red-500 bg-red-50 text-red-700 rounded">
                    <p className="flex items-center">
                      <span className="mac-icon mac-icon-error w-5 h-5 mr-2"></span>
                      {stripeError || errorMessage}
                    </p>
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {!success && (
          <div className="flex justify-end space-x-2 mt-6">
            <button 
              type="button" 
              className="mac-button" 
              onClick={() => {
                onClose();
                playClick?.();
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="mac-button" 
              disabled={loading || stripeLoading}
              onClick={handleSubmit}
            >
              {loading || stripeLoading ? 'Processing...' : `Pay ${selectedPlan === 'single' ? '$2.99' : '$9.99'}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacPaymentModal;
