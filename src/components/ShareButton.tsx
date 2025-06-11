import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, X } from 'lucide-react';

interface ShareButtonProps {
  url?: string;
  title?: string;
  description?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  url = window.location.href,
  title = "CSVDROP - Professional CSV File Consolidator",
  description = "Merge, consolidate, and process multiple CSV files instantly with professional data processing tools"
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareData = {
    title,
    text: description,
    url
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  const handleShareClick = async () => {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.log('Share failed, showing menu');
          setShowShareMenu(true);
        }
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToTwitter = () => {
    const twitterText = `${title} - ${description}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420,scrollbars=yes,resizable=yes');
    setShowShareMenu(false);
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420,scrollbars=yes,resizable=yes');
    setShowShareMenu(false);
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=550,height=420,scrollbars=yes,resizable=yes');
    setShowShareMenu(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleShareClick}
        className="flex items-center gap-2 px-3 py-2 bg-csv-gradient text-white rounded-xl hover:bg-csv-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
        title="Share CSVDROP"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {/* Share Menu */}
      {showShareMenu && (
        <div className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-3 min-w-[180px] z-50"
             style={{
               background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
               boxShadow: '0 20px 40px -12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)'
             }}>
          
          {/* Close button */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-900">Share CSVDROP</span>
            <button
              onClick={() => setShowShareMenu(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100/80 rounded-xl transition-all duration-300 text-left"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
              <span className="text-sm font-medium text-gray-900">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>
            
            <button
              onClick={shareToTwitter}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-csv-orange-50/80 rounded-xl transition-all duration-300 text-left"
            >
              <Twitter className="w-4 h-4 text-csv-orange-500" />
              <span className="text-sm font-medium text-gray-900">Twitter</span>
            </button>
            
            <button
              onClick={shareToFacebook}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-csv-orange-50/80 rounded-xl transition-all duration-300 text-left"
            >
              <Facebook className="w-4 h-4 text-csv-orange-600" />
              <span className="text-sm font-medium text-gray-900">Facebook</span>
            </button>
            
            <button
              onClick={shareToLinkedIn}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-csv-orange-50/80 rounded-xl transition-all duration-300 text-left"
            >
              <Linkedin className="w-4 h-4 text-csv-orange-700" />
              <span className="text-sm font-medium text-gray-900">LinkedIn</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;