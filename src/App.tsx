import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useSubscription } from './hooks/useSubscription';
import { analytics } from './lib/analytics';

// Components
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import AuthModal from './components/AuthModal';
import OnboardingModal from './components/OnboardingModal';
import KYCModal from './components/KYCModal';
import PaymentModal from './components/PaymentModal';
import DownloadTicket from './components/DownloadTicket';
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

function App() {
  // Auth and user state
  const { user, loading: authLoading } = useAuth();
  const { profile, createProfile } = useProfile();
  const { subscription } = useSubscription();

  // Modal states
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
    const upgrade = urlParams.get('upgrade');
    
    if (upgrade === 'true' && user) {
      setShowPaymentModal(true);
    }
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
  const needsKYCVerification = user && profile && !profile.kyc_verified;

  const handleAuthSuccess = (signupData?: { firstName: string; lastName: string; email: string }) => {
    if (signupData) {
      // New user signup - show onboarding
      setShowOnboardingModal(true);
    }
    // For existing users, profile hook will handle the flow
    setShowAuthModal(false);
  };

  const handleOnboardingComplete = async (kycData?: { firstName: string; lastName: string; email: string }) => {
    setShowOnboardingModal(false);
    
    if (kycData) {
      // Create profile with KYC data
      await createProfile({
        firstName: kycData.firstName,
        lastName: kycData.lastName,
        email: kycData.email,
        kycVerified: true,
        hasSeenOnboarding: true
      });
    }
  };

  const handleKYCComplete = async (kycData: { firstName: string; lastName: string; email: string }) => {
    setShowKYCModal(false);
    
    // Create or update profile with KYC data
    await createProfile({
      firstName: kycData.firstName,
      lastName: kycData.lastName,
      email: kycData.email,
      kycVerified: true,
      hasSeenOnboarding: profile?.has_seen_onboarding || false
    });
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // Subscription will be updated via webhook
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Determine which page to show
  const shouldShowDashboard = user && profile && profile.kyc_verified;

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        <Routes>
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/" element={
            shouldShowDashboard ? (
              <UserDashboard 
                onShowPayment={() => setShowPaymentModal(true)}
                onShowDownloadTicket={(data) => {
                  setDownloadTicketData(data);
                  setShowDownloadTicket(true);
                }}
              />
            ) : (
              <LandingPage 
                onShowAuth={() => setShowAuthModal(true)}
                onShowPayment={() => setShowPaymentModal(true)}
              />
            )
          } />
        </Routes>

        {/* Global Modals */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />

        <OnboardingModal
          isOpen={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
          onComplete={handleOnboardingComplete}
          userEmail={user?.email}
          userName={profile?.first_name}
        />

        {/* Only show KYC modal for users who need verification and don't have a profile yet */}
        <KYCModal
          isOpen={showKYCModal && needsKYCVerification}
          onClose={() => setShowKYCModal(false)}
          onKYCComplete={handleKYCComplete}
          userType={subscription?.type || 'free'}
        />

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          downloadCount={subscription?.download_count || 0}
          userEmail={user?.email}
          userName={profile?.first_name}
        />

        <DownloadTicket
          isVisible={showDownloadTicket}
          onClose={() => setShowDownloadTicket(false)}
          fileName={downloadTicketData?.fileName || ''}
          rowCount={downloadTicketData?.rowCount || 0}
          columnCount={downloadTicketData?.columnCount || 0}
          downloadType={downloadTicketData?.downloadType || 'free'}
          ticketNumber={downloadTicketData?.ticketNumber || ''}
        />
      </div>
    </Router>
  );
}

export default App;