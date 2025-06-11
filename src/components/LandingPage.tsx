import React from 'react';
import { Sparkles, Upload, Settings, Download, CheckCircle, Crown, Zap, Star, ArrowRight, Users, Shield, Clock, BarChart3, Layers, Filter } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LandingPageProps {
  onShowAuth: () => void;
  onShowPayment: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShowAuth, onShowPayment }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative z-10">
        <Navbar 
          onDashboardClick={() => {}} // No dashboard for non-authenticated users
          onAuthClick={onShowAuth}
        />
        
        <main>
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 shadow-2xl mb-12"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                     boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.3)'
                   }}>
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-white/90 font-medium text-sm tracking-wide">PROFESSIONAL CSV PROCESSING PLATFORM</span>
              </div>
              
              <h1 className="text-7xl md:text-9xl font-black text-white mb-8 leading-none tracking-tighter">
                TRANSFORM{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  DATA
                </span>
                <br />
                <span className="text-6xl md:text-8xl text-white/70 font-light">INSTANTLY</span>
              </h1>
              
              <p className="text-2xl text-white/80 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
                Revolutionary CSV consolidation with AI-powered column mapping, 
                enterprise-grade deduplication, and lightning-fast processing.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                <button
                  onClick={onShowAuth}
                  className="group px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-xl border border-cyan-400/50 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 flex items-center justify-center gap-4"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    boxShadow: '0 20px 40px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                  }}
                >
                  <Upload className="w-6 h-6 transition-transform group-hover:scale-110" />
                  START PROCESSING
                  <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-12 py-6 bg-white/10 backdrop-blur-2xl text-white rounded-2xl font-bold text-xl border border-white/20 transition-all duration-500 shadow-2xl hover:shadow-white/10 transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.2)'
                  }}
                >
                  EXPLORE FEATURES
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                {[
                  { value: '50MB', label: 'Max File Size', icon: Upload, color: 'from-emerald-400 to-cyan-500' },
                  { value: '3', label: 'Files at Once', icon: Layers, color: 'from-blue-400 to-indigo-500' },
                  { value: '100%', label: 'Client-Side', icon: Shield, color: 'from-purple-400 to-pink-500' },
                  { value: '1M+', label: 'Rows Processed', icon: BarChart3, color: 'from-orange-400 to-red-500' }
                ].map((metric, index) => (
                  <div key={index} className="text-center p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500 transform hover:scale-105"
                       style={{
                         background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.2)'
                       }}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${metric.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <metric.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-black text-white mb-2">{metric.value}</div>
                    <div className="text-sm text-white/70 font-medium uppercase tracking-wider">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="bg-black/20 backdrop-blur-sm py-32 border-y border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-24">
                <h2 className="text-6xl font-black text-white mb-8 tracking-tighter">
                  THREE STEPS TO
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"> PERFECTION</span>
                </h2>
                <p className="text-2xl text-white/70 max-w-3xl mx-auto font-light">
                  Engineered for speed, built for scale
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {[
                  {
                    step: '01',
                    title: 'UPLOAD',
                    description: 'Drag & drop with instant validation and real-time preview',
                    icon: Upload,
                    gradient: 'from-cyan-500 to-blue-600'
                  },
                  {
                    step: '02',
                    title: 'CONFIGURE',
                    description: 'AI-powered column mapping with smart deduplication',
                    icon: Settings,
                    gradient: 'from-purple-500 to-pink-600'
                  },
                  {
                    step: '03',
                    title: 'DOWNLOAD',
                    description: 'Lightning-fast processing with detailed analytics',
                    icon: Download,
                    gradient: 'from-emerald-500 to-cyan-500'
                  }
                ].map((step, index) => (
                  <div key={index} className="group text-center relative">
                    <div className="relative mb-12">
                      <div className={`w-32 h-32 bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-white/20 group-hover:scale-110 transition-all duration-700 group-hover:rotate-6`}
                           style={{
                             boxShadow: '0 25px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                           }}>
                        <step.icon className="w-16 h-16 text-white" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-lg font-black shadow-2xl">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-6 tracking-wider">{step.title}</h3>
                    <p className="text-white/70 leading-relaxed font-light text-lg max-w-sm mx-auto">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-24">
                <h2 className="text-6xl font-black text-white mb-8 tracking-tighter">
                  ENTERPRISE
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> FEATURES</span>
                </h2>
                <p className="text-2xl text-white/70 max-w-3xl mx-auto font-light">
                  Professional-grade capabilities that scale with your needs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[
                  {
                    title: 'AI MAPPING',
                    description: 'Neural network-powered column detection with 99.9% accuracy',
                    icon: Sparkles,
                    gradient: 'from-blue-500 to-cyan-500'
                  },
                  {
                    title: 'SMART DEDUP',
                    description: 'Advanced algorithms eliminate duplicates with precision',
                    icon: Filter,
                    gradient: 'from-emerald-500 to-teal-500'
                  },
                  {
                    title: 'ZERO TRUST',
                    description: 'Military-grade security with client-side processing',
                    icon: Shield,
                    gradient: 'from-purple-500 to-pink-500'
                  },
                  {
                    title: 'REAL-TIME',
                    description: 'Live analytics and processing insights dashboard',
                    icon: BarChart3,
                    gradient: 'from-orange-500 to-red-500'
                  },
                  {
                    title: 'LIGHTNING',
                    description: 'Process millions of rows in seconds, not minutes',
                    icon: Clock,
                    gradient: 'from-violet-500 to-purple-500'
                  },
                  {
                    title: 'COLLABORATE',
                    description: 'Team workflows with shared processing pipelines',
                    icon: Users,
                    gradient: 'from-pink-500 to-rose-500'
                  }
                ].map((feature, index) => (
                  <div key={index} className="group p-10 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-700 transform hover:scale-105 hover:-rotate-1"
                       style={{
                         background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                       }}>
                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-8 shadow-2xl border border-white/20 group-hover:scale-110 transition-all duration-500`}
                         style={{
                           boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                         }}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-6 tracking-wider">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed font-light text-lg">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="bg-black/30 backdrop-blur-sm py-32 border-y border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-24">
                <h2 className="text-6xl font-black text-white mb-8 tracking-tighter">
                  TRANSPARENT
                  <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"> PRICING</span>
                </h2>
                <p className="text-2xl text-white/70 max-w-3xl mx-auto font-light">
                  Choose the plan that accelerates your workflow
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {/* Free Plan */}
                <div className="p-10 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-700"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                       boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                     }}>
                  <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-slate-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 tracking-wider">STARTER</h3>
                    <div className="text-6xl font-black text-white mb-4">FREE</div>
                    <p className="text-white/70 font-light text-lg">Perfect for evaluation</p>
                  </div>
                  
                  <ul className="space-y-6 mb-10">
                    {['1 download included', 'All core features', 'Community support'].map((feature, index) => (
                      <li key={index} className="flex items-center gap-4">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <span className="text-white/80 font-light text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={onShowAuth}
                    className="w-full py-5 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-2xl font-bold text-lg hover:from-slate-500 hover:to-gray-600 transition-all duration-500 shadow-2xl transform hover:scale-105"
                  >
                    GET STARTED
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="p-10 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-2xl rounded-3xl shadow-2xl text-white relative transform scale-110 border-2 border-purple-400/50"
                     style={{
                       background: 'linear-gradient(135deg, rgba(147,51,234,0.2) 0%, rgba(219,39,119,0.2) 100%)',
                       boxShadow: '0 30px 60px rgba(147,51,234,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                     }}>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full text-sm font-black shadow-2xl tracking-wider">
                      MOST POPULAR
                    </span>
                  </div>
                  
                  <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                      <Crown className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 tracking-wider">PROFESSIONAL</h3>
                    <div className="text-6xl font-black mb-4">$9.99</div>
                    <p className="text-white/80 font-light text-lg">per month</p>
                  </div>
                  
                  <ul className="space-y-6 mb-10">
                    {['Unlimited downloads', 'Priority processing', 'Advanced analytics', 'Email support'].map((feature, index) => (
                      <li key={index} className="flex items-center gap-4">
                        <CheckCircle className="w-6 h-6 text-yellow-400" />
                        <span className="font-light text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={onShowPayment}
                    className="w-full py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-2xl font-black text-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-500 shadow-2xl transform hover:scale-105"
                  >
                    START TRIAL
                  </button>
                </div>

                {/* Single Plan */}
                <div className="p-10 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-700"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                       boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                     }}>
                  <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                      <Download className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 tracking-wider">ONE-TIME</h3>
                    <div className="text-6xl font-black text-white mb-4">$2.99</div>
                    <p className="text-white/70 font-light text-lg">Single purchase</p>
                  </div>
                  
                  <ul className="space-y-6 mb-10">
                    {['One download credit', 'Full feature access', 'No expiration'].map((feature, index) => (
                      <li key={index} className="flex items-center gap-4">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <span className="text-white/80 font-light text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={onShowPayment}
                    className="w-full py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:from-emerald-400 hover:to-cyan-400 transition-all duration-500 shadow-2xl transform hover:scale-105"
                  >
                    PURCHASE
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="p-20 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20"
                   style={{
                     background: 'linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(147,51,234,0.3) 100%)',
                     boxShadow: '0 30px 60px rgba(79,70,229,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                   }}>
                <h2 className="text-5xl font-black text-white mb-8 tracking-tighter">
                  READY TO TRANSFORM
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"> YOUR DATA?</span>
                </h2>
                <p className="text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-light">
                  Join thousands of professionals who trust CSVDROP for mission-critical data processing
                </p>
                <button
                  onClick={onShowAuth}
                  className="group px-16 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-black text-2xl hover:from-cyan-400 hover:to-purple-500 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-110 flex items-center justify-center gap-4 mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                    boxShadow: '0 25px 50px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                  }}
                >
                  BEGIN PROCESSING
                  <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-2" />
                </button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;