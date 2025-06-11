import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useSubscription } from './hooks/useSubscription';
import { analytics } from './lib/analytics';
import useMacSounds from './hooks/useMacSounds';
import './styles/macintosh.css';

// Components
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

// Macintosh Theme Components
import MacLandingPage from './components/MacLandingPage';
import MacUserDashboard from './components/MacUserDashboard';
import MacAuthModal from './components/MacAuthModal';
import MacOnboardingModal from './components/MacOnboardingModal';
import MacKYCModal from './components/MacKYCModal';
import MacPaymentModal from './components/MacPaymentModal';
import MacDownloadTicket from './components/MacDownloadTicket';

function App() {
  // Auth and user state
  const { user, loading: authLoading } = useAuth();
  const { profile, createProfile } = useProfile();
  const { subscription } = useSubscription();

  // Mac sounds
  const { 
    enabled: soundEnabled, 
    toggleSound, 
    playStartup, 
    playClick, 
    playError, 
    playSuccess, 
    playDisk 
  } = useMacSounds(true);
  
  // Play startup sound on mount
  useEffect(() => {
    // Small delay to ensure audio context is ready
    const timer = setTimeout(() => {
      playStartup();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [playStartup]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Download state
  const [showDownloadTicket, setShowDownloadTicket] = useState(false);
  const [downloadTicketData, setDownloadTicketData] = useState<{
    fileName: string;
    rowCount: number;
    columnCount: number;
    downloadType: 'free' | 'pro' | 'single';
    ticketNumber: string;
  } | null>(null);

  // Check for URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const showAuth = urlParams.get('auth');
    const showOnboarding = urlParams.get('onboarding');
    const showKYC = urlParams.get('kyc');
    const showPayment = urlParams.get('payment');
    const upgrade = urlParams.get('upgrade');
    
    if (showAuth === 'true') {
      setShowAuthModal(true);
    }
    
    if (showOnboarding === 'true') {
      setShowOnboardingModal(true);
    }
    
    if (showKYC === 'true') {
      setShowKYCModal(true);
    }
    
    if (showPayment === 'true') {
      setShowPaymentModal(true);
    }
    
    if (upgrade === 'true' && user) {
      setShowPaymentModal(true);
    }
    
    // Track page view
    analytics.track('Page View', { path: window.location.pathname });
  }, [user]);

  // Handle user authentication state changes
  useEffect(() => {
    if (!authLoading && user && !profile) {
      // User is authenticated but no profile exists - check if they need onboarding
      const urlParams = new URLSearchParams(window.location.search);
      const fromSignup = urlParams.get('signup') === 'true';
      
      if (fromSignup) {
        setShowOnboardingModal(true);
      } else {
        // Existing user without profile - just show KYC
        setShowKYCModal(true);
      }
    }
  }, [user, profile, authLoading]);

  // Check if user needs KYC verification
  const needsKYCVerification = useMemo(() => {
    return (
      (subscription?.type === 'pro' || subscription?.type === 'single') && 
      !profile?.kyc_verified
    );
  }, [subscription, profile]);

  // Track when user changes subscription type
  useEffect(() => {
    if (subscription?.type && subscription.type !== 'free') {
      analytics.track('Subscription Changed', { type: subscription.type });
    }
  }, [subscription?.type]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    playSuccess();
    
    // Check if user needs onboarding
    if (user && !profile) {
      setShowOnboardingModal(true);
    }
    
    // Track authentication event
    analytics.track('User Authenticated');
  };

  const handleOnboardingComplete = async (kycData?: { firstName: string; lastName: string; email: string }) => {
    setShowOnboardingModal(false);
    playSuccess();
    
    // Create or update profile with onboarding data
    if (kycData) {
      await createProfile({
        firstName: kycData.firstName,
        lastName: kycData.lastName,
        email: kycData.email,
        kycVerified: false,
        hasSeenOnboarding: true
      });
      
      // Track onboarding completion
      analytics.track('Onboarding Completed', kycData);
    }
    
    // Check if user needs KYC verification
    if (needsKYCVerification) {
      setShowKYCModal(true);
    }
  };

  const handleKYCComplete = async (kycData: { firstName: string; lastName: string; email: string }) => {
    setShowKYCModal(false);
    playSuccess();
    
    // Create or update profile with KYC data
    await createProfile({
      firstName: kycData.firstName,
      lastName: kycData.lastName,
      email: kycData.email,
      kycVerified: true,
      hasSeenOnboarding: profile?.has_seen_onboarding || true
    });
    
    // Track KYC completion
    analytics.track('KYC Verification Completed', kycData);
  };

  const handlePaymentSuccess = (data: any) => {
    setShowPaymentModal(false);
    playSuccess();
    
    // Track payment success
    analytics.track('Payment Successful', data);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen mac-loading-container">
        <div className="mac-loading">
          <div className="mac-loading-icon"></div>
          <p className="mac-loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  // Determine which page to show
  const shouldShowDashboard = user && profile;  // Allow access with just a profile, KYC not required

  return (
    <Router>
      <div className="min-h-screen mac-theme">
        <Routes>
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/" element={
            shouldShowDashboard ? (
              <MacUserDashboard 
                onShowPayment={() => {
                  setShowPaymentModal(true);
                  playClick();
                }}
                onShowDownloadTicket={(data) => {
                  setDownloadTicketData(data);
                  setShowDownloadTicket(true);
                  playDisk();
                }}
              />
            ) : (
              <MacLandingPage 
                onShowAuth={() => {
                  setShowAuthModal(true);
                  playClick();
                }}
                onShowPayment={() => {
                  setShowPaymentModal(true);
                  playClick();
                }}
              />
            )
          } />
        </Routes>

        {/* Global Modals */}
        <MacAuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            playClick();
          }}
          onSuccess={handleAuthSuccess}
          playSuccess={playSuccess}
          playError={playError}
          playClick={playClick}
        />

        <MacOnboardingModal
          isOpen={showOnboardingModal}
          onClose={() => {
            setShowOnboardingModal(false);
            playClick();
          }}
          onComplete={handleOnboardingComplete}
          userEmail={user?.email}
          userName={profile?.first_name}
          playClick={playClick}
        />

        {/* Only show KYC modal for users who need verification and don't have a profile yet */}
        <MacKYCModal
          isOpen={showKYCModal}
          onClose={() => {
            setShowKYCModal(false);
            playClick();
          }}
          onKYCComplete={handleKYCComplete}
          userType={subscription?.type || 'free'}
          playClick={playClick}
        />

        <MacPaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            playClick();
          }}
          onPaymentSuccess={handlePaymentSuccess}
          downloadCount={subscription?.download_count || 0}
          userEmail={user?.email}
          userName={profile?.first_name}
          playClick={playClick}
          playSuccess={playSuccess}
        />

        <MacDownloadTicket
          isOpen={showDownloadTicket}
          onClose={() => {
            setShowDownloadTicket(false);
            setDownloadTicketData(null);
            playClick();
          }}
          downloadType={downloadTicketData?.downloadType || 'free'}
          ticketNumber={downloadTicketData?.ticketNumber || ''}
          playClick={playClick}
          playDisk={playDisk}
        />
        
        {/* Sound Toggle Button */}
        <button 
          className="mac-sound-control"
          onClick={() => {
            toggleSound();
            playClick();
          }}
          aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          <span className={`mac-sound-icon ${soundEnabled ? 'mac-sound-on' : 'mac-sound-off'}`}></span>
          {soundEnabled ? "Sound On" : "Sound Off"}
        </button>
      </div>
    </Router>
  );
}

export default App;