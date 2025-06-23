import React from 'react';

interface SimpleLandingProps {
  onShowAuth?: () => void;
  playClick?: () => void;
}

const SimpleLanding: React.FC<SimpleLandingProps> = ({
  onShowAuth,
  playClick
}) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          CSV DROP
        </h1>
        <p className="text-gray-300 mb-8">
          Your modern CSV file processor
        </p>
        <button
          onClick={() => {
            console.log('CTA clicked');
            playClick?.();
            onShowAuth?.();
          }}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default SimpleLanding;
