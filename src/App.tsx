import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useSubscription } from './hooks/useSubscription';
import { analytics } from './lib/analytics';
import useMacSounds from './hooks/useMacSounds';
import { setupMobileViewport, isMobileDevice } from './utils/mobileUtils';
import './styles/macintosh.css';
import './styles/mobile-responsive.css'; // Mobile responsive styles

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
  
  // Initialize mobile viewport adaptations
  useEffect(() => {
    // Setup mobile viewport height adjustments
    setupMobileViewport();
    
    // Add any mobile-specific classes to body if needed
    if (isMobileDevice()) {
      document.body.classList.add('mobile-device');
    }
  }, []);

  // Play startup sound on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      playStartup();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [playStartup]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

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
    // KYC removed
    const showPayment = urlParams.get('payment');
    const upgrade = urlParams.get('upgrade');
    
    if (showAuth === 'true') {
      setShowAuthModal(true);
    }
    
    if (showOnboarding === 'true') {
      setShowOnboardingModal(true);
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
      }
    }
  }, [user, profile, authLoading]);



  // Track when user changes subscription type
  useEffect(() => {
    if (subscription?.type && subscription.type !== 'free') {
      analytics.track('Subscription Changed', { type: subscription.type });
    }
  }, [subscription?.type]);

  // Clear localStorage for debugging on app load
  useEffect(() => {
    // Clear any stored profile data that might interfere with landing page
    if (window.location.search.includes('debug=true')) {
      localStorage.clear();
      console.log('Debug mode: localStorage cleared');
    }
  }, []);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    playSuccess();
    
    // Don't automatically show onboarding - let users trigger it from landing page
    
    // Track authentication event
    analytics.track('User Authenticated');
  };

  const handleOnboardingComplete = async () => {
    setShowOnboardingModal(false);
    playSuccess();
    
    // Create or update profile to mark onboarding as complete
    await createProfile({
      hasSeenOnboarding: true
    });
    
    // Track onboarding completion
    analytics.track('Onboarding Completed');
    
    // Show auth modal after onboarding completion
    setShowAuthModal(true);
  };



  const handlePaymentSuccess = (data: Record<string, unknown>) => {
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
  const shouldShowDashboard = (user && profile) || (profile?.has_seen_onboarding && user);  // Only show dashboard if user is authenticated AND has seen onboarding
  
  // Debug logging
  console.log('App state:', { 
    user: !!user, 
    profile: !!profile, 
    hasSeenOnboarding: profile?.has_seen_onboarding,
    shouldShowDashboard 
  });

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
                onShowOnboarding={() => {
                  setShowOnboardingModal(true);
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
            handleAuthSuccess();
          }}
        />

        <MacOnboardingModal
          isOpen={showOnboardingModal}
          onClose={() => {
            setShowOnboardingModal(false);
            playClick();
          }}
          onComplete={handleOnboardingComplete}
          userName={profile?.first_name}
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
          fileName={downloadTicketData?.fileName || ''}
          rowCount={downloadTicketData?.rowCount || 0}
          columnCount={downloadTicketData?.columnCount || 0}
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