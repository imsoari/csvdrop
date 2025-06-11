import React from 'react';
import { Crown, Zap, Sparkles, Settings } from 'lucide-react';
import { useStripe } from '../hooks/useStripe';

interface SubscriptionBannerProps {
  userType: 'free' | 'pro' | 'single';
  downloadCount: number;
  onUpgrade: () => void;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ 
  userType, 
  downloadCount, 
  onUpgrade 
}) => {
  const { createPortalSession, loading } = useStripe();

  const handleManageSubscription = async () => {
    try {
      await createPortalSession();
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      // Fallback to upgrade modal
      onUpgrade();
    }
  };

  if (userType === 'pro') {
    return (
      <div className="mb-16">
        <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-2xl rounded-3xl p-12 text-white shadow-2xl border border-purple-400/30 transform hover:scale-[1.02] transition-all duration-500"
             style={{
               background: 'linear-gradient(135deg, rgba(147,51,234,0.3) 0%, rgba(219,39,119,0.3) 100%)',
               boxShadow: '0 25px 50px rgba(147,51,234,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
             }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/30">
                <Crown className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-black flex items-center gap-4 mb-2">
                  PRO SUBSCRIBER
                  <Sparkles className="w-8 h-8" />
                </h3>
                <p className="text-white/80 font-light text-lg">Unlimited downloads • Priority processing</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right bg-white/20 backdrop-blur-2xl rounded-3xl p-8 border border-white/30">
                <div className="text-sm text-white/70 font-light uppercase tracking-wider">This month</div>
                <div className="text-4xl font-black">{downloadCount}</div>
                <div className="text-sm text-white/70 font-light uppercase tracking-wider">downloads</div>
              </div>
              <button
                onClick={handleManageSubscription}
                disabled={loading}
                className="px-8 py-4 bg-white/20 backdrop-blur-2xl hover:bg-white/30 rounded-2xl font-black transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3 disabled:opacity-50 border border-white/30"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Settings className="w-6 h-6" />
                    MANAGE
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userType === 'single') {
    return (
      <div className="mb-16">
        <div className="bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 backdrop-blur-2xl rounded-3xl p-12 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
             style={{
               background: 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(6,182,212,0.3) 100%)',
               boxShadow: '0 25px 50px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
             }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/30">
                <Zap className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-black mb-2">SINGLE DOWNLOAD PURCHASED</h3>
                <p className="text-white/80 font-light text-lg">Ready to download your consolidated CSV</p>
              </div>
            </div>
            <button
              onClick={onUpgrade}
              className="px-8 py-4 bg-white/20 backdrop-blur-2xl hover:bg-white/30 rounded-2xl font-black transition-all duration-300 transform hover:scale-105 shadow-2xl border border-white/30"
            >
              UPGRADE TO PRO
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Free user
  return (
    <div className="mb-16">
      <div className="bg-black/20 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
           style={{
             background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
           }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white mb-2">FREE PLAN</h3>
              <p className="text-white/70 font-light text-lg">
                {downloadCount === 0 ? '1 free download remaining' : 'Free limit reached - upgrade to continue'}
              </p>
            </div>
          </div>
          <button
            onClick={onUpgrade}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-black hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
              boxShadow: '0 10px 30px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            UPGRADE NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;