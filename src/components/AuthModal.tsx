import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (signupData?: { firstName: string; lastName: string; email: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (mode !== 'reset') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters';
      }
    }

    if (mode === 'signup') {
      if (!formData.firstName || formData.firstName.trim().length === 0) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName || formData.lastName.trim().length === 0) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required for password reset' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrors({ general: error.message });
        return;
      }

      setResetEmailSent(true);
    } catch {
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'reset') {
      await handlePasswordReset();
      return;
    }
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (mode === 'signin') {
        const { error } = await login(formData.email, formData.password);
        if (error) {
          setErrors({ general: error.message });
          return;
        }
        onSuccess();
      } else {
        const { error } = await register(formData.email, formData.password);
        if (error) {
          setErrors({ general: error.message });
          return;
        }
        // Pass signup data to parent component
        onSuccess({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim()
        });
      }
      
      onClose();
    } catch {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setMode(newMode);
    setErrors({});
    setResetEmailSent(false);
    setFormData({
      email: formData.email, // Keep email when switching modes
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    });
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'reset': return 'Reset Password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signin': return 'Sign in to your account';
      case 'signup': return 'Join CSVDROP today';
      case 'reset': return 'Enter your email to reset password';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30"
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 20px 40px rgba(0,0,0,0.15)'
           }}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/30 bg-white/30 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-csv-gradient rounded-2xl flex items-center justify-center shadow-lg">
                {mode === 'reset' ? <RefreshCw className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-2xl font-monument font-black text-slate-900">{getTitle()}</h2>
                <p className="text-slate-600 text-sm font-light">{getSubtitle()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-xl transition-all duration-300"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message for Password Reset */}
          {resetEmailSent && (
            <div className="mb-6 p-4 bg-emerald-50/60 backdrop-blur-xl rounded-2xl border border-emerald-200/50"
                 style={{
                   background: 'linear-gradient(135deg, rgba(236,253,245,0.6) 0%, rgba(209,250,229,0.3) 100%)',
                   boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 16px rgba(16,185,129,0.08)'
                 }}>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">Reset Email Sent!</p>
                  <p className="text-sm text-emerald-700 font-light">Check your email for password reset instructions.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50/60 backdrop-blur-xl rounded-2xl border border-red-200/50"
                 style={{
                   background: 'linear-gradient(135deg, rgba(254,242,242,0.6) 0%, rgba(254,226,226,0.3) 100%)',
                   boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 16px rgba(239,68,68,0.08)'
                 }}>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700 font-light">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/60 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-csv-orange-500 transition-all duration-300 ${
                      errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-white/30 focus:border-csv-orange-500'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/60 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-csv-orange-500 transition-all duration-300 ${
                      errors.lastName ? 'border-red-300 focus:border-red-500' : 'border-white/30 focus:border-csv-orange-500'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 bg-white/60 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-csv-orange-500 transition-all duration-300 ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-white/30 focus:border-csv-orange-500'
                }`}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-white/60 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-csv-orange-500 transition-all duration-300 ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-white/30 focus:border-csv-orange-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-csv-orange-400 hover:text-csv-orange-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
                {mode === 'signup' && (
                  <p className="mt-1 text-xs text-slate-500 font-light">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-white/60 backdrop-blur-xl border rounded-xl focus:ring-2 focus:ring-csv-orange-500 transition-all duration-300 ${
                      errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-white/30 focus:border-csv-orange-500'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-csv-orange-400 hover:text-csv-orange-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || resetEmailSent}
              className="w-full py-4 bg-csv-gradient text-white rounded-2xl font-medium text-lg hover:bg-csv-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                  {mode === 'signin' ? 'Signing In...' : mode === 'signup' ? 'Creating Account...' : 'Sending Reset Email...'}
                </>
              ) : resetEmailSent ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Email Sent
                </>
              ) : (
                <>
                  {mode === 'reset' ? <RefreshCw className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                  {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
                </>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 space-y-3 text-center">
            {mode === 'signin' && (
              <>
                <button
                  onClick={() => switchMode('reset')}
                  className="text-slate-600 hover:text-csv-orange-500 font-medium transition-colors duration-300 text-sm"
                >
                  Forgot your password?
                </button>
                <p className="text-slate-600 font-light">
                  Don't have an account?
                  <button
                    onClick={() => switchMode('signup')}
                    className="ml-2 text-slate-800 hover:text-csv-orange-600 font-medium transition-colors duration-300"
                  >
                    Sign Up
                  </button>
                </p>
              </>
            )}

            {mode === 'signup' && (
              <p className="text-slate-600 font-light">
                Already have an account?
                <button
                  onClick={() => switchMode('signin')}
                  className="ml-2 text-slate-800 hover:text-csv-orange-600 font-medium transition-colors duration-300"
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === 'reset' && (
              <p className="text-slate-600 font-light">
                Remember your password?
                <button
                  onClick={() => switchMode('signin')}
                  className="ml-2 text-slate-800 hover:text-csv-orange-600 font-medium transition-colors duration-300"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 font-light">
              🔒 Your data is encrypted and secure • We never share your information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;