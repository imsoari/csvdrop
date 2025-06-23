import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface StreamlinedOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  playClick?: () => void;
  playSuccess?: () => void;
  playError?: () => void;
}

const StreamlinedOnboarding: React.FC<StreamlinedOnboardingProps> = ({
  isOpen,
  onClose,
  onComplete,
  playClick,
  playSuccess,
  playError
}) => {
  const { login, register } = useAuth();
  const [step, setStep] = useState<'welcome' | 'auth' | 'demo'>('welcome');
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTryDemo = () => {
    playClick?.();
    setStep('demo');
    // Allow users to try the app without auth
    setTimeout(() => {
      playSuccess?.();
      onComplete();
    }, 1000);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await register(email, password);
        playSuccess?.();
      } else {
        await login(email, password);
        playSuccess?.();
      }
      onComplete();
    } catch (err: any) {
      playError?.();
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">🚀</div>
      <h2 className="text-3xl font-bold text-white mb-4">Welcome to CSV DROP!</h2>
      <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
        Transform your CSV files with powerful tools. Ready to get started?
      </p>
      
      <div className="space-y-4">
        <button
          onClick={handleTryDemo}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg"
        >
          🎯 Try Free Demo (No Signup)
        </button>
        
        <button
          onClick={() => {
            playClick?.();
            setStep('auth');
          }}
          className="w-full bg-transparent border-2 border-cyan-500 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg"
        >
          📧 Sign Up for Full Access
        </button>
      </div>
      
      <div className="text-sm text-gray-400 mt-4">
        Demo: Process 3 files • Full access: Unlimited processing + save/export
      </div>
    </div>
  );

  const renderAuthStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {isSignUp ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p className="text-gray-300">
          {isSignUp ? 'Get unlimited CSV processing power' : 'Sign in to continue your work'}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleAuthSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/50 border border-gray-600 text-white p-3 rounded-lg focus:border-cyan-500 focus:outline-none"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/50 border border-gray-600 text-white p-3 rounded-lg focus:border-cyan-500 focus:outline-none"
            placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
            minLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg"
        >
          {loading ? '...' : (isSignUp ? '🚀 Create Account' : '🎯 Sign In')}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}
          className="text-cyan-300 hover:text-cyan-200 underline"
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={() => setStep('welcome')}
          className="text-gray-400 hover:text-gray-300 underline text-sm"
        >
          ← Back to options
        </button>
      </div>
    </div>
  );

  const renderDemoStep = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">⚡</div>
      <h2 className="text-3xl font-bold text-white mb-4">Demo Mode Activated!</h2>
      <p className="text-gray-300 text-lg mb-8">
        You can now process up to 3 CSV files. Ready to dive in?
      </p>
      
      <div className="bg-cyan-500/20 border border-cyan-500 p-4 rounded-lg mb-6">
        <p className="text-cyan-300 text-sm">
          💡 <strong>Pro Tip:</strong> Sign up anytime to get unlimited processing + save/export features
        </p>
      </div>
      
      <button
        onClick={() => {
          playClick?.();
          onComplete();
        }}
        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg"
      >
        🎯 Start Processing CSV Files
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600 rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-cyan-400 font-bold">CSV DROP</div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {step === 'welcome' && renderWelcomeStep()}
        {step === 'auth' && renderAuthStep()}
        {step === 'demo' && renderDemoStep()}
      </div>
    </div>
  );
};

export default StreamlinedOnboarding;
