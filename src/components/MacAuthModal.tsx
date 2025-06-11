import React, { useState } from 'react';
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
  const { signIn, signUp } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isSignIn) {
        await signIn(email, password);
        playSuccess?.();
      } else {
        await signUp(email, password);
        playSuccess?.();
      }
      onClose();
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Authentication failed. Please check your credentials and try again.');
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
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                className="mac-input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block mb-1">Password:</label>
              <input
                type="password"
                className="mac-input w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-between items-center">
              <button
                type="button"
                className="underline text-sm"
                onClick={toggleAuthMode}
              >
                {isSignIn ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
              </button>
              
              <button
                type="submit"
                className="mac-button"
                disabled={loading}
                onClick={() => playClick?.()}
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
              onClose();
              playClick?.();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MacAuthModal;
