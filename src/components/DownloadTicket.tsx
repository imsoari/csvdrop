import React, { useEffect, useState, useCallback } from 'react';
import { Download, CheckCircle, Calendar, FileText, Hash, X, Sparkles } from 'lucide-react';

interface DownloadTicketProps {
  isVisible: boolean;
  onClose: () => void;
  fileName: string;
  rowCount: number;
  columnCount: number;
  downloadType: 'free' | 'pro' | 'single';
  ticketNumber: string;
}

const DownloadTicket: React.FC<DownloadTicketProps> = ({
  isVisible,
  onClose,
  fileName,
  rowCount,
  columnCount,
  downloadType,
  ticketNumber
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto-close after 10 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  const getTicketColor = () => {
    switch (downloadType) {
      case 'pro':
        return {
          gradient: 'from-purple-500 via-violet-600 to-purple-700',
          bg: 'rgba(139,92,246,0.1)',
          shadow: 'rgba(139,92,246,0.6)',
          icon: 'text-purple-600',
          badge: 'PRO'
        };
      case 'single':
        return {
          gradient: 'from-emerald-500 via-teal-600 to-emerald-700',
          bg: 'rgba(16,185,129,0.1)',
          shadow: 'rgba(16,185,129,0.6)',
          icon: 'text-emerald-600',
          badge: 'PAID'
        };
      default:
        return {
          gradient: 'from-blue-500 via-indigo-600 to-purple-600',
          bg: 'rgba(59,130,246,0.1)',
          shadow: 'rgba(59,130,246,0.6)',
          icon: 'text-blue-600',
          badge: 'FREE'
        };
    }
  };

  const colors = getTicketColor();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`relative max-w-md w-full transform transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Ticket Container */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
               boxShadow: `0 40px 80px -12px ${colors.shadow}, inset 0 1px 0 rgba(255,255,255,0.8)`
             }}>
          
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${colors.gradient} p-6 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Download Complete!</h2>
                    <p className="text-white/80 text-sm">Your CSV file is ready</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">CSVDROP</div>
                <div className={`px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold`}>
                  {colors.badge}
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-6">
            {/* Success Icon */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg mb-4`}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Successfully Downloaded</h3>
              <p className="text-gray-600">Your consolidated CSV file has been saved to your device</p>
            </div>

            {/* Ticket Details */}
            <div className="space-y-4">
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50"
                   style={{
                     background: 'linear-gradient(135deg, rgba(249,250,251,0.8) 0%, rgba(243,244,246,0.6) 100%)',
                     boxShadow: '0 8px 20px -5px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'
                   }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-blue-100 rounded-xl`}>
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">File Name</div>
                      <div className="text-sm font-bold text-gray-900 truncate" title={fileName}>
                        {fileName}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-emerald-100 rounded-xl`}>
                      <Hash className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Rows</div>
                      <div className="text-sm font-bold text-gray-900">
                        {rowCount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50"
                   style={{
                     background: 'linear-gradient(135deg, rgba(249,250,251,0.8) 0%, rgba(243,244,246,0.6) 100%)',
                     boxShadow: '0 8px 20px -5px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'
                   }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-purple-100 rounded-xl`}>
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Columns</div>
                      <div className="text-sm font-bold text-gray-900">
                        {columnCount}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-orange-100 rounded-xl`}>
                      <Calendar className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Date</div>
                      <div className="text-sm font-bold text-gray-900">
                        {currentDate.split(',')[0]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Number */}
            <div className="text-center p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-2xl border border-gray-200/50"
                 style={{
                   background: `linear-gradient(135deg, ${colors.bg} 0%, rgba(255,255,255,0.6) 100%)`,
                   boxShadow: '0 8px 20px -5px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'
                 }}>
              <div className="text-xs text-gray-500 font-medium mb-1">Ticket Number</div>
              <div className="text-lg font-mono font-bold text-gray-900 tracking-wider">
                #{ticketNumber}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200/50">
              <p>Thank you for using CSVDROP!</p>
              <p className="mt-1">Keep this ticket for your records</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full shadow-lg animate-pulse delay-300"></div>
      </div>
    </div>
  );
};

export default DownloadTicket;