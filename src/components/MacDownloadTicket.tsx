import React, { useState, useEffect } from 'react';
import '../styles/macintosh.css';

interface MacDownloadTicketProps {
  isOpen: boolean;
  onClose: () => void;
  downloadType: "free" | "pro" | "single";
  ticketNumber: string;
  fileName: string;
  rowCount: number;
  columnCount: number;
  playClick?: () => void;
  playDisk?: () => void;
}

const MacDownloadTicket: React.FC<MacDownloadTicketProps> = ({ 
  isOpen, 
  onClose, 
  downloadType,
  ticketNumber,
  playClick,
  playDisk
}) => {
  const [processing, setProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<string[]>([]);
  
  // Simulate processing and AI analysis
  useEffect(() => {
    if (isOpen && processing) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);
      
      // Add AI analysis messages over time
      const analysisTimers = [
        setTimeout(() => {
          setAiAnalysis(prev => [...prev, "Analyzing CSV structure..."]);
          playDisk?.();
        }, 1000),
        setTimeout(() => {
          setAiAnalysis(prev => [...prev, "Detecting data types and patterns..."]);
          playDisk?.();
        }, 2500),
        setTimeout(() => {
          setAiAnalysis(prev => [...prev, "Identifying potential insights..."]);
          playDisk?.();
        }, 4000),
        setTimeout(() => {
          setAiAnalysis(prev => [...prev, "Preparing visualization recommendations..."]);
          playDisk?.();
        }, 5500),
        setTimeout(() => {
          setAiAnalysis(prev => [...prev, "Analysis complete!"]);
          setProcessing(false);
          playDisk?.();
        }, 7000)
      ];
      
      return () => {
        clearInterval(interval);
        analysisTimers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [isOpen, processing, playDisk]);
  
  if (!isOpen) return null;
  
  const handleDownload = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `processed_data_${ticketNumber}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    playClick?.();
    setTimeout(() => {
      onClose();
    }, 500);
  };
  
  return (
    <div className="mac-modal-overlay">
      <div className="mac-modal">
        <div className="mac-modal-title">
          CSV Processing Ticket #{ticketNumber}
        </div>
        <div className="mac-modal-content">
          <div className="flex items-center mb-6">
            <div className="mac-icon mac-icon-csv w-12 h-12 mr-4"></div>
            <div>
              <h2 className="text-lg font-bold">CSV Processing</h2>
              <p className="text-sm">{downloadType.charAt(0).toUpperCase() + downloadType.slice(1)} Account</p>
            </div>
          </div>
          
          {processing ? (
            <div className="space-y-4">
              <h3 className="font-bold mb-2">Processing Your CSV File</h3>
              
              <div className="border-2 border-black bg-white p-2">
                <div className="h-6 bg-black relative">
                  <div 
                    className="h-full bg-white absolute top-0 left-0" 
                    style={{ width: `${100 - progress}%`, right: 0 }}
                  ></div>
                </div>
                <div className="text-center mt-1 text-sm">
                  {Math.floor(progress)}% Complete
                </div>
              </div>
              
              <div className="mac-ai-assistant p-4 mt-4">
                <div className="flex items-center mb-2">
                  <div className="mac-icon mac-icon-ai w-8 h-8 mr-2"></div>
                  <h3 className="font-bold">AI Assistant</h3>
                </div>
                <div className="mac-ai-text space-y-2">
                  {aiAnalysis.map((message, index) => (
                    <p key={index}>{message}</p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="mac-icon mac-icon-success w-16 h-16"></div>
              </div>
              
              <h3 className="font-bold text-center mb-4">Processing Complete!</h3>
              
              <div className="mac-window">
                <div className="mac-window-title">
                  File Information
                </div>
                <div className="mac-window-content p-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="font-bold">Ticket Number:</td>
                        <td>{ticketNumber}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Account Type:</td>
                        <td>{downloadType.charAt(0).toUpperCase() + downloadType.slice(1)}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Processing Date:</td>
                        <td>{new Date().toLocaleDateString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mac-ai-assistant p-4 mt-4">
                <div className="flex items-center mb-2">
                  <div className="mac-icon mac-icon-ai w-8 h-8 mr-2"></div>
                  <h3 className="font-bold">AI Assistant</h3>
                </div>
                <div className="mac-ai-text space-y-2">
                  <p>I've analyzed your CSV file and it's ready for download!</p>
                  <p>Key insights:</p>
                  <ul className="list-disc pl-5">
                    <li>Found 5 potential data anomalies</li>
                    <li>Detected 3 strong correlations between columns</li>
                    <li>Optimized data structure for faster processing</li>
                  </ul>
                  <p>Click the download button to get your processed file.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mac-modal-actions">
          <button 
            className="mac-button"
            onClick={() => {
              onClose();
              playClick?.();
            }}
          >
            Close
          </button>
          
          {!processing && (
            <button 
              className="mac-button"
              onClick={handleDownload}
            >
              Download File
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MacDownloadTicket;
