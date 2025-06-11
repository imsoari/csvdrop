import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/macintosh.css';

interface MacAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  playSuccess?: () => void;
  playError?: () => void;
  playClick?: () => void;
}

const MacAuthModal: React.FC<MacAuthModalProps> = ({ 
  isOpen, 
  onClose,
  playSuccess,
  playError,
  playClick
}) => {
  const { signIn, signUp, currentUser } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Close modal if user is already authenticated
  useEffect(() => {
    if (currentUser) {
      setSuccessMessage('Successfully authenticated!');
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 1500);
    }
  }, [currentUser, onClose]);

  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      playError?.();
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      playError?.();
      return;
    }
    
    // Reset error state
    setError('');
    setLoading(true);
    
    try {
      if (isSignIn) {
        await signIn(email, password);
        setSuccessMessage('Sign in successful!');
        playSuccess?.();
      } else {
        await signUp(email, password);
        setSuccessMessage('Account created successfully!');
        playSuccess?.();
      }
      
      // Don't close immediately - show success message first
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
        // Reset form after successful authentication
        setEmail('');
        setPassword('');
      }, 1500);
    } catch (err: any) {
      console.error('Authentication error:', err);
      
      // More specific error messages
      if (err.message?.includes('invalid-email')) {
        setError('Invalid email format. Please check and try again.');
      } else if (err.message?.includes('wrong-password') || err.message?.includes('invalid-credential')) {
        setError('Incorrect email or password. Please try again.');
      } else if (err.message?.includes('user-not-found')) {
        setError('Account not found. Please sign up instead.');
      } else if (err.message?.includes('email-already-in-use')) {
        setError('Email is already in use. Try signing in instead.');
      } else if (err.message?.includes('network-request-failed')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Authentication failed. Please check your credentials and try again.');
      }
      
      playError?.();
    } finally {
      setLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
    setError('');
    playClick?.();
  };
  
  return (
    <div className="mac-modal-overlay">
      <div className="mac-modal">
        <div className="mac-modal-title">
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </div>
        <div className="mac-modal-content">
          {error && (
            <div className="flex items-center mb-4 p-2 border-2 border-black bg-white">
              <div className="mac-icon mac-icon-error w-6 h-6 mr-2"></div>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="flex items-center mb-4 p-2 border-2 border-green-600 bg-white">
              <div className="mac-icon mac-icon-success w-6 h-6 mr-2">✓</div>
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                className="mac-input w-full"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                disabled={loading || successMessage !== ''}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block mb-1">Password:</label>
              <input
                type="password"
                className="mac-input w-full"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                disabled={loading || successMessage !== ''}
                required
                minLength={6}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <button
                type="button"
                className="underline text-sm"
                onClick={toggleAuthMode}
                disabled={loading || successMessage !== ''}
              >
                {isSignIn ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
              </button>
              
              <button
                type="submit"
                className={`mac-button ${(loading || successMessage !== '') ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading || successMessage !== ''}
              >
                {loading ? 'Processing...' : isSignIn ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
        <div className="mac-modal-actions">
          <button 
            className="mac-button"
            onClick={() => {
              if (!loading && successMessage === '') {
                onClose();
                playClick?.();
                // Reset form on cancel
                setEmail('');
                setPassword('');
                setError('');
              }
            }}
            disabled={loading || successMessage !== ''}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MacAuthModal;
