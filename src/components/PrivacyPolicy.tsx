import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Database, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/60 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-600 text-sm">How we protect and handle your data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Last Updated */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/50">
              <p className="text-sm text-blue-800 font-medium">
                Last Updated: January 1, 2025
              </p>
            </div>

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-blue-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At CSVDROP ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our CSV file consolidation service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-emerald-600" />
                Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Account Information:</strong> Name, email address, and password</li>
                    <li>• <strong>Identity Verification:</strong> Information provided during KYC verification</li>
                    <li>• <strong>Payment Information:</strong> Billing details processed securely through Stripe</li>
                    <li>• <strong>Communication Data:</strong> Messages you send to our support team</li>
                  </ul>
                </div>

                <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>File Data:</strong> CSV files you upload for processing (temporarily stored)</li>
                    <li>• <strong>Usage Analytics:</strong> How you interact with our service</li>
                    <li>• <strong>Device Information:</strong> Browser type, operating system, IP address</li>
                    <li>• <strong>Download History:</strong> Records of your file downloads and processing activities</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 text-purple-600" />
                How We Use Your Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/50">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Service Provision</h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Process and consolidate your CSV files</li>
                    <li>• Manage your account and subscriptions</li>
                    <li>• Provide customer support</li>
                    <li>• Send service-related notifications</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-2xl border border-emerald-200/50">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-3">Service Improvement</h3>
                  <ul className="space-y-2 text-emerald-800 text-sm">
                    <li>• Analyze usage patterns to improve features</li>
                    <li>• Monitor service performance and reliability</li>
                    <li>• Develop new features and capabilities</li>
                    <li>• Ensure security and prevent fraud</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-red-600" />
                Data Security
              </h2>
              
              <div className="p-6 bg-gradient-to-r from-red-50/80 to-rose-50/80 rounded-2xl border border-red-200/50">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Security Measures</h3>
                    <ul className="space-y-2 text-red-800">
                      <li>• <strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                      <li>• <strong>Access Controls:</strong> Strict access controls and authentication</li>
                      <li>• <strong>Secure Infrastructure:</strong> Hosted on secure, compliant cloud platforms</li>
                      <li>• <strong>Regular Audits:</strong> Regular security assessments and updates</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white/60 rounded-xl">
                    <p className="text-red-800 font-medium text-sm">
                      <strong>Important:</strong> Your CSV files are processed temporarily and are not permanently stored on our servers. Files are automatically deleted after processing is complete.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-orange-600" />
                Data Sharing and Disclosure
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                    <h3 className="font-semibold text-gray-900 mb-2">Service Providers</h3>
                    <p className="text-sm text-gray-700">
                      We may share information with trusted service providers who assist in operating our service (e.g., Stripe for payments, Supabase for data storage).
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                    <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                    <p className="text-sm text-gray-700">
                      We may disclose information when required by law or to protect our rights, property, or safety, or that of our users.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Mail className="w-6 h-6 text-green-600" />
                Your Rights
              </h2>
              
              <div className="p-6 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-2xl border border-green-200/50">
                <p className="text-green-800 mb-4">You have the following rights regarding your personal information:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• <strong>Access:</strong> Request access to your personal data</li>
                    <li>• <strong>Correction:</strong> Request correction of inaccurate data</li>
                    <li>• <strong>Deletion:</strong> Request deletion of your personal data</li>
                  </ul>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• <strong>Portability:</strong> Request transfer of your data</li>
                    <li>• <strong>Restriction:</strong> Request restriction of processing</li>
                    <li>• <strong>Objection:</strong> Object to certain processing activities</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
              <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200/50">
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Essential Cookies:</strong> Required for basic functionality</li>
                  <li>• <strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
                  <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
              <div className="p-6 bg-blue-50/80 rounded-2xl border border-blue-200/50">
                <ul className="space-y-2 text-blue-800">
                  <li>• <strong>Account Data:</strong> Retained while your account is active</li>
                  <li>• <strong>CSV Files:</strong> Automatically deleted after processing (within 24 hours)</li>
                  <li>• <strong>Download History:</strong> Retained for account management purposes</li>
                  <li>• <strong>Payment Records:</strong> Retained as required by law and for tax purposes</li>
                </ul>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <div className="p-6 bg-amber-50/80 rounded-2xl border border-amber-200/50">
                <p className="text-amber-800">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </div>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
              <div className="p-6 bg-purple-50/80 rounded-2xl border border-purple-200/50">
                <p className="text-purple-800">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers are conducted in accordance with applicable data protection laws and with appropriate safeguards in place.
                </p>
              </div>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200/50">
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="p-6 bg-gradient-to-r from-violet-50/80 to-purple-50/80 rounded-2xl border border-violet-200/50">
                <p className="text-violet-800 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-violet-800">
                  <p><strong>Email:</strong> privacy@csvdrop.com</p>
                  <p><strong>Address:</strong> [Your Business Address]</p>
                  <p><strong>Phone:</strong> [Your Phone Number]</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;