import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-2xl border-t border-white/10 mt-32"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
            }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="text-white/60 text-sm font-light">
              © 2025 CSVDROP
            </p>
          </div>
          
          <div className="flex items-center gap-12 text-sm">
            <Link 
              to="/privacy" 
              className="text-white/70 hover:text-white transition-colors duration-300 font-medium uppercase tracking-wider"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-white/70 hover:text-white transition-colors duration-300 font-medium uppercase tracking-wider"
            >
              Terms of Service
            </Link>
            <a 
              href="mailto:support@csvdrop.com" 
              className="text-white/70 hover:text-white transition-colors duration-300 font-medium uppercase tracking-wider"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;