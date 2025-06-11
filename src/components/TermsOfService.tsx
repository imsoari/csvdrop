import React from 'react';
import { ArrowLeft, FileText, AlertTriangle, CreditCard, Shield, Users, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService: React.FC = () => {
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
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
                <p className="text-gray-600 text-sm">Terms and conditions for using CSVDROP</p>
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
            <div className="text-center p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl border border-emerald-200/50">
              <p className="text-sm text-emerald-800 font-medium">
                Last Updated: January 1, 2025
              </p>
            </div>

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                Agreement to Terms
              </h2>
              <div className="p-6 bg-blue-50/80 rounded-2xl border border-blue-200/50">
                <p className="text-blue-800 leading-relaxed">
                  By accessing and using CSVDROP ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-emerald-600" />
                Service Description
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  CSVDROP is a web-based service that allows users to upload, process, and consolidate CSV (Comma-Separated Values) files. Our service provides:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200/50">
                    <h3 className="font-semibold text-emerald-900 mb-2">Core Features</h3>
                    <ul className="space-y-1 text-sm text-emerald-800">
                      <li>• CSV file upload and validation</li>
                      <li>• Data consolidation and merging</li>
                      <li>• Column selection and filtering</li>
                      <li>• Data export and download</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200/50">
                    <h3 className="font-semibold text-emerald-900 mb-2">Subscription Plans</h3>
                    <ul className="space-y-1 text-sm text-emerald-800">
                      <li>• Free plan with limited downloads</li>
                      <li>• Pro subscription with unlimited access</li>
                      <li>• Single-purchase download options</li>
                      <li>• Priority processing for subscribers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-600" />
                User Accounts and Registration
              </h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-purple-50/80 rounded-2xl border border-purple-200/50">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Account Requirements</h3>
                  <ul className="space-y-2 text-purple-800">
                    <li>• You must be at least 18 years old to create an account</li>
                    <li>• You must provide accurate and complete registration information</li>
                    <li>• You are responsible for maintaining the security of your account</li>
                    <li>• You must complete identity verification (KYC) to access full features</li>
                  </ul>
                </div>

                <div className="p-6 bg-amber-50/80 rounded-2xl border border-amber-200/50">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">Account Responsibilities</h3>
                  <ul className="space-y-2 text-amber-800">
                    <li>• You are responsible for all activities under your account</li>
                    <li>• You must notify us immediately of any unauthorized use</li>
                    <li>• You may not share your account credentials with others</li>
                    <li>• You may not create multiple accounts to circumvent limitations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Acceptable Use Policy
              </h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-green-50/80 rounded-2xl border border-green-200/50">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Permitted Uses</h3>
                  <ul className="space-y-2 text-green-800">
                    <li>• Processing legitimate business or personal CSV data</li>
                    <li>• Using the service for lawful data consolidation purposes</li>
                    <li>• Uploading data that you own or have permission to process</li>
                    <li>• Following all applicable laws and regulations</li>
                  </ul>
                </div>

                <div className="p-6 bg-red-50/80 rounded-2xl border border-red-200/50">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Prohibited Uses</h3>
                  <ul className="space-y-2 text-red-800">
                    <li>• Uploading malicious, illegal, or copyrighted content</li>
                    <li>• Processing personal data without proper consent</li>
                    <li>• Attempting to reverse engineer or hack the service</li>
                    <li>• Using the service to spam or distribute malware</li>
                    <li>• Violating any applicable laws or regulations</li>
                    <li>• Interfering with the service's operation or security</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-indigo-600" />
                Payment Terms
              </h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-indigo-50/80 rounded-2xl border border-indigo-200/50">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3">Subscription Plans</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-indigo-800">Free Plan</h4>
                      <p className="text-sm text-indigo-700">Limited to 1 free download per account</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-800">Pro Monthly ($9.99/month)</h4>
                      <p className="text-sm text-indigo-700">Unlimited downloads and priority processing</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-800">Single Download ($2.99)</h4>
                      <p className="text-sm text-indigo-700">One-time purchase for single download access</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Processing</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• All payments are processed securely through Stripe</li>
                    <li>• Subscriptions are billed monthly in advance</li>
                    <li>• All fees are non-refundable except as required by law</li>
                    <li>• You may cancel your subscription at any time</li>
                    <li>• Price changes will be communicated 30 days in advance</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data and Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Processing and Privacy</h2>
              
              <div className="p-6 bg-blue-50/80 rounded-2xl border border-blue-200/50">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Data</h3>
                    <ul className="space-y-2 text-blue-800">
                      <li>• You retain ownership of all data you upload</li>
                      <li>• We process your data solely to provide the service</li>
                      <li>• CSV files are automatically deleted after processing</li>
                      <li>• We do not access or view the content of your files</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white/60 rounded-xl">
                    <p className="text-blue-800 font-medium text-sm">
                      <strong>Important:</strong> By uploading files, you confirm that you have the right to process the data and that it complies with applicable privacy laws.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Availability</h2>
              
              <div className="p-6 bg-orange-50/80 rounded-2xl border border-orange-200/50">
                <ul className="space-y-2 text-orange-800">
                  <li>• We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service</li>
                  <li>• We may perform maintenance that temporarily affects service availability</li>
                  <li>• We reserve the right to modify or discontinue features with notice</li>
                  <li>• Service limitations may apply during high usage periods</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              
              <div className="space-y-4">
                <div className="p-6 bg-purple-50/80 rounded-2xl border border-purple-200/50">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Our Rights</h3>
                  <ul className="space-y-2 text-purple-800">
                    <li>• CSVDROP and all related trademarks are our property</li>
                    <li>• The service software and technology are protected by copyright</li>
                    <li>• You may not copy, modify, or distribute our intellectual property</li>
                  </ul>
                </div>

                <div className="p-6 bg-green-50/80 rounded-2xl border border-green-200/50">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Your Rights</h3>
                  <ul className="space-y-2 text-green-800">
                    <li>• You retain all rights to your uploaded data and files</li>
                    <li>• You grant us a limited license to process your data to provide the service</li>
                    <li>• This license terminates when you delete your data or account</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                Disclaimers and Limitations
              </h2>
              
              <div className="p-6 bg-amber-50/80 rounded-2xl border border-amber-200/50">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Service Disclaimer</h3>
                    <p className="text-amber-800 text-sm">
                      The service is provided "as is" without warranties of any kind. We do not guarantee that the service will be error-free, secure, or continuously available.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Limitation of Liability</h3>
                    <p className="text-amber-800 text-sm">
                      Our liability is limited to the amount you paid for the service in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50/80 rounded-xl border border-red-200/50">
                  <h3 className="font-semibold text-red-900 mb-2">By You</h3>
                  <p className="text-sm text-red-800">
                    You may terminate your account at any time by contacting us or using the account deletion feature.
                  </p>
                </div>
                
                <div className="p-4 bg-red-50/80 rounded-xl border border-red-200/50">
                  <h3 className="font-semibold text-red-900 mb-2">By Us</h3>
                  <p className="text-sm text-red-800">
                    We may terminate accounts that violate these terms or for any reason with 30 days notice.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Gavel className="w-6 h-6 text-slate-600" />
                Governing Law
              </h2>
              
              <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/50">
                <p className="text-slate-800">
                  These terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in the courts of [Your Jurisdiction]. If any provision of these terms is found to be unenforceable, the remaining provisions will remain in effect.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              
              <div className="p-6 bg-blue-50/80 rounded-2xl border border-blue-200/50">
                <p className="text-blue-800">
                  We may update these terms from time to time. We will notify users of significant changes via email or through the service. Continued use of the service after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="p-6 bg-gradient-to-r from-violet-50/80 to-purple-50/80 rounded-2xl border border-violet-200/50">
                <p className="text-violet-800 mb-4">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-violet-800">
                  <p><strong>Email:</strong> legal@csvdrop.com</p>
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

export default TermsOfService;