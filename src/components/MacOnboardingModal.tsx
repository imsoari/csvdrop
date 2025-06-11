import React, { useState } from 'react';
import '../styles/macintosh.css';

interface MacOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (data: any) => void;
  userEmail?: string;
  userName?: string;
  playClick?: () => void;
}

const MacOnboardingModal: React.FC<MacOnboardingModalProps> = ({ 
  isOpen, 
  onClose, 
  onComplete,
  userEmail,
  userName,
  playClick
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: userName || '',
    lastName: '',
    company: '',
    jobTitle: '',
    usageType: 'personal'
  });
  
  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      playClick?.();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      playClick?.();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onComplete) {
      onComplete(formData);
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
            <h2 className="text-lg font-bold">Let's get you set up</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold mb-2">Step 1: Basic Information</h3>
                
                <div className="mb-4">
                  <label className="block mb-1">First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    className="mac-input w-full"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    className="mac-input w-full"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">Email:</label>
                  <input
                    type="email"
                    className="mac-input w-full"
                    value={userEmail}
                    disabled
                  />
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-bold mb-2">Step 2: Professional Information</h3>
                
                <div className="mb-4">
                  <label className="block mb-1">Company (Optional):</label>
                  <input
                    type="text"
                    name="company"
                    className="mac-input w-full"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">Job Title (Optional):</label>
                  <input
                    type="text"
                    name="jobTitle"
                    className="mac-input w-full"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-bold mb-2">Step 3: Usage Information</h3>
                
                <div className="mb-4">
                  <label className="block mb-1">How will you use CSV DROP?</label>
                  <select
                    name="usageType"
                    className="mac-select w-full"
                    value={formData.usageType}
                    onChange={handleChange}
                  >
                    <option value="personal">Personal Use</option>
                    <option value="business">Business Use</option>
                    <option value="education">Educational Use</option>
                    <option value="research">Research</option>
                  </select>
                </div>
                
                <div className="mac-ai-assistant p-4 mt-6">
                  <div className="flex items-center mb-2">
                    <div className="mac-icon mac-icon-ai w-8 h-8 mr-2"></div>
                    <h3 className="font-bold">AI Assistant</h3>
                  </div>
                  <p className="mac-ai-text">
                    Thank you for providing your information! I'm here to help you process and analyze your CSV files. Feel free to ask me any questions about data processing.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
        <div className="mac-modal-actions">
          {step > 1 && (
            <button 
              className="mac-button"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button 
              className="mac-button"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button 
              className="mac-button"
              onClick={handleSubmit}
            >
              Complete
            </button>
          )}
          
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

export default MacOnboardingModal;
