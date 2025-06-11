import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useSubscription } from '../hooks/useSubscription';
import '../styles/macintosh.css';

interface MacUserDashboardProps {
  onShowPayment: () => void;
  onShowDownloadTicket: (data: { downloadType: string; ticketNumber: string }) => void;
}

const MacUserDashboard: React.FC<MacUserDashboardProps> = ({ onShowPayment, onShowDownloadTicket }) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { subscription } = useSubscription();
  
  const [fileUploading, setFileUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
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
    signOut();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="mac-window-title w-full py-2 flex justify-between items-center px-4">
        <h1 className="text-white">CSV DROP</h1>
        <div className="flex items-center space-x-4">
          <span className="text-white text-sm">
            {profile?.first_name || user?.email}
          </span>
          <button 
            className="text-white text-sm hover:underline"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center p-4">
        {/* User Info */}
        <div className="mac-window max-w-4xl w-full mb-6">
          <div className="mac-window-title">
            Account Information
          </div>
          <div className="mac-window-content p-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Name:</strong> {profile?.first_name} {profile?.last_name}</p>
                <p><strong>Plan:</strong> {subscription?.type || 'Free'}</p>
              </div>
              
              <button 
                className="mac-button mt-4 md:mt-0"
                onClick={onShowPayment}
              >
                Upgrade Account
              </button>
            </div>
          </div>
        </div>
        
        {/* File Upload */}
        <div className="mac-window max-w-4xl w-full mb-6">
          <div className="mac-window-title">
            Upload CSV File
          </div>
          <div className="mac-window-content p-6">
            <div className="flex flex-col items-center">
              <div className="mac-icon mac-icon-csv w-16 h-16 mb-4"></div>
              
              <label className="mac-button mb-4 cursor-pointer">
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={fileUploading}
                />
                Select CSV File
              </label>
              
              {selectedFile && (
                <div className="mb-4">
                  <p className="text-center">Selected: {selectedFile.name}</p>
                </div>
              )}
              
              <button 
                className="mac-button"
                onClick={handleFileUpload}
                disabled={!selectedFile || fileUploading}
              >
                {fileUploading ? (
                  <span>Uploading...</span>
                ) : (
                  <span>Upload File</span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mac-window max-w-4xl w-full">
          <div className="mac-window-title">
            Recent Activity
          </div>
          <div className="mac-window-content p-4">
            <div className="mac-ai-assistant p-4 mb-4">
              <div className="flex items-center mb-2">
                <div className="mac-icon mac-icon-ai w-8 h-8 mr-2"></div>
                <h3 className="font-bold">AI Assistant</h3>
              </div>
              <p className="mac-ai-text">
                Welcome to CSV DROP! Upload a CSV file to get started with processing and analysis.
              </p>
            </div>
            
            <p className="text-center text-sm">No recent activity to display.</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mac-window-title w-full py-2 mt-auto">
        <div className="text-center text-white text-sm">
          &copy; {new Date().getFullYear()} CSV DROP. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MacUserDashboard;
