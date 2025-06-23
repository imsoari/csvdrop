import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/macintosh.css';

interface MacAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MacAuthModal: React.FC<MacAuthModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const { login, register, user } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Close modal if user is already authenticated
  useEffect(() => {
    if (user) {
      setSuccessMessage('Successfully authenticated!');
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 1500);
    }
  }, [user, onClose]);

  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    // Reset error state
    setError('');
    setLoading(true);
    
    try {
      if (isSignIn) {
        await login(email, password);
        setSuccessMessage('Welcome back!');
      } else {
        await register(email, password);
        setSuccessMessage('Account created successfully! Welcome to CSVDROP!');
      }
      
      // Show success message briefly before closing
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
        setEmail('');
        setPassword('');
      }, 1500);
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      
      // Simple, user-friendly error messages
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('wrong')) {
        setError(isSignIn ? 'Incorrect email or password.' : 'Please check your email and password.');
      } else if (errorMessage.toLowerCase().includes('exist')) {
        setError('This email is already registered. Try signing in instead.');
      } else if (errorMessage.toLowerCase().includes('network')) {
        setError('Connection error. Please try again.');
      } else {
        setError(isSignIn ? 'Sign in failed. Please try again.' : 'Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
    setError('');
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
