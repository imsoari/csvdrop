import React, { useState, useEffect } from 'react';
import { X, Shield, User, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKYCComplete: (data: { firstName: string; lastName: string; email: string }) => void;
  userType: 'free' | 'pro' | 'single';
}

interface KYCFormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const KYCModal: React.FC<KYCModalProps> = ({ 
  isOpen, 
  onClose, 
  onKYCComplete,
  userType 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<KYCFormData>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isFormValidState, setIsFormValidState] = useState(false);

  const validateEmail = (email: string): boolean => {
    // More strict email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    // Additional checks for common invalid patterns
    if (!emailRegex.test(email)) return false;
    
    // Must have at least one dot after @
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const [localPart, domainPart] = parts;
    
    // Local part validation
    if (localPart.length === 0 || localPart.length > 64) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (localPart.includes('..')) return false;
    
    // Domain part validation
    if (domainPart.length === 0 || domainPart.length > 253) return false;
    if (domainPart.startsWith('.') || domainPart.endsWith('.')) return false;
    if (domainPart.includes('..')) return false;
    if (!domainPart.includes('.')) return false;
    
    // Must have valid TLD (at least 2 characters)
    const domainParts = domainPart.split('.');
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) return false;
    
    // Check for common test/invalid domains
    const invalidDomains = [
      'test.com', 'example.com', 'sample.com', 'demo.com',
      'fake.com', 'invalid.com', 'temp.com', 'dummy.com'
    ];
    if (invalidDomains.includes(domainPart.toLowerCase())) return false;
    
    return true;
  };

  const validateName = (name: string): boolean => {
    // Must be at least 2 characters, only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
    const trimmedName = name.trim();
    
    if (!nameRegex.test(trimmedName)) return false;
    
    // Additional validation: no consecutive spaces, no leading/trailing spaces after trim
    if (trimmedName.includes('  ')) return false;
    if (trimmedName !== name.trim()) return false;
    
    // Must contain at least one letter
    if (!/[a-zA-Z]/.test(trimmedName)) return false;
    
    return true;
  };

  const validateField = (field: keyof KYCFormData, value: string): string | undefined => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (!validateName(value)) return 'First name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes';
        break;
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (!validateName(value)) return 'Last name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes';
        break;
      case 'email':
        if (!value.trim()) return 'Email address is required';
        if (!validateEmail(value.trim())) return 'Please enter a valid, legitimate email address';
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    Object.keys(formData).forEach((key) => {
      const field = key as keyof KYCFormData;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    const trimmedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim()
    };

    return !!(
      trimmedData.firstName && 
      trimmedData.lastName && 
      trimmedData.email &&
      validateName(trimmedData.firstName) &&
      validateName(trimmedData.lastName) &&
      validateEmail(trimmedData.email)
    );
  };

  // Update form validation state whenever form data changes
  useEffect(() => {
    const valid = isFormValid();
    setIsFormValidState(valid);
  }, [formData]);

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleInputChange = (field: keyof KYCFormData, value: string) => {
    let processedValue = value;
    
    // Auto-capitalize first letter for name fields
    if (field === 'firstName' || field === 'lastName') {
      // Split by spaces and capitalize each word, but preserve user input during typing
      processedValue = value
        .split(' ')
        .map((word, index) => {
          if (word.length === 0) return word;
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    }
    
    // For email, convert to lowercase
    if (field === 'email') {
      processedValue = value.toLowerCase().trim();
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof KYCFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field on blur
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true
    });

    // Validate the entire form
    if (!validateForm()) {
      return;
    }

    // Double-check form validity
    if (!isFormValidState) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate KYC processing with additional validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Final validation before submission
      const finalData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase()
      };

      // One more validation check
      if (!validateName(finalData.firstName) || 
          !validateName(finalData.lastName) || 
          !validateEmail(finalData.email)) {
        throw new Error('Invalid form data detected');
      }

      onKYCComplete(finalData);
      onClose();
    } catch (error) {
      console.error('KYC submission error:', error);
      setErrors({
        email: 'Verification failed. Please check your information and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: keyof KYCFormData): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30"
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
             boxShadow: '0 40px 80px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)'
           }}>
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/30 bg-csv-orange-500/20 backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-csv-gradient rounded-2xl shadow-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-monument font-black text-gray-900">Identity Verification</h2>
                <p className="text-gray-600 text-xs sm:text-sm">Secure verification required</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-xl transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-csv-gradient rounded-2xl shadow-lg mb-3 sm:mb-4">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-monument font-black text-gray-900 mb-2">
              Tell us about yourself
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              We need legitimate information to verify your identity
            </p>
          </div>

          {/* Notice */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-csv-orange-50/80 rounded-2xl border border-csv-orange-200/50"
               style={{
                 background: 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(234,88,12,0.1) 100%)',
                 boxShadow: '0 8px 20px -5px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.6)'
               }}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-csv-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-csv-orange-800 mb-1 text-sm sm:text-base">Why do we need this?</h4>
                <p className="text-xs sm:text-sm text-csv-orange-700">
                  To ensure secure file processing and comply with data protection regulations, 
                  we require legitimate verification information for all downloads.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/80 border rounded-xl focus:ring-2 focus:ring-csv-orange-500 transition-all duration-300 text-sm sm:text-base ${
                    getFieldError('firstName') 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-csv-orange-500'
                  }`}
                  placeholder="John"
                  maxLength={50}
                />
                {getFieldError('firstName') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError('firstName')}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/80 border rounded-xl focus:ring-2 focus:ring-csv-orange-500 transition-all duration-300 text-sm sm:text-base ${
                    getFieldError('lastName') 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-csv-orange-500'
                  }`}
                  placeholder="Doe"
                  maxLength={50}
                />
                {getFieldError('lastName') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError('lastName')}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/80 border rounded-xl focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                  getFieldError('email') 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : formData.email && validateEmail(formData.email)
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                    : 'border-gray-300 focus:border-csv-orange-500 focus:ring-blue-200'
                }`}
                placeholder="john.doe@example.com"
                maxLength={100}
              />
              {getFieldError('email') && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {getFieldError('email')}
                </p>
              )}
              {formData.email && !getFieldError('email') && validateEmail(formData.email) && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Valid email address
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValidState || isSubmitting}
            className={`w-full mt-6 sm:mt-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3 ${
              !isFormValidState || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-csv-gradient text-white hover:bg-csv-orange-600'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-3 border-white border-t-transparent"></div>
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                Complete Verification
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your information is encrypted and securely stored • We never share your data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCModal;