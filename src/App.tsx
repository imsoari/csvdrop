import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import SimpleLanding from './components/SimpleLanding';
import StreamlinedOnboarding from './components/StreamlinedOnboarding';
import MacPaymentModal from './components/MacPaymentModal';
import { useAuth } from './hooks/useAuth';
import useMacSounds from './hooks/useMacSounds';
import { useProfile } from './hooks/useProfile';
import { useSubscription } from './hooks/useSubscription';
import { analytics } from './lib/analytics';
import './App.css';

function App() {
  const { user } = useAuth();
  const { profile, createProfile } = useProfile();
  const { subscription } = useSubscription();
  const { playClick, playSuccess, playError } = useMacSounds();
  
  // Single onboarding modal state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isTrialMode, setIsTrialMode] = useState(false);

  // Track page views
  useEffect(() => {
    analytics.page('App Loaded');
  }, []);

  // Handle subscription changes
  useEffect(() => {
    if (subscription?.type === 'premium') {
      setIsTrialMode(false);
    }
  }, [subscription?.type]);

  const handleOnboardingComplete = async (userChoseDemo = false) => {
    setShowOnboarding(false);
    playSuccess();
    
    if (userChoseDemo) {
      // User chose demo mode - allow limited access
      setIsTrialMode(true);
      await createProfile({ hasSeenOnboarding: true, isTrialUser: true });
      analytics.track('Demo Mode Selected');
    } else {
      // User signed up - full access
      await createProfile({ hasSeenOnboarding: true });
      analytics.track('Onboarding Completed');
    }
  };

  const handlePaymentSuccess = (data: Record<string, unknown>) => {
    setShowPaymentModal(false);
    playSuccess();
    analytics.track('Payment Successful', data);
  };

  // Determine what to show
  const shouldShowDashboard = user || isTrialMode || profile?.hasSeenOnboarding;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              shouldShowDashboard ? (
                <Dashboard 
                  isTrialMode={isTrialMode}
                  onUpgrade={() => setShowPaymentModal(true)}
                  onLogout={() => {
                    setIsTrialMode(false);
                    setShowOnboarding(false);
                  }}
                />
              ) : (
                <SimpleLanding
                  onShowAuth={() => setShowOnboarding(true)}
                  playClick={playClick}
                />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Streamlined Onboarding Modal */}
        <StreamlinedOnboarding
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
          playClick={playClick}
          playSuccess={playSuccess}
          playError={playError}
        />

        {/* Payment Modal */}
        <MacPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          playSuccess={playSuccess}
          playClick={playClick}
        />

        <Toaster />
      </div>
    </Router>
  );
}

export default App;