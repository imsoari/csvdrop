import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useSubscription } from '../hooks/useSubscription';
import useMacSounds from '../hooks/useMacSounds';
import '../styles/macintosh.css';
import '../styles/mac-dashboard.css';

interface MacUserDashboardProps {
  onShowPayment: () => void;
  onShowDownloadTicket: (data: { downloadType: string; ticketNumber: string }) => void;
}

const MacUserDashboard: React.FC<MacUserDashboardProps> = ({ onShowPayment, onShowDownloadTicket }) => {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const { subscription } = useSubscription();
  const macSounds = useMacSounds();
  
  // State variables
  const [fileUploading, setFileUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setFileUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setFileUploading(false);
      
      // Generate random ticket number
      const ticketNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Show download ticket
      onShowDownloadTicket({
        downloadType: subscription?.type || 'free',
        ticketNumber
      });
      
      // Reset selected file
      setSelectedFile(null);
    }, 2000);
  };
  
  // Handle sign out
  const handleSignOut = () => {
    macSounds.playClick();
    logout();
  };
  
  return (
    <div className="mac-os-desktop">
      {/* Mac OS Menu Bar */}
      <div className="mac-os-menubar">
        <div className="mac-apple-menu">
          <span className="mac-apple-logo"></span>
        </div>
        <div className="mac-menu-item">File</div>
        <div className="mac-menu-item">Edit</div>
        <div className="mac-menu-item">View</div>
        <div className="mac-menu-item">Special</div>
        <div className="mac-menu-item">Help</div>
        <div className="flex-grow"></div>
        <div className="flex items-center">
          {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
      
      <div className="mac-dashboard-container">
        <div className="mac-desktop-container">
          {/* Account Window */}
          <div className="mac-classic-window mb-6">
            <div className="mac-window-header">
              <div className="mac-window-controls">
                <div className="mac-close-box"></div>
              </div>
              <div className="mac-window-title-text">Account Information</div>
            </div>
            <div className="p-5 mac-classic-scrollbar">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <div className="mac-icon mac-icon-computer mr-2"></div>
                      <p className="font-bold">{profile?.first_name || 'User'}'s Workstation</p>
                    </div>
                    <p><span className="font-bold">Email:</span> {user?.email}</p>
                    <p><span className="font-bold">Name:</span> {profile?.first_name} {profile?.last_name}</p>
                    <p><span className="font-bold">Plan:</span> {subscription?.type || 'Free'}</p>
                  </div>
                </div>
                
                <button 
                  className="mac-button"
                  onClick={() => {
                    macSounds.playClick();
                    onShowPayment();
                  }}
                >
                  Upgrade Account
                </button>
              </div>
            </div>
          </div>
          
          {/* File Upload Window */}
          <div className="mac-classic-window mb-6">
            <div className="mac-window-header">
              <div className="mac-window-controls">
                <div className="mac-close-box"></div>
              </div>
              <div className="mac-window-title-text">Upload CSV File</div>
            </div>
            <div className="p-5 mac-classic-scrollbar">
              <div className="flex flex-col items-center">
                <div className="mac-file-drop-area mb-4 w-full">
                  <div className="mac-floppy-icon"></div>
                  <p className="mb-2 font-bold">Drop your CSV file here</p>
                  <p className="text-sm">or click to browse files</p>
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="mac-file-input"
                    onChange={handleFileChange}
                    disabled={fileUploading}
                  />
                </div>
                
                {selectedFile && (
                  <div className="mb-4 mac-classic-window p-2 w-full">
                    <div className="flex items-center">
                      <div className="mac-icon mac-icon-csv mr-2"></div>
                      <p>Selected: {selectedFile.name}</p>
                    </div>
                  </div>
                )}
                
                {fileUploading ? (
                  <div className="w-full mb-4">
                    <p className="mb-2 text-center">Uploading file...</p>
                    <div className="mac-progress-bar">
                      <div className="mac-progress-fill" style={{width: '70%'}}></div>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="mac-button"
                    onClick={() => {
                      macSounds.playDisk();
                      handleFileUpload();
                    }}
                    disabled={!selectedFile}
                  >
                    Process CSV File
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Recent Activity Window */}
          <div className="mac-classic-window">
            <div className="mac-window-header">
              <div className="mac-window-controls">
                <div className="mac-close-box"></div>
              </div>
              <div className="mac-window-title-text">Recent Activity</div>
            </div>
            <div className="p-5 mac-classic-scrollbar">
              <div className="mac-ai-assistant p-4 mb-4">
                <div className="flex items-center mb-2">
                  <div className="mac-icon mac-icon-ai w-8 h-8 mr-2"></div>
                  <h3 className="font-bold">AI Assistant</h3>
                </div>
                <p className="mac-ai-text">
                  Welcome to CSV DROP! Upload a CSV file to get started with processing and analysis.
                </p>
              </div>
              
              <table className="mac-list-view w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>File Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3} className="text-center py-6">No recent activity to display</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mac Status Bar */}
      <div className="mac-status-bar">
        <div className="mac-status-item">
          <div className="mac-icon mac-icon-floppy mr-1" style={{width: '16px', height: '16px'}}></div>
          <span>{subscription?.type || 'Free'} Plan</span>
        </div>
        <div className="mac-status-item">
          <button 
            className="text-xs hover:underline"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default MacUserDashboard;
