import React, { useState, useEffect } from 'react';
import { 
  User, 
  Download, 
  Settings, 
  Crown, 
  FileText, 
  Calendar, 
  Mail, 
  LogOut,
  Edit3,
  Check,
  X,
  TrendingUp,
  Clock,
  Archive,
  ChevronRight,
  Zap,
  Upload,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useSubscription } from '../hooks/useSubscription';
import { useStripe } from '../hooks/useStripe';
import { useDownloadHistory } from '../hooks/useDownloadHistory';

interface DashboardProps {
  onLogout: () => void;
  onStartProcessing?: () => void; // New prop to handle navigation to processing
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onStartProcessing }) => {
  const { logout } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { createPortalSession, loading: stripeLoading } = useStripe();
  const { downloads, loading: historyLoading } = useDownloadHistory();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'downloads' | 'billing'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        firstName: editForm.firstName,
        lastName: editForm.lastName
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleManageBilling = async () => {
    try {
      await createPortalSession();
    } catch (error) {
      console.error('Failed to open billing portal:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return { type: 'free', status: 'active' };
    return {
      type: subscription.type,
      status: subscription.status,
      downloadCount: subscription.download_count,
      singleDownloadUsed: subscription.single_download_used
    };
  };

  const subscriptionStatus = getSubscriptionStatus();

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: TrendingUp, gradient: 'from-cyan-500 to-blue-600' },
    { id: 'profile', label: 'PROFILE', icon: User, gradient: 'from-purple-500 to-pink-600' },
    { id: 'downloads', label: 'DOWNLOADS', icon: Download, gradient: 'from-emerald-500 to-teal-600' },
    { id: 'billing', label: 'BILLING', icon: Crown, gradient: 'from-orange-500 to-red-600' }
  ];

  if (profileLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-black/20 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-white/10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto mb-6"></div>
          <p className="text-white font-light text-xl">LOADING DASHBOARD...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-40"
             style={{
               background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
               boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.3)'
             }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tighter">
                    DASHBOARD
                  </h1>
                  <p className="text-white/70 font-light">Welcome back, {profile?.first_name}!</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-2xl hover:bg-white/20 rounded-2xl transition-all duration-300 text-white font-bold border border-white/20"
              >
                <LogOut className="w-5 h-5" />
                SIGN OUT
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-black/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                     boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                   }}>
                <div className="p-8">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-xl">
                        {profile?.first_name} {profile?.last_name}
                      </h3>
                      <p className="text-white/70 font-light">{profile?.email}</p>
                    </div>
                  </div>

                  <nav className="space-y-3">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as 'overview' | 'profile' | 'downloads' | 'billing')}
                          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 text-left group ${
                            activeTab === tab.id
                              ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl transform scale-105`
                              : 'text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                          style={activeTab === tab.id ? {
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                          } : {}}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="font-black tracking-wider">{tab.label}</span>
                          <ChevronRight className={`w-5 h-5 ml-auto transition-transform ${activeTab === tab.id ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div className="space-y-12">
                  {/* Quick Actions Section */}
                  <div className="bg-black/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                       style={{
                         background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                       }}>
                    <div className="px-8 py-6 border-b border-white/10">
                      <h3 className="text-2xl font-black text-white flex items-center gap-4">
                        <Zap className="w-8 h-8 text-cyan-400" />
                        QUICK ACTIONS
                      </h3>
                    </div>
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Upload CSV Files Widget */}
                        <button
                          onClick={onStartProcessing}
                          className="group p-8 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-2xl rounded-3xl border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-500 transform hover:scale-105 shadow-2xl"
                          style={{
                            background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(147,51,234,0.2) 100%)',
                            boxShadow: '0 20px 40px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                          }}
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                              <Upload className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-left flex-1">
                              <h4 className="text-xl font-black text-white mb-2 tracking-wider">UPLOAD CSV FILES</h4>
                              <p className="text-white/70 font-light">Start processing your CSV files</p>
                            </div>
                            <ArrowRight className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </button>

                        {/* Manage Subscription Widget */}
                        <button
                          onClick={subscriptionStatus.type === 'pro' ? handleManageBilling : () => {}}
                          disabled={subscriptionStatus.type !== 'pro'}
                          className={`group p-8 backdrop-blur-2xl rounded-3xl border transition-all duration-500 transform hover:scale-105 shadow-2xl ${
                            subscriptionStatus.type === 'pro' 
                              ? 'bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-400/30 hover:border-purple-400/50'
                              : 'bg-white/5 border-white/20 cursor-not-allowed opacity-60'
                          }`}
                          style={subscriptionStatus.type === 'pro' ? {
                            background: 'linear-gradient(135deg, rgba(147,51,234,0.2) 0%, rgba(219,39,119,0.2) 100%)',
                            boxShadow: '0 20px 40px rgba(147,51,234,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                          } : {}}
                        >
                          <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
                              subscriptionStatus.type === 'pro' 
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 group-hover:scale-110'
                                : 'bg-white/10'
                            }`}>
                              <Crown className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-left flex-1">
                              <h4 className="text-xl font-black text-white mb-2 tracking-wider">
                                {subscriptionStatus.type === 'pro' ? 'MANAGE SUBSCRIPTION' : 'UPGRADE PLAN'}
                              </h4>
                              <p className="text-white/70 font-light">
                                {subscriptionStatus.type === 'pro' 
                                  ? 'Billing and subscription settings'
                                  : 'Unlock unlimited downloads'
                                }
                              </p>
                            </div>
                            {subscriptionStatus.type === 'pro' && (
                              <ArrowRight className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-br from-blue-600/30 to-indigo-700/30 backdrop-blur-2xl rounded-3xl p-8 text-white shadow-2xl border border-blue-400/30"
                         style={{
                           background: 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(67,56,202,0.3) 100%)',
                           boxShadow: '0 25px 50px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                         }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-200 text-sm font-light uppercase tracking-wider">SUBSCRIPTION</p>
                          <p className="text-3xl font-black capitalize">{subscriptionStatus.type}</p>
                        </div>
                        <Crown className="w-12 h-12 text-blue-300" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600/30 to-teal-700/30 backdrop-blur-2xl rounded-3xl p-8 text-white shadow-2xl border border-emerald-400/30"
                         style={{
                           background: 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(15,118,110,0.3) 100%)',
                           boxShadow: '0 25px 50px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                         }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-200 text-sm font-light uppercase tracking-wider">DOWNLOADS</p>
                          <p className="text-3xl font-black">{subscriptionStatus.downloadCount || 0}</p>
                        </div>
                        <Download className="w-12 h-12 text-emerald-300" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600/30 to-pink-700/30 backdrop-blur-2xl rounded-3xl p-8 text-white shadow-2xl border border-purple-400/30"
                         style={{
                           background: 'linear-gradient(135deg, rgba(147,51,234,0.3) 0%, rgba(190,24,93,0.3) 100%)',
                           boxShadow: '0 25px 50px rgba(147,51,234,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                         }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-200 text-sm font-light uppercase tracking-wider">FILES PROCESSED</p>
                          <p className="text-3xl font-black text-white">{downloads.length}</p>
                        </div>
                        <FileText className="w-12 h-12 text-purple-300" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-black/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                       style={{
                         background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                       }}>
                    <div className="px-8 py-6 border-b border-white/10">
                      <h3 className="text-2xl font-black text-white flex items-center gap-4">
                        <Clock className="w-8 h-8 text-cyan-400" />
                        RECENT ACTIVITY
                      </h3>
                    </div>
                    <div className="p-8">
                      {downloads.length > 0 ? (
                        <div className="space-y-6">
                          {downloads.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-6 p-6 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                                 style={{
                                   background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                                   boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.2)'
                                 }}>
                              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                <Download className="w-8 h-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-black text-white text-lg">{item.file_name}</p>
                                <p className="text-white/70 font-light">
                                  {item.row_count.toLocaleString()} rows • {formatFileSize(item.file_size)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-white/70 font-light text-sm">{formatDate(item.created_at)}</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                  item.download_type === 'pro' 
                                    ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50'
                                    : item.download_type === 'single'
                                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50'
                                    : 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                                }`}>
                                  {item.download_type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <Archive className="w-20 h-20 text-white/30 mx-auto mb-6" />
                          <p className="text-white/70 font-light text-xl">NO RECENT ACTIVITY</p>
                          <p className="text-white/50 font-light mt-2">Upload some CSV files to get started</p>
                          <button
                            onClick={onStartProcessing}
                            className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-bold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg transform hover:scale-105"
                          >
                            START PROCESSING
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-black/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                     style={{
                       background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                       boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                     }}>
                  <div className="px-8 py-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-white flex items-center gap-4">
                        <User className="w-8 h-8 text-purple-400" />
                        PROFILE INFORMATION
                      </h3>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-3 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-2xl transition-all duration-300 font-bold border border-purple-400/50"
                        >
                          <Edit3 className="w-5 h-5" />
                          EDIT
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {isEditing ? (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-black text-white/80 mb-3 uppercase tracking-wider">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={editForm.firstName}
                              onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                              className="w-full px-6 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white font-light"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-black text-white/80 mb-3 uppercase tracking-wider">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={editForm.lastName}
                              onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                              className="w-full px-6 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white font-light"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-black text-white/80 mb-3 uppercase tracking-wider">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-6 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-white font-light"
                          />
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={handleSaveProfile}
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-black"
                          >
                            <Check className="w-5 h-5" />
                            SAVE CHANGES
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-2xl hover:bg-white/20 text-white rounded-2xl transition-all duration-300 font-bold border border-white/20"
                          >
                            <X className="w-5 h-5" />
                            CANCEL
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-6 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10">
                            <label className="block text-sm font-black text-white/60 mb-2 uppercase tracking-wider">First Name</label>
                            <p className="text-2xl font-black text-white">{profile?.first_name}</p>
                          </div>
                          <div className="p-6 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10">
                            <label className="block text-sm font-black text-white/60 mb-2 uppercase tracking-wider">Last Name</label>
                            <p className="text-2xl font-black text-white">{profile?.last_name}</p>
                          </div>
                        </div>
                        
                        <div className="p-6 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10">
                          <label className="block text-sm font-black text-white/60 mb-2 uppercase tracking-wider">Email Address</label>
                          <div className="flex items-center gap-3">
                            <Mail className="w-6 h-6 text-white/60" />
                            <p className="text-2xl font-black text-white">{profile?.email}</p>
                          </div>
                        </div>

                        <div className="p-6 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10">
                          <label className="block text-sm font-black text-white/60 mb-2 uppercase tracking-wider">Member Since</label>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-white/60" />
                            <p className="text-2xl font-black text-white">
                              {profile?.created_at ? formatDate(profile.created_at) : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'downloads' && (
                <div className="bg-black/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                     style={{
                       background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                       boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                     }}>
                  <div className="px-8 py-6 border-b border-white/10">
                    <h3 className="text-2xl font-black text-white flex items-center gap-4">
                      <Download className="w-8 h-8 text-emerald-400" />
                      DOWNLOAD HISTORY
                    </h3>
                  </div>
                  
                  <div className="p-8">
                    {historyLoading ? (
                      <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-3 border-white border-t-transparent"></div>
                        <p className="text-white/70 font-light">LOADING DOWNLOAD HISTORY...</p>
                      </div>
                    ) : downloads.length > 0 ? (
                      <div className="space-y-6">
                        {downloads.map((item) => (
                          <div key={item.id} className="p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                               style={{
                                 background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                                 boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.2)'
                               }}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                  <FileText className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-black text-white text-xl mb-3">{item.file_name}</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-white/70 font-light">
                                    <div>
                                      <span className="font-black">ROWS:</span> {item.row_count.toLocaleString()}
                                    </div>
                                    <div>
                                      <span className="font-black">COLUMNS:</span> {item.column_count}
                                    </div>
                                    <div>
                                      <span className="font-black">SIZE:</span> {formatFileSize(item.file_size)}
                                    </div>
                                    <div>
                                      <span className="font-black">TICKET:</span> #{item.ticket_number}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white/70 font-light mb-3">{formatDate(item.created_at)}</p>
                                <span className={`inline-block px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${
                                  item.download_type === 'pro' 
                                    ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50'
                                    : item.download_type === 'single'
                                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50'
                                    : 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                                }`}>
                                  {item.download_type}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20">
                        <Archive className="w-24 h-24 text-white/30 mx-auto mb-8" />
                        <h4 className="text-2xl font-black text-white mb-4">NO DOWNLOADS YET</h4>
                        <p className="text-white/70 font-light text-lg mb-8">Your download history will appear here once you start using CSVDROP.</p>
                        <button
                          onClick={onStartProcessing}
                          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-bold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg transform hover:scale-105"
                        >
                          START PROCESSING
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="bg-black/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                     style={{
                       background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                       boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                     }}>
                  <div className="px-8 py-6 border-b border-white/10">
                    <h3 className="text-2xl font-black text-white flex items-center gap-4">
                      <Crown className="w-8 h-8 text-orange-400" />
                      BILLING & SUBSCRIPTION
                    </h3>
                  </div>
                  
                  <div className="p-8 space-y-8">
                    {/* Current Plan */}
                    <div className={`p-8 backdrop-blur-2xl rounded-3xl border shadow-2xl ${
                      subscriptionStatus.type === 'pro' 
                        ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-400/50'
                        : subscriptionStatus.type === 'single'
                        ? 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border-emerald-400/50'
                        : 'bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border-blue-400/50'
                    }`}
                         style={{
                           background: subscriptionStatus.type === 'pro' 
                             ? 'linear-gradient(135deg, rgba(147,51,234,0.3) 0%, rgba(219,39,119,0.3) 100%)'
                             : subscriptionStatus.type === 'single'
                             ? 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(13,148,136,0.3) 100%)'
                             : 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(67,56,202,0.3) 100%)',
                           boxShadow: '0 25px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                         }}>
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h4 className="text-3xl font-black text-white capitalize mb-2">
                            {subscriptionStatus.type} PLAN
                          </h4>
                          <p className="text-white/80 font-light">
                            Status: <span className="font-black capitalize">{subscriptionStatus.status}</span>
                          </p>
                        </div>
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl ${
                          subscriptionStatus.type === 'pro' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                            : subscriptionStatus.type === 'single'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}>
                          <Crown className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30">
                          <p className="text-4xl font-black text-white">{subscriptionStatus.downloadCount || 0}</p>
                          <p className="text-sm text-white/80 font-light uppercase tracking-wider">Downloads Used</p>
                        </div>
                        <div className="text-center p-6 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30">
                          <p className="text-4xl font-black text-white">
                            {subscriptionStatus.type === 'pro' ? '∞' : subscriptionStatus.type === 'single' ? '1' : '1'}
                          </p>
                          <p className="text-sm text-white/80 font-light uppercase tracking-wider">Downloads Available</p>
                        </div>
                        <div className="text-center p-6 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30">
                          <p className="text-4xl font-black text-white">
                            {subscriptionStatus.type === 'pro' ? '$9.99' : subscriptionStatus.type === 'single' ? '$2.99' : 'FREE'}
                          </p>
                          <p className="text-sm text-white/80 font-light uppercase tracking-wider">
                            {subscriptionStatus.type === 'pro' ? 'per month' : subscriptionStatus.type === 'single' ? 'one-time' : 'plan'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Billing Actions */}
                    <div className="space-y-6">
                      {subscriptionStatus.type === 'pro' && (
                        <button
                          onClick={handleManageBilling}
                          disabled={stripeLoading}
                          className="w-full flex items-center justify-center gap-4 px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-3xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 disabled:opacity-50 font-black text-xl"
                        >
                          {stripeLoading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent"></div>
                          ) : (
                            <>
                              <Settings className="w-8 h-8" />
                              MANAGE SUBSCRIPTION
                            </>
                          )}
                        </button>
                      )}
                      
                      {subscriptionStatus.type === 'free' && (
                        <div className="text-center p-10 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 backdrop-blur-2xl rounded-3xl border border-blue-400/50"
                             style={{
                               background: 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(67,56,202,0.3) 100%)',
                               boxShadow: '0 25px 50px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                             }}>
                          <Crown className="w-20 h-20 text-blue-300 mx-auto mb-6" />
                          <h4 className="text-3xl font-black text-white mb-4">UPGRADE TO PRO</h4>
                          <p className="text-white/80 mb-8 font-light text-lg">Get unlimited downloads and priority processing</p>
                          <button className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-black text-lg">
                            UPGRADE NOW
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;