import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, FileText, Crown, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useSubscription } from '../hooks/useSubscription';
import ShareButton from './ShareButton';

interface NavbarProps {
  onDashboardClick: () => void;
  onAuthClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onDashboardClick, onAuthClick }) => {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const { subscription } = useSubscription();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getSubscriptionInfo = () => {
    if (!subscription) return null;
    
    const badgeConfig = {
      pro: { 
        text: 'PRO', 
        icon: Crown,
        color: 'bg-csv-gradient text-black'
      },
      single: { 
        text: 'PAID', 
        icon: Crown,
        color: 'bg-csv-gradient text-black'
      }
    };
    
    return badgeConfig[subscription.type as keyof typeof badgeConfig];
  };

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const subscriptionInfo = getSubscriptionInfo();

  return (
    <nav className="bg-black/20 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-40"
         style={{
           background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
           boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.3)'
         }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-csv-gradient rounded-xl flex items-center justify-center shadow-2xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-monument font-black text-white tracking-tighter">
                CSVDROP
              </h1>
              <p className="text-xs text-white/60 hidden sm:block font-medium uppercase tracking-wider">CSV PROCESSING PLATFORM</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            
            {/* Share Button */}
            <ShareButton />

            {user ? (
              <div className="relative" ref={menuRef}>
                {/* User Button */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 transition-all duration-300 shadow-2xl hover:shadow-white/10 transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-csv-gradient rounded-xl flex items-center justify-center shadow-2xl text-white font-black text-sm">
                      {getUserInitials()}
                    </div>
                  </div>
                  
                  {/* Subscription Badge */}
                  {subscriptionInfo && (
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black ${subscriptionInfo.color} shadow-2xl`}>
                      <subscriptionInfo.icon className="w-4 h-4" />
                      {subscriptionInfo.text}
                    </span>
                  )}

                  {/* Dropdown Arrow */}
                  <ChevronDown className={`w-5 h-5 text-white/70 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-4 w-80 bg-black/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 py-4 z-50"
                       style={{
                         background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.5)'
                       }}>
                    
                    {/* User Info Header */}
                    <div className="px-8 py-6 border-b border-white/10">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-csv-gradient rounded-2xl flex items-center justify-center shadow-2xl text-white font-black text-lg">
                            {getUserInitials()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-white text-lg">
                            {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-sm text-white/60 font-light">{user?.email}</p>
                          <div className="flex items-center gap-3 mt-3">
                            {subscriptionInfo && (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${subscriptionInfo.color}`}>
                                <subscriptionInfo.icon className="w-3 h-3" />
                                {subscriptionInfo.text}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-4">
                      <button
                        onClick={() => {
                          onDashboardClick();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-6 px-8 py-4 hover:bg-white/10 transition-all duration-300 text-left"
                      >
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/20">
                          <Settings className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-black text-white">DASHBOARD</p>
                          <p className="text-xs text-white/60 font-light">Manage your account</p>
                        </div>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-6 px-8 py-4 hover:bg-red-500/20 transition-all duration-300 text-left"
                      >
                        <div className="w-12 h-12 bg-red-500/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-red-500/30">
                          <LogOut className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="font-black text-red-400">SIGN OUT</p>
                          <p className="text-xs text-red-400/60 font-light">End your session</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-black hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                  boxShadow: '0 10px 30px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">SIGN IN</span>
                <span className="sm:hidden">LOGIN</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;