import React from 'react';
import '../styles/macintosh.css';

interface MacOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  userName?: string;
  playClick?: () => void;
}

const MacOnboardingModal: React.FC<MacOnboardingModalProps> = ({ 
  isOpen, 
  onClose, 
  onComplete,
  userName,
  playClick
}) => {
  if (!isOpen) return null;
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
    onClose();
    playClick?.();
  };
  
  return (
    <div className="mac-modal-overlay">
      <div className="mac-modal">
        <div className="mac-modal-title">
          Welcome to CSV DROP
        </div>
        <div className="mac-modal-content">
          <div className="flex items-center mb-6">
            <div className="mac-icon mac-icon-computer w-12 h-12 mr-4"></div>
            <h2 className="text-lg font-bold">Welcome, {userName || 'User'}!</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-center mb-4">
              You're all set! Start uploading and processing your CSV files.
            </p>
            
            <div className="mac-ai-assistant p-4 mt-6">
              <div className="flex items-center mb-2">
                <div className="mac-icon mac-icon-ai w-8 h-8 mr-2"></div>
                <h3 className="font-bold">CSV Processing Made Easy</h3>
              </div>
              <p className="mac-ai-text">
                Upload up to 3 CSV files, merge them intelligently, and download your consolidated data. 
                Get started with our free tier or upgrade for unlimited processing!
              </p>
            </div>
          </div>
        </div>
        <div className="mac-modal-actions">
          <button 
            className="mac-button"
            onClick={handleComplete}
          >
            Get Started
          </button>
          
          <button 
            className="mac-button"
            onClick={() => {
              onClose();
              playClick?.();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MacOnboardingModal;
