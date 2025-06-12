import React, { useState, useRef, useEffect } from 'react';
import useMacSounds from '../hooks/useMacSounds';
import { Link } from 'react-router-dom';
import '../styles/macintosh.css';

interface MacLandingPageProps {
  onShowAuth: () => void;
  onShowPayment: () => void;
}

interface WindowPosition {
  id: string;
  top: number;
  left: number;
  width: number;
  zIndex: number;
}

interface DesktopIconPosition {
  id: string;
  top: number;
  left: number;
  zIndex: number;
}

const MacLandingPage: React.FC<MacLandingPageProps> = ({ onShowAuth, onShowPayment }) => {
  // Initialize Mac sounds
  const { playClick, playError, playSuccess, enabled: soundEnabled } = useMacSounds(true);
  
  const [stepsCompleted, setStepsCompleted] = useState([false, false, false]);
  
  // Toggle step completion for demo purposes
  const toggleStep = (index: number) => {
    const newSteps = [...stepsCompleted];
    newSteps[index] = !newSteps[index];
    setStepsCompleted(newSteps);
  };

  // Window state management
  const [activeWindows, setActiveWindows] = useState<string[]>(['welcome']);
  const [windowPositions, setWindowPositions] = useState<WindowPosition[]>([]);
  
  // Initialize window positions based on screen size
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    setWindowPositions([
      { 
        id: 'welcome', 
        top: isMobile ? 60 : 100, 
        left: isMobile ? window.innerWidth * 0.04 : 100, 
        width: isMobile ? window.innerWidth * 0.92 : 500, 
        zIndex: 10 
      },
      { 
        id: 'help', 
        top: isMobile ? 70 : 120, 
        left: isMobile ? window.innerWidth * 0.04 : 200, 
        width: isMobile ? window.innerWidth * 0.92 : 500, 
        zIndex: 5 
      },
      { 
        id: 'features', 
        top: isMobile ? 80 : 140, 
        left: isMobile ? window.innerWidth * 0.04 : 300, 
        width: isMobile ? window.innerWidth * 0.92 : 700, 
        zIndex: 5 
      },
      { 
        id: 'pricing', 
        top: isMobile ? 90 : 160, 
        left: isMobile ? window.innerWidth * 0.04 : 400, 
        width: isMobile ? window.innerWidth * 0.92 : 600, 
        zIndex: 5 
      },
      { 
        id: 'upload', 
        top: isMobile ? 100 : 180, 
        left: isMobile ? window.innerWidth * 0.04 : 500, 
        width: isMobile ? window.innerWidth * 0.92 : 550, 
        zIndex: 5 
      }
    ]);
    
    // Update window positions on resize
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      
      setWindowPositions((prev: WindowPosition[]) => prev.map((win: WindowPosition) => ({
        ...win,
        top: isMobile ? Math.min(win.top, 90) : win.top,
        left: isMobile ? window.innerWidth * 0.04 : win.left,
        width: isMobile ? window.innerWidth * 0.92 : 
                (win.id === 'welcome' ? 500 :
                 win.id === 'help' ? 500 :
                 win.id === 'features' ? 700 : 
                 win.id === 'pricing' ? 600 : 550)
      })));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [maxZIndex, setMaxZIndex] = useState<number>(10);
  const dragRef = useRef<{
    isDragging: boolean;
    windowId: string | null;
    initialX: number;
    initialY: number;
    initialTop: number;
    initialLeft: number;
  }>({ isDragging: false, windowId: null, initialX: 0, initialY: 0, initialTop: 0, initialLeft: 0 });

  const openWindow = (windowName: string) => {
    // If window is already open, bring to front
    if (activeWindows.includes(windowName)) {
      bringWindowToFront(windowName);
      return;
    }
    
    setActiveWindows(prev => [...prev, windowName]);
    bringWindowToFront(windowName);
  };
  
  const closeWindow = (windowName: string) => {
    setActiveWindows(prev => prev.filter(w => w !== windowName));
  };
  
  const bringWindowToFront = (windowId: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    setWindowPositions(prev => 
      prev.map(pos => pos.id === windowId ? { ...pos, zIndex: newZIndex } : pos)
    );
  };
  
  // Handle window dragging
  const handleMouseDown = (e: React.MouseEvent, windowId: string) => {
    // Only start drag if clicking on the title bar, not on controls
    if ((e.target as HTMLElement).closest('.mac-window-controls')) {
      return;
    }
    
    const windowPos = windowPositions.find(pos => pos.id === windowId);
    if (!windowPos) return;
    
    dragRef.current = {
      isDragging: true,
      windowId,
      initialX: e.clientX,
      initialY: e.clientY,
      initialTop: windowPos.top,
      initialLeft: windowPos.left
    };
    
    bringWindowToFront(windowId);
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    const { isDragging, windowId, initialX, initialY, initialTop, initialLeft } = dragRef.current;
    
    if (isDragging && windowId) {
      const deltaX = e.clientX - initialX;
      const deltaY = e.clientY - initialY;
      
      setWindowPositions(prev => 
        prev.map(pos => 
          pos.id === windowId 
            ? { 
                ...pos, 
                top: initialTop + deltaY, 
                left: initialLeft + deltaX 
              } 
            : pos
        )
      );
    }
  };
  
  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const [desktopIconPositions, setDesktopIconPositions] = useState<DesktopIconPosition[]>([
    { id: 'upload', top: 30, left: 30, zIndex: 5 },
    { id: 'aboutUs', top: 120, left: 30, zIndex: 5 },
    { id: 'socials', top: 210, left: 30, zIndex: 5 },
    { id: 'freeTrial', top: 300, left: 30, zIndex: 5 }
  ]);

  const handleIconMouseDown = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();
    const iconPos = desktopIconPositions.find(pos => pos.id === iconId);
    if (!iconPos) return;

    // Update z-index to bring this icon to the front
    setDesktopIconPositions(prevPositions => {
      const newMaxZ = Math.max(...prevPositions.map(p => p.zIndex)) + 1;
      return prevPositions.map(pos => 
        pos.id === iconId ? {...pos, zIndex: newMaxZ} : pos
      );
    });

    // Set up dragging reference
    dragRef.current = {
      isDragging: true,
      windowId: null,
      initialX: e.clientX,
      initialY: e.clientY,
      initialTop: iconPos.top,
      initialLeft: iconPos.left
    };

    // Add event listeners for icon dragging
    document.addEventListener('mousemove', handleIconMouseMove);
    document.addEventListener('mouseup', handleIconMouseUp);
  };

  const handleIconMouseMove = (e: MouseEvent) => {
    const { isDragging, initialX, initialY, initialTop, initialLeft } = dragRef.current;

    if (isDragging && dragRef.current.windowId === null) {
      const deltaX = e.clientX - initialX;
      const deltaY = e.clientY - initialY;
      
      // Calculate new position
      const newTop = initialTop + deltaY;
      const newLeft = initialLeft + deltaX;

      // Update the desktop icon position
      setDesktopIconPositions((prev: DesktopIconPosition[]) =>
        prev.map((pos: DesktopIconPosition) =>
          pos.top === initialTop && pos.left === initialLeft
            ? { ...pos, top: newTop, left: newLeft }
            : pos
        )
      );
    }
  };

  const handleIconMouseUp = () => {
    if (dragRef.current.isDragging && dragRef.current.windowId === null) {
      dragRef.current.isDragging = false;

      // Remove event listeners
      document.removeEventListener('mousemove', handleIconMouseMove);
      document.removeEventListener('mouseup', handleIconMouseUp);
    }
  };
  
  return (
    <div className="mac-desktop">
      {/* Desktop Icons - Now draggable */}
      <div>
        {desktopIconPositions.map((iconPos) => (
          <div 
            key={iconPos.id}
            className="mac-desktop-icon" 
            style={{
              position: 'absolute',
              top: iconPos.top,
              left: iconPos.left,
              zIndex: iconPos.zIndex
            }}
            onMouseDown={(e) => handleIconMouseDown(e, iconPos.id)}
            onClick={() => {
              playClick();
              openWindow(iconPos.id);
            }}
          >
            {iconPos.id === 'aboutUs' && (
              <>
                <div className="mac-desktop-icon-img">
                  <span role="img" aria-label="aboutUs">👥</span>
                </div>
                <span className="mac-desktop-icon-label">About Us</span>
              </>
            )}
            
            {iconPos.id === 'socials' && (
              <>
                <div className="mac-desktop-icon-img">
                  <span role="img" aria-label="socials">📱</span>
                </div>
                <span className="mac-desktop-icon-label">Socials</span>
              </>
            )}
            
            {iconPos.id === 'freeTrial' && (
              <>
                <div className="mac-desktop-icon-img">
                  <span role="img" aria-label="freeTrial">🎁</span>
                </div>
                <span className="mac-desktop-icon-label">Free Trial</span>
              </>
            )}
            
            {iconPos.id === 'upload' && (
              <>
                <div className="mac-desktop-icon-img">
                  <span role="img" aria-label="upload">💾</span>
                </div>
                <span className="mac-desktop-icon-label">Upload CSV</span>
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Desktop Windows - shown when clicking icons */}
      {activeWindows.includes('help') && (
        <div 
          className="mac-desktop-window" 
          style={{
            top: `${windowPositions.find((w: WindowPosition) => w.id === 'help')?.top}px`,
            left: `${windowPositions.find((w: WindowPosition) => w.id === 'help')?.left}px`,
            width: `${windowPositions.find((w: WindowPosition) => w.id === 'help')?.width}px`,
            zIndex: windowPositions.find((w: WindowPosition) => w.id === 'help')?.zIndex
          }}
        >
          <div 
            className="mac-window-title flex items-center justify-between cursor-move"
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, 'help')}
          >
            <div className="mac-window-controls">
              <div className="mac-window-control mac-window-close" onClick={() => closeWindow('help')}></div>
              <div className="mac-window-control mac-window-minimize"></div>
              <div className="mac-window-control mac-window-expand"></div>
            </div>
            <div className="flex-grow text-center">How to Use CSV DROP</div>
            <div className="w-16"></div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center cursor-pointer" onClick={() => toggleStep(0)}>
                <div className={`retro-checkbox ${stepsCompleted[0] ? 'checked' : ''}`}></div>
                <span className="ml-2">Upload: Drag your files into the drop zone</span>
              </div>
              <div className="flex items-center cursor-pointer" onClick={() => toggleStep(1)}>
                <div className={`retro-checkbox ${stepsCompleted[1] ? 'checked' : ''}`}></div>
                <span className="ml-2">Configure: AI maps columns, removes duplicates</span>
              </div>
              <div className="flex items-center cursor-pointer" onClick={() => toggleStep(2)}>
                <div className={`retro-checkbox ${stepsCompleted[2] ? 'checked' : ''}`}></div>
                <span className="ml-2">Download: Instantly get your cleaned dataset</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeWindows.includes('features') && (
        <div 
          className="mac-desktop-window" 
          style={{
            top: `${windowPositions.find((w: WindowPosition) => w.id === 'features')?.top}px`,
            left: `${windowPositions.find((w: WindowPosition) => w.id === 'features')?.left}px`,
            width: `${windowPositions.find((w: WindowPosition) => w.id === 'features')?.width}px`,
            zIndex: windowPositions.find((w: WindowPosition) => w.id === 'features')?.zIndex
          }}
        >
          <div 
            className="mac-window-title flex items-center justify-between cursor-move"
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, 'features')}
          >
            <div className="mac-window-controls">
              <div className="mac-window-control mac-window-close" onClick={() => closeWindow('features')}></div>
              <div className="mac-window-control mac-window-minimize"></div>
              <div className="mac-window-control mac-window-expand"></div>
            </div>
            <div className="flex-grow text-center">Features</div>
            <div className="w-16"></div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'AI Mapping', icon: '🧠', desc: 'Intelligent column mapping with AI' },
                { name: 'Smart Deduplication', icon: '🧹', desc: 'Removes duplicate records automatically' },
                { name: 'Lightning Speed', icon: '⚡', desc: 'Process files in seconds, not minutes' },
                { name: 'Zero Trust Security', icon: '🔒', desc: 'Your data never leaves your computer' },
                { name: 'Real-Time Insights', icon: '📊', desc: 'See data patterns and anomalies' },
                { name: 'Team Collaboration', icon: '👥', desc: 'Share projects with your team' }
              ].map((feature, index) => (
                <div key={index} className="retro-panel">
                  <div className="retro-panel-title">{feature.name}</div>
                  <div className="p-3 text-center">
                    <span className="retro-feature-icon">{feature.icon}</span>
                    <p className="text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeWindows.includes('pricing') && (
        <div 
          className="mac-desktop-window" 
          style={{
            top: `${windowPositions.find((w: WindowPosition) => w.id === 'pricing')?.top}px`,
            left: `${windowPositions.find((w: WindowPosition) => w.id === 'pricing')?.left}px`,
            width: `${windowPositions.find((w: WindowPosition) => w.id === 'pricing')?.width}px`,
            zIndex: windowPositions.find((w: WindowPosition) => w.id === 'pricing')?.zIndex
          }}
        >
          <div 
            className="mac-window-title flex items-center justify-between cursor-move"
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, 'pricing')}
          >
            <div className="mac-window-controls">
              <div className="mac-window-control mac-window-close" onClick={() => closeWindow('pricing')}></div>
              <div className="mac-window-control mac-window-minimize"></div>
              <div className="mac-window-control mac-window-expand"></div>
            </div>
            <div className="flex-grow text-center">Pricing</div>
            <div className="w-16"></div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Starter', price: 'Free', features: ['5 Files/Month', 'Basic AI', 'Email Support'] },
                { name: 'Professional', price: '$9.99/mo', features: ['Unlimited Files', 'Advanced AI', 'Priority Support', 'Team Access'] },
                { name: 'One-Time', price: '$2.99', features: ['Single File', 'Full Features', 'No Subscription'] }
              ].map((plan, index) => (
                <div key={index} className="retro-price-card">
                  <div className="retro-price-title">{plan.name}</div>
                  <div className="retro-price-amount">{plan.price}</div>
                  <ul className="text-left mb-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="mb-2">
                        <span className="retro-checkmark">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    className="retro-gradient-btn w-full"
                    onClick={index === 0 ? onShowAuth : onShowPayment}
                  >
                    [ Get Started ]
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeWindows.includes('upload') && (
        <div 
          className="mac-desktop-window" 
          style={{
            top: `${windowPositions.find((w: WindowPosition) => w.id === 'upload')?.top}px`,
            left: `${windowPositions.find((w: WindowPosition) => w.id === 'upload')?.left}px`,
            width: `${windowPositions.find((w: WindowPosition) => w.id === 'upload')?.width}px`,
            zIndex: windowPositions.find((w: WindowPosition) => w.id === 'upload')?.zIndex
          }}
        >
          <div 
            className="mac-window-title flex items-center justify-between cursor-move"
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, 'upload')}
          >
            <div className="mac-window-controls">
              <div className="mac-window-control mac-window-close" onClick={() => closeWindow('upload')}></div>
              <div className="mac-window-control mac-window-minimize"></div>
              <div className="mac-window-control mac-window-expand"></div>
            </div>
            <div className="flex-grow text-center">Upload CSV</div>
            <div className="w-16"></div>
          </div>
          <div className="p-5 text-center">
            <div className="border-2 border-dashed border-gray-400 rounded p-10 mb-4">
              <div className="text-3xl mb-2">📤</div>
              <p>Drag and drop CSV files here<br />or click to browse</p>
            </div>
            <button 
              className="retro-gradient-btn px-6 py-2 mt-4"
              onClick={onShowAuth}
            >
              [ Start Processing → ]
            </button>
          </div>
        </div>
      )}
      
      {activeWindows.includes('welcome') && (
        <div 
          className="mac-desktop-window" 
          style={{
            top: `${windowPositions.find((w: WindowPosition) => w.id === 'welcome')?.top}px`,
            left: `${windowPositions.find((w: WindowPosition) => w.id === 'welcome')?.left}px`,
            width: `${windowPositions.find((w: WindowPosition) => w.id === 'welcome')?.width}px`,
            zIndex: windowPositions.find((w: WindowPosition) => w.id === 'welcome')?.zIndex
          }}
        >
          <div 
            className="mac-window-title flex items-center justify-between cursor-move"
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, 'welcome')}
          >
            <div className="mac-window-controls">
              <div className="mac-window-control mac-window-close" onClick={() => closeWindow('welcome')}></div>
              <div className="mac-window-control mac-window-minimize"></div>
              <div className="mac-window-control mac-window-expand"></div>
            </div>
            <div className="flex-grow text-center">Welcome to CSV DROP</div>
            <div className="w-16"></div>
          </div>
          <div className="p-6 text-center">
            <div className="text-center mb-2">
              <div className="retro-terminal-text mx-auto w-full mb-3">
                Your 90s file manager just got a modern upgrade.
              </div>
            </div>
            
            <p className="mb-6">Click on the desktop icons to explore features or use the dock at the bottom.</p>
            
            <button 
              className="retro-gradient-btn px-8 py-2 mx-auto"
              onClick={() => {
                playClick(); // Play click sound
                closeWindow('welcome');
                onShowAuth(); // Start the authentication flow
              }}
            >
              [ Drop that csv like its hot ]
            </button>
          </div>
        </div>
      )}
      
      {/* Mac Dock - positioned higher to avoid covering footer */}
      <div className="mac-dock" style={{ bottom: '60px' }}>
        <div className="mac-dock-icon" data-name="Home" onClick={() => {}}>
          <span role="img" aria-label="home">🏠</span>
        </div>
        <div className="mac-dock-icon" data-name="Upload" onClick={() => openWindow('upload')}>
          <span role="img" aria-label="upload">💾</span>
        </div>
        <div className="mac-dock-icon" data-name="Features" onClick={() => openWindow('features')}>
          <span role="img" aria-label="features">⚙️</span>
        </div>
        <div className="mac-dock-icon" data-name="How It Works" onClick={() => openWindow('help')}>
          <span role="img" aria-label="help">❓</span>
        </div>
        <div className="mac-dock-icon" data-name="Pricing" onClick={() => openWindow('pricing')}>
          <span role="img" aria-label="pricing">💰</span>
        </div>
        <div className="mac-dock-icon" data-name="Sign Up" onClick={onShowAuth}>
          <span role="img" aria-label="signup">👤</span>
        </div>
        <div className="mac-dock-icon" data-name="Trash" onClick={() => {}}>
          <span role="img" aria-label="trash">🗑️</span>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 text-center py-1 bg-black bg-opacity-70">
        <div className="text-white text-sm">
          <Link to="/privacy" className="hover:underline mr-4">Privacy Policy</Link>
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

export default MacLandingPage;
