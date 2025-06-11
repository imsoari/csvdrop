import React, { useState, useRef, useEffect } from 'react';
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

const MacLandingPage: React.FC<MacLandingPageProps> = ({ onShowAuth, onShowPayment }) => {
  const [stepsCompleted, setStepsCompleted] = useState([false, false, false]);
  
  // Toggle step completion for demo purposes
  const toggleStep = (index: number) => {
    const newSteps = [...stepsCompleted];
    newSteps[index] = !newSteps[index];
    setStepsCompleted(newSteps);
  };

  // Window state management
  const [activeWindows, setActiveWindows] = useState<string[]>(['welcome']);
  const [windowPositions, setWindowPositions] = useState<WindowPosition[]>([
    { id: 'welcome', top: window.innerHeight / 2 - 150, left: window.innerWidth / 2 - 225, width: 450, zIndex: 10 },
    { id: 'help', top: 80, left: 100, width: 500, zIndex: 5 },
    { id: 'features', top: 100, left: 150, width: 700, zIndex: 5 },
    { id: 'pricing', top: 120, left: 200, width: 600, zIndex: 5 },
    { id: 'upload', top: 90, left: 120, width: 550, zIndex: 5 }
  ]);
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
  
  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  return (
    <div className="mac-desktop">
      {/* Desktop Icons */}
      <div className="mac-desktop-icons">
        <div className="mac-desktop-icon" onClick={() => openWindow('upload')}>
          <div className="mac-desktop-icon-img">
            <span role="img" aria-label="upload">💾</span>
          </div>
          <span className="mac-desktop-icon-label">Upload CSV</span>
        </div>
        
        <div className="mac-desktop-icon" onClick={() => openWindow('features')}>
          <div className="mac-desktop-icon-img">
            <span role="img" aria-label="features">⚙️</span>
          </div>
          <span className="mac-desktop-icon-label">Features</span>
        </div>
        
        <div className="mac-desktop-icon" onClick={() => openWindow('pricing')}>
          <div className="mac-desktop-icon-img">
            <span role="img" aria-label="pricing">💰</span>
          </div>
          <span className="mac-desktop-icon-label">Pricing</span>
        </div>
        
        <div className="mac-desktop-icon" onClick={onShowAuth}>
          <div className="mac-desktop-icon-img">
            <span role="img" aria-label="signup">👤</span>
          </div>
          <span className="mac-desktop-icon-label">Sign Up</span>
        </div>
      </div>
      
      {/* Desktop Windows - shown when clicking icons */}
      {activeWindows.includes('help') && (
        <div 
          className="mac-desktop-window" 
          style={{
            top: `${windowPositions.find(w => w.id === 'help')?.top}px`,
            left: `${windowPositions.find(w => w.id === 'help')?.left}px`,
            width: `${windowPositions.find(w => w.id === 'help')?.width}px`,
            zIndex: windowPositions.find(w => w.id === 'help')?.zIndex
          }}
        >
          <div 
            className="mac-window-title flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, 'help')}
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
            top: `${windowPositions.find(w => w.id === 'features')?.top}px`,
            left: `${windowPositions.find(w => w.id === 'features')?.left}px`,
            width: `${windowPositions.find(w => w.id === 'features')?.width}px`,
            zIndex: windowPositions.find(w => w.id === 'features')?.zIndex
          }}
        >
          <div 
            className="mac-window-title flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, 'features')}
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
            top: `${windowPositions.find(w => w.id === 'pricing')?.top}px`,
            left: `${windowPositions.find(w => w.id === 'pricing')?.left}px`,
            width: `${windowPositions.find(w => w.id === 'pricing')?.width}px`,
            zIndex: windowPositions.find(w => w.id === 'pricing')?.zIndex
          }}
        >
          <div 
            className="mac-window-title flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, 'pricing')}
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
            top: `${windowPositions.find(w => w.id === 'upload')?.top}px`,
            left: `${windowPositions.find(w => w.id === 'upload')?.left}px`,
            width: `${windowPositions.find(w => w.id === 'upload')?.width}px`,
            zIndex: windowPositions.find(w => w.id === 'upload')?.zIndex
          }}
        >
          <div 
            className="mac-window-title flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, 'upload')}
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
            top: `${windowPositions.find(w => w.id === 'welcome')?.top}px`,
            left: `${windowPositions.find(w => w.id === 'welcome')?.left}px`,
            width: `${windowPositions.find(w => w.id === 'welcome')?.width}px`,
            zIndex: windowPositions.find(w => w.id === 'welcome')?.zIndex
          }}
        >
          <div 
            className="mac-window-title flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, 'welcome')}
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
              onClick={() => closeWindow('welcome')}
            >
              [ Start Exploring ]
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
