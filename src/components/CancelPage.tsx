import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';

const CancelPage: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-2xl shadow-2xl border border-white/30 overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
             boxShadow: '0 40px 80px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)'
           }}>
        
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <X className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Canceled</h1>
            <p className="text-orange-100 text-lg">No charges were made to your account</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your payment was canceled
            </h2>
            
            <p className="text-gray-600 text-lg mb-6">
              Don't worry! No charges were made to your payment method. 
              You can try again anytime or continue using CSVDROP with the free plan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
                <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Try Again</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ready to upgrade? You can try the payment process again.
                </p>
                <button
                  onClick={() => navigate('/?upgrade=true')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
                >
                  Upgrade Now
                </button>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/50">
                <HelpCircle className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Having trouble with payment? We're here to help.
                </p>
                <button
                  onClick={() => window.open('mailto:support@csvdrop.com', '_blank')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl font-bold text-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <ArrowLeft className="w-6 h-6" />
              Continue with Free Plan
            </button>
            
            <p className="text-sm text-gray-500">
              Redirecting automatically in {countdown} seconds...
            </p>
          </div>

          {/* Free Plan Benefits */}
          <div className="mt-8 p-4 bg-gray-50/80 rounded-2xl border border-gray-200/50">
            <h4 className="font-semibold text-gray-900 mb-2">Free Plan Includes:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 1 free CSV download</li>
              <li>• All consolidation features</li>
              <li>• No credit card required</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;