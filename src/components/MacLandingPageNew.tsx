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
          <h1 className="text-6xl font-bold text-white mb-6">
            CSV DROP
          </h1>
          <h2 className="text-2xl text-cyan-300 mb-8 font-mono">
            Your 90's file manager just got a modern upgrade
          </h2>
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Transform your CSV files with the power of AI. Clean, analyze, and process your data with retro style and modern performance.
          </p>
          
          {/* CTA Button */}
          <button
            onClick={() => {
              console.log('Main CTA clicked');
              playClick?.();
              onShowAuth?.();
            }}
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold text-xl rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
          >
            Start Processing Your CSV Files
          </button>
        </div>

        {/* Feature Preview */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg mb-4 mx-auto flex items-center justify-center">
              <span className="text-black font-bold">📊</span>
            </div>
            <h3 className="text-white font-bold mb-2">Smart Analysis</h3>
            <p className="text-gray-300 text-sm">AI-powered insights and data validation</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 mx-auto flex items-center justify-center">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h3 className="text-white font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-300 text-sm">Process thousands of rows in seconds</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-pink-500 rounded-lg mb-4 mx-auto flex items-center justify-center">
              <span className="text-white font-bold">🎯</span>
            </div>
            <h3 className="text-white font-bold mb-2">Retro Vibes</h3>
            <p className="text-gray-300 text-sm">Nostalgic interface, modern power</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Built with ❤️ for data enthusiasts and retro computing fans
          </p>
        </div>
      </div>
    </div>
  );
};

export default MacLandingPage;
