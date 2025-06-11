import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refetch } = useSubscription();
  const [countdown, setCountdown] = useState(10);

  const sessionId = searchParams.get('session_id');
  const success = searchParams.get('success');

  useEffect(() => {
    if (!success || !sessionId) {
      navigate('/');
      return;
    }

    // Refresh subscription data to reflect the new purchase
    if (user) {
      refetch();
    }

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
  }, [success, sessionId, navigate, user, refetch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-2xl shadow-2xl border border-white/30 overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
             boxShadow: '0 40px 80px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)'
           }}>
        
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-emerald-100 text-lg">Thank you for your purchase</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full text-emerald-800 font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Your subscription is now active
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to CSVDROP Pro!
            </h2>
            
            <p className="text-gray-600 text-lg mb-6">
              You now have access to unlimited CSV downloads and priority processing. 
              Start consolidating your data files right away!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
                <Download className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Unlimited Downloads</h3>
                <p className="text-sm text-gray-600">No more limits on your CSV exports</p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50">
                <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Priority Processing</h3>
                <p className="text-sm text-gray-600">Faster file consolidation</p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/50">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Premium Support</h3>
                <p className="text-sm text-gray-600">Get help when you need it</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <ArrowRight className="w-6 h-6" />
              Start Using CSVDROP Pro
            </button>
            
            <p className="text-sm text-gray-500">
              Redirecting automatically in {countdown} seconds...
            </p>
          </div>

          {/* Receipt Info */}
          <div className="mt-8 p-4 bg-gray-50/80 rounded-2xl border border-gray-200/50">
            <p className="text-sm text-gray-600">
              <strong>Session ID:</strong> {sessionId?.slice(0, 20)}...
            </p>
            <p className="text-xs text-gray-500 mt-2">
              A receipt has been sent to your email address. You can manage your subscription anytime from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;