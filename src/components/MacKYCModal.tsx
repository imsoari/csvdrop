import React, { useState } from 'react';
import '../styles/macintosh.css';

interface MacKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKYCComplete?: (data: any) => void;
  userType?: string;
  playClick?: () => void;
}

const MacKYCModal: React.FC<MacKYCModalProps> = ({ 
  isOpen, 
  onClose, 
  onKYCComplete,
  userType,
  playClick
}) => {
  const [formData, setFormData] = useState({
    idType: 'passport',
    idNumber: '',
    country: 'US',
    address: '',
    city: '',
    postalCode: '',
    phoneNumber: ''
  });
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNext = () => {
    if (step < 2) {
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onKYCComplete) {
        onKYCComplete(formData);
      }
      setLoading(false);
      onClose();
      playClick?.();
    }, 1500);
  };
  
  return (
    <div className="mac-modal-overlay">
      <div className="mac-modal">
        <div className="mac-modal-title">
          Identity Verification
        </div>
        <div className="mac-modal-content">
          <div className="flex items-center mb-6">
            <div className="mac-icon mac-icon-key w-12 h-12 mr-4"></div>
            <div>
              <h2 className="text-lg font-bold">Verify Your Identity</h2>
              <p className="text-sm">Required for {userType === 'business' ? 'Business' : 'Premium'} accounts</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold mb-2">Step 1: Identification</h3>
                
                <div className="mb-4">
                  <label className="block mb-1">ID Type:</label>
                  <select
                    name="idType"
                    className="mac-select w-full"
                    value={formData.idType}
                    onChange={handleChange}
                    required
                  >
                    <option value="passport">Passport</option>
                    <option value="driverLicense">Driver's License</option>
                    <option value="nationalId">National ID</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">ID Number:</label>
                  <input
                    type="text"
                    name="idNumber"
                    className="mac-input w-full"
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">Country:</label>
                  <select
                    name="country"
                    className="mac-select w-full"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-bold mb-2">Step 2: Contact Information</h3>
                
                <div className="mb-4">
                  <label className="block mb-1">Address:</label>
                  <input
                    type="text"
                    name="address"
                    className="mac-input w-full"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">City:</label>
                  <input
                    type="text"
                    name="city"
                    className="mac-input w-full"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">Postal Code:</label>
                  <input
                    type="text"
                    name="postalCode"
                    className="mac-input w-full"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="mac-input w-full"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
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
              disabled={loading}
            >
              Back
            </button>
          )}
          
          {step < 2 ? (
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
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Complete Verification'}
            </button>
          )}
          
          <button 
            className="mac-button"
            onClick={() => {
              onClose();
              playClick?.();
            }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MacKYCModal;
