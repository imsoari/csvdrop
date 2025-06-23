import React from 'react';

interface MacLandingPageProps {
  onShowAuth?: () => void;
  playClick?: () => void;
}

const MacLandingPage: React.FC<MacLandingPageProps> = ({
  onShowAuth,
  playClick
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-8">
      <div className="text-center max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-white mb-6 retro-text-glow">
            CSV DROP
          </h1>
          <h2 className="text-2xl text-cyan-300 mb-8 font-mono">
            Your 90's file manager just got a modern upgrade
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Drop your CSV files, transform your data, and download clean results. 
            No signup required to try - just drag, drop, and go!
          </p>
        </div>

        {/* CTA Section */}
        <div className="space-y-6">
          <button 
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xl px-12 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 retro-button-glow"
            onClick={() => {
              playClick?.();
              onShowAuth?.();
            }}
          >
            🚀 Start Processing CSV Files
          </button>
          
          <div className="text-sm text-gray-400">
            Try it free • No credit card required • Process up to 3 files
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-black/30 p-6 rounded-lg border border-cyan-500/30">
            <div className="text-3xl mb-4">🔄</div>
            <h3 className="text-cyan-300 font-bold mb-2">Transform Data</h3>
            <p className="text-gray-300 text-sm">Clean, merge, and restructure your CSV files with powerful tools</p>
          </div>
          
          <div className="bg-black/30 p-6 rounded-lg border border-cyan-500/30">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-cyan-300 font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-300 text-sm">Process thousands of rows in seconds with our optimized engine</p>
          </div>
          
          <div className="bg-black/30 p-6 rounded-lg border border-cyan-500/30">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-cyan-300 font-bold mb-2">Secure & Private</h3>
            <p className="text-gray-300 text-sm">Your data never leaves your browser - complete privacy guaranteed</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Ready to supercharge your data workflow?</p>
          <button 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200"
            onClick={() => {
              playClick?.();
              onShowAuth?.();
            }}
          >
            Get Started Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MacLandingPage;
