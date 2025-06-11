import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/macintosh.css';

interface MacLandingPageProps {
  onShowAuth: () => void;
  onShowPayment: () => void;
}

const MacLandingPage: React.FC<MacLandingPageProps> = ({ onShowAuth, onShowPayment }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="mac-window-title w-full py-2">
        <h1 className="text-center text-white">CSV DROP</h1>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="mac-window max-w-4xl w-full">
          <div className="mac-window-title">
            Welcome to CSV DROP
          </div>
          <div className="mac-window-content p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="mac-icon mac-icon-computer w-32 h-32"></div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-bold">The Easiest Way to Process CSV Files</h2>
                <p>CSV DROP is your AI-powered assistant for all things CSV. Upload your files and let our advanced AI handle the rest.</p>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <button 
                    className="mac-button"
                    onClick={onShowAuth}
                  >
                    <span className="mac-icon mac-icon-key w-4 h-4 mr-2 inline-block align-text-bottom"></span>
                    Sign In / Sign Up
                  </button>
                  
                  <button 
                    className="mac-button"
                    onClick={onShowPayment}
                  >
                    <span className="mac-icon mac-icon-floppy w-4 h-4 mr-2 inline-block align-text-bottom"></span>
                    Upgrade Account
                  </button>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="mac-window">
                <div className="mac-window-title">Data Processing</div>
                <div className="mac-window-content p-4">
                  <div className="mac-icon mac-icon-csv mx-auto mb-4 w-16 h-16"></div>
                  <p className="text-center">Process CSV files with ease using our intuitive interface.</p>
                </div>
              </div>
              
              <div className="mac-window">
                <div className="mac-window-title">AI Analysis</div>
                <div className="mac-window-content p-4">
                  <div className="mac-icon mac-icon-ai mx-auto mb-4 w-16 h-16"></div>
                  <p className="text-center">Let our AI analyze your data and provide valuable insights.</p>
                </div>
              </div>
              
              <div className="mac-window">
                <div className="mac-window-title">Secure Storage</div>
                <div className="mac-window-content p-4">
                  <div className="mac-icon mac-icon-folder mx-auto mb-4 w-16 h-16"></div>
                  <p className="text-center">Your files are securely stored and accessible anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mac-window-title w-full py-2 mt-auto">
        <div className="flex justify-center space-x-6 text-white text-sm">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

export default MacLandingPage;
