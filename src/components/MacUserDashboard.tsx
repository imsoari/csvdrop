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
  
  // Free trial registration form
  const [trialForm, setTrialForm] = useState({
    name: '',
    email: ''
  });
  const [trialFormErrors, setTrialFormErrors] = useState({
    name: '',
    email: ''
  });
  
  // Window state for pop-ups
  const [activeWindows, setActiveWindows] = useState<string[]>([]);
  const [maxZIndex, setMaxZIndex] = useState<number>(1000);
  const [windowPositions, setWindowPositions] = useState<{[key: string]: {top: string, left: string}}>({});
  const [maximizedWindows, setMaximizedWindows] = useState<string[]>([]);
  const [previousWindowPositions, setPreviousWindowPositions] = useState<{[key: string]: {top: string, left: string}}>({});
  
  // Drag state
  const [dragInfo, setDragInfo] = useState<{
    isDragging: boolean;
    windowId: string | null;
    initialX: number;
    initialY: number;
    initialTop: number;
    initialLeft: number;
  }>({ 
    isDragging: false, 
    windowId: null, 
    initialX: 0, 
    initialY: 0, 
    initialTop: 0, 
    initialLeft: 0 
  });
  
  // Desktop icons position state
  const desktopIcons = [
    { id: 'about', label: 'About Us', icon: 'users' },
    { id: 'socials', label: 'Socials', icon: 'phone' },
    { id: 'trial', label: 'Free Trial', icon: 'gift' }
  ];
  
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
  
  // Window management functions
  const openWindow = (windowId: string) => {
    macSounds.playClick();
    
    // If window is already open, bring to front
    if (activeWindows.includes(windowId)) {
      bringWindowToFront(windowId);
      return;
    }
    
    bringWindowToFront(windowId);
  };
  
  const closeWindow = (windowId: string) => {
    macSounds.playClick();
    setActiveWindows(prev => prev.filter(w => w !== windowId));
  };
  
  const bringWindowToFront = (windowId: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    // Set z-index specifically for the window we're bringing to front
    if (windowId) {
      // If the window isn't already at the front
      if (!activeWindows.includes(windowId)) {
        // Add it to active windows
        setActiveWindows(prev => [...prev, windowId]);
      }
    }
  };
  
  // Get position for each window type
  const getWindowPosition = (windowId: string) => {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Center windows on mobile but with slight offset for stacking
      return {
        top: `${50 + (activeWindows.length * 10)}px`,
        left: `${window.innerWidth * 0.025}px` // 2.5% margin from left edge
      };
    } else {
      // Desktop positioning
      switch(windowId) {
        case 'upload':
          return { top: '80px', left: '120px' };
        case 'about':
          return { top: '100px', left: '160px' };
        case 'socials':
          return { top: '120px', left: '200px' };
        case 'trial':
          return { top: '140px', left: '240px' };
        default:
          return { top: '100px', left: '180px' };
      }
    }
  };
  
  // Handle sign out
  const handleSignOut = () => {
    if (macSounds.enabled) macSounds.playClick();
    logout();
  };
  
  // Handle trial form input change
  const handleTrialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTrialForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (trialFormErrors[name as keyof typeof trialFormErrors]) {
      setTrialFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle trial form submission
  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    macSounds.playClick();
    
    // Validate form
    const errors = {
      name: trialForm.name ? '' : 'Please enter your name',
      email: trialForm.email ? (trialForm.email.includes('@') ? '' : 'Please enter a valid email') : 'Please enter your email'
    };
    
    setTrialFormErrors(errors);
    
    // If no errors, proceed with registration
    if (!errors.name && !errors.email) {
      // Here you would typically register the user
      // For now, we'll just show a success message and close the window
      alert(`Thanks ${trialForm.name}! Your free trial account has been created. You now have 1 free download.`);
      closeWindow('trial');
    }
  };
  
  // Handle double-click to maximize/restore window
  const handleWindowDoubleClick = (windowId: string) => {
    // Play a sound for maximize/restore
    macSounds.playClick();
    
    if (maximizedWindows.includes(windowId)) {
      // Restore window to previous position
      setMaximizedWindows(prev => prev.filter(id => id !== windowId));
      
      // Restore previous position if available
      if (previousWindowPositions[windowId]) {
        setWindowPositions(prev => ({
          ...prev,
          [windowId]: previousWindowPositions[windowId]
        }));
      }
    } else {
      // Maximize window
      setMaximizedWindows(prev => [...prev, windowId]);
      
      // Store current position before maximizing
      setPreviousWindowPositions(prev => ({
        ...prev,
        [windowId]: windowPositions[windowId] || getWindowPosition(windowId)
      }));
      
      // Set position to maximize (using fixed values since this is a simple demo)
      setWindowPositions(prev => ({
        ...prev,
        [windowId]: { top: '60px', left: '100px' }
      }));
    }
  };
  
  // Handle window dragging
  const handleWindowMouseDown = (e: React.MouseEvent, windowId: string) => {
    // Bring window to front
    bringWindowToFront(windowId);
    
    // Get current position or default
    const currentPos = windowPositions[windowId] || getWindowPosition(windowId);
    
    // Calculate numerical values from CSS strings
    const initialTop = parseInt(currentPos.top);
    const initialLeft = parseInt(currentPos.left);
    
    // Start dragging
    setDragInfo({
      isDragging: true,
      windowId,
      initialX: e.clientX,
      initialY: e.clientY,
      initialTop,
      initialLeft
    });
    
    // Play sound
    macSounds.playClick();
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragInfo.isDragging) return;
    
    const dx = e.clientX - dragInfo.initialX;
    const dy = e.clientY - dragInfo.initialY;
    
    setWindowPositions(prev => ({
      ...prev,
      [dragInfo.windowId!]: {
        top: `${dragInfo.initialTop + dy}px`,
        left: `${dragInfo.initialLeft + dx}px`
      }
    }));
  };
  
  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    if (dragInfo.isDragging) {
      setDragInfo(prev => ({ ...prev, isDragging: false }));
      // Play a subtle sound when dropping a window
      macSounds.playClick();
    }
  };
  
  return (
    <div 
      className="mac-os-desktop"
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}>
      
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
      
      {/* Desktop Icons */}
      <div className="mac-desktop-icons-column">
        {desktopIcons.map((icon) => (
          <div
            key={icon.id}
            className="mac-desktop-icon"
            onClick={() => openWindow(icon.id)}
          >
            <div className="mac-icon-frame">
              <div className={`mac-icon mac-icon-${icon.icon}`}></div>
            </div>
            <div className="mac-icon-label">{icon.label}</div>
          </div>
        ))}
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
      
      {/* Pop-up Windows */}
      {activeWindows.includes('upload') && (
        <div 
          key={'upload'} 
          className={`mac-popup-window ${maximizedWindows.includes('upload') ? 'mac-window-maximized' : ''}`} 
          style={{ 
            zIndex: maxZIndex,
            ...(windowPositions['upload'] || getWindowPosition('upload'))
          }}
          onMouseDown={(e) => handleWindowMouseDown(e, 'upload')}
        >
          <div 
            className="mac-window-header"
            onDoubleClick={() => handleWindowDoubleClick('upload')}
          >
            <div className="mac-window-controls">
              <div className="mac-close-box" onClick={() => closeWindow('upload')}></div>
            </div>
            <div className="mac-window-icon mac-icon-csv"></div>
            <div className="mac-title">Upload CSV</div>
            <div className="mac-window-spacer"></div>
          </div>
          <div className="mac-window-content p-5">
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
              
              <button 
                className="mac-button"
                onClick={() => {
                  macSounds.playDisk();
                  handleFileUpload();
                }}
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
      )}
      
      {activeWindows.includes('about') && (
        <div 
          key={'about'} 
          className={`mac-popup-window ${maximizedWindows.includes('about') ? 'mac-window-maximized' : ''}`} 
          style={{ 
            zIndex: maxZIndex,
            ...(windowPositions['about'] || getWindowPosition('about'))
          }}
          onMouseDown={(e) => handleWindowMouseDown(e, 'about')}
        >
          <div 
            className="mac-window-header"
            onDoubleClick={() => handleWindowDoubleClick('about')}
          >
            <div className="mac-window-controls">
              <div className="mac-close-box" onClick={() => closeWindow('about')}></div>
            </div>
            <div className="mac-window-icon mac-icon-info"></div>
            <div className="mac-title">About Us</div>
            <div className="mac-window-spacer"></div>
          </div>
          <div className="mac-window-content p-5">
            <div className="flex flex-col items-center">
              <div className="mb-4 w-full text-center">
                <div className="mac-about-logo">CSV DROP</div>
                <p className="mac-about-version">Version 1.0</p>
                <p className="mac-about-copyright">&copy; 2025 CSV DROP, Inc.</p>
              </div>
              
              <div className="mac-about-text w-full text-center">
                <p className="mb-4 text-lg">CSV DROP was created after our founder spent 72 hours straight trying to open a spreadsheet in Windows 95 and swore "there has to be a better way!"</p>
                <p className="text-lg">Turns out, there wasn't... so we made one with all the 90s charm but none of the crashes!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeWindows.includes('socials') && (
        <div 
          key={'socials'} 
          className={`mac-popup-window ${maximizedWindows.includes('socials') ? 'mac-window-maximized' : ''}`} 
          style={{ 
            zIndex: maxZIndex,
            ...(windowPositions['socials'] || getWindowPosition('socials'))
          }}
          onMouseDown={(e) => handleWindowMouseDown(e, 'socials')}
        >
          <div 
            className="mac-window-header"
            onDoubleClick={() => handleWindowDoubleClick('socials')}
          >
            <div className="mac-window-controls">
              <div className="mac-close-box" onClick={() => closeWindow('socials')}></div>
            </div>
            <div className="mac-window-icon mac-icon-globe"></div>
            <div className="mac-title">Socials</div>
            <div className="mac-window-spacer"></div>
          </div>
          <div className="mac-window-content p-5">
            <div className="flex flex-col">
              <div className="mac-list-view w-full mb-4">
                <table className="w-full">
                  <tbody>
                    <tr className="mac-list-item">
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="mac-icon mac-icon-globe mr-2"></div>
                          <span>Website</span>
                        </div>
                      </td>
                      <td className="p-2">www.csvdrop.com</td>
                    </tr>
                    <tr className="mac-list-item">
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="mac-icon mac-icon-mail mr-2"></div>
                          <span>Email</span>
                        </div>
                      </td>
                      <td className="p-2">hello@csvdrop.com</td>
                    </tr>
                    <tr className="mac-list-item">
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="mac-icon mac-icon-chat mr-2"></div>
                          <span>Discord</span>
                        </div>
                      </td>
                      <td className="p-2">discord.gg/csvdrop</td>
                    </tr>
                    <tr className="mac-list-item">
                      <td className="p-2">
                        <div className="flex items-center">
                          <div className="mac-icon mac-icon-x mr-2"></div>
                          <span>Twitter</span>
                        </div>
                      </td>
                      <td className="p-2">@csvdrop</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="mac-button self-center" onClick={() => macSounds.playClick()}>
                Join Our Community
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeWindows.includes('trial') && (
        <div 
          key={'trial'} 
          className={`mac-popup-window ${maximizedWindows.includes('trial') ? 'mac-window-maximized' : ''}`} 
          style={{ 
            zIndex: maxZIndex,
            ...(windowPositions['trial'] || getWindowPosition('trial'))
          }}
          onMouseDown={(e) => handleWindowMouseDown(e, 'trial')}
        >
          <div 
            className="mac-window-header"
            onDoubleClick={() => handleWindowDoubleClick('trial')}
          >
            <div className="mac-window-controls">
              <div className="mac-close-box" onClick={() => closeWindow('trial')}></div>
            </div>
            <div className="mac-window-icon mac-icon-gift"></div>
            <div className="mac-title">Free Trial</div>
            <div className="mac-window-spacer"></div>
          </div>
          <div className="mac-window-content p-5">
            <div className="flex flex-col items-center">
              <div className="mac-icon mac-icon-gift mb-3" style={{width: '48px', height: '48px'}}></div>
              <h3 className="text-xl font-bold mb-3">Create Your Free Account</h3>
              
              <div className="mac-classic-box w-full mb-4 p-3">
                <p className="mb-3">Sign up for your free trial and get:</p>
                <ul className="mb-4 pl-5 list-disc">
                  <li className="mb-1 font-bold">1 FREE CSV file download</li>
                  <li className="mb-1">Basic data analysis</li>
                  <li>Vintage Mac OS experience</li>
                </ul>
                <p className="text-sm">No credit card required!</p>
              </div>
              
              <form onSubmit={handleTrialSubmit} className="w-full mac-form">
                <div className="mb-3">
                  <label className="block mb-1">Your Name:</label>
                  <input
                    type="text"
                    name="name"
                    className="mac-input w-full"
                    value={trialForm.name}
                    onChange={handleTrialInputChange}
                  />
                  {trialFormErrors.name && (
                    <p className="text-red-600 text-sm mt-1">{trialFormErrors.name}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">Email Address:</label>
                  <input
                    type="email"
                    name="email"
                    className="mac-input w-full"
                    value={trialForm.email}
                    onChange={handleTrialInputChange}
                  />
                  {trialFormErrors.email && (
                    <p className="text-red-600 text-sm mt-1">{trialFormErrors.email}</p>
                  )}
                </div>
                
                <div className="flex space-x-3 justify-center">
                  <button 
                    type="submit"
                    className="mac-button mac-button-primary"
                  >
                    Create Free Account
                  </button>
                  <button 
                    type="button"
                    className="mac-button" 
                    onClick={() => {
                      macSounds.playClick();
                      closeWindow('trial');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
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
