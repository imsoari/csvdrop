import React, { useState } from 'react';
import { Upload, Download, Settings, Sparkles, CheckCircle, AlertCircle, Crown, Zap, BarChart3, Layers } from 'lucide-react';
import { CSVFile, CSVProcessor, ConsolidationOptions, ConsolidationResult } from '../utils/csvProcessor';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useSubscription } from '../hooks/useSubscription';
import { useDownloadHistory } from '../hooks/useDownloadHistory';
import { analytics } from '../lib/analytics';

// Components
import Navbar from './Navbar';
import Footer from './Footer';
import Dashboard from './Dashboard';
import ConsolidationSettings from './ConsolidationSettings';
import DataPointSelector from './DataPointSelector';
import ProcessingStats from './ProcessingStats';
import SubscriptionBanner from './SubscriptionBanner';

interface UserDashboardProps {
  onShowPayment: () => void;
  onShowDownloadTicket: (data: {
    fileName: string;
    rowCount: number;
    columnCount: number;
    downloadType: 'free' | 'pro' | 'single';
    ticketNumber: string;
  }) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onShowPayment, onShowDownloadTicket }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { subscription, canDownload, incrementDownloadCount, markSingleDownloadUsed } = useSubscription();
  const { addDownload } = useDownloadHistory();

  // Dashboard state
  const [showDashboard, setShowDashboard] = useState(false);

  // File processing state
  const [files, setFiles] = useState<CSVFile[]>([]);
  const [consolidationOptions, setConsolidationOptions] = useState<ConsolidationOptions>({
    method: 'merge',
    removeDuplicates: false,
    headerHandling: 'all',
    sortBy: undefined,
    sortOrder: 'asc',
    filterEmpty: false,
    dataPointSelection: {
      enabled: false,
      selectedPoints: [],
      mappings: {}
    }
  });
  const [consolidatedData, setConsolidatedData] = useState<ConsolidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const handleFileUpload = (uploadedFiles: FileList) => {
    const fileArray = Array.from(uploadedFiles);
    const { valid, invalid } = CSVProcessor.validateFiles(fileArray);

    if (invalid.length > 0) {
      const errorMessages = invalid.map(({ file, reason }) => `${file.name}: ${reason}`);
      setProcessingError(`Invalid files:\n${errorMessages.join('\n')}`);
      return;
    }

    if (valid.length > 3) {
      setProcessingError('Maximum 3 files allowed. Please select fewer files.');
      return;
    }

    setProcessingError(null);
    
    // Process files
    const processFiles = async () => {
      const csvFiles: CSVFile[] = [];
      
      for (const file of valid) {
        try {
          const text = await file.text();
          const csvFile = CSVProcessor.parseCSV(text, file.name);
          csvFiles.push(csvFile);
        } catch (error) {
          setProcessingError(`Error parsing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          return;
        }
      }
      
      setFiles(csvFiles);
      analytics.track('files_uploaded', { count: csvFiles.length });
    };

    processFiles();
  };

  const handleConsolidate = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProcessingError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // UX delay
      const result = CSVProcessor.consolidateFiles(files, consolidationOptions);
      setConsolidatedData(result);
      analytics.track('files_consolidated', { 
        method: consolidationOptions.method,
        fileCount: files.length,
        totalRows: result.stats.totalRows
      });
    } catch (error) {
      setProcessingError(error instanceof Error ? error.message : 'Consolidation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!consolidatedData || !user) return;

    // Check if user can download
    if (!canDownload()) {
      onShowPayment();
      return;
    }

    try {
      // Generate ticket number
      const ticketNumber = `CSV${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      // Determine download type
      let downloadType: 'free' | 'pro' | 'single' = 'free';
      if (subscription?.type === 'pro') {
        downloadType = 'pro';
      } else if (subscription?.type === 'single') {
        downloadType = 'single';
      }

      // Calculate file size
      const csvContent = [
        consolidatedData.headers.join(','),
        ...consolidatedData.data.map(row => 
          row.map(cell => {
            if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
              return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
          }).join(',')
        )
      ].join('\n');
      
      const fileSize = new Blob([csvContent]).size;
      const fileName = `consolidated-data-${new Date().toISOString().split('T')[0]}.csv`;

      // Record download in history
      await addDownload({
        fileName,
        rowCount: consolidatedData.data.length,
        columnCount: consolidatedData.headers.length,
        fileSize,
        ticketNumber,
        downloadType
      });

      // Update subscription usage
      if (downloadType === 'pro') {
        await incrementDownloadCount();
      } else if (downloadType === 'single') {
        await markSingleDownloadUsed();
      } else {
        await incrementDownloadCount(); // Free plan
      }

      // Trigger download
      CSVProcessor.exportToCSV(consolidatedData.headers, consolidatedData.data, fileName);

      // Show download ticket
      onShowDownloadTicket({
        fileName,
        rowCount: consolidatedData.data.length,
        columnCount: consolidatedData.headers.length,
        downloadType,
        ticketNumber
      });

      analytics.track('file_downloaded', { 
        downloadType,
        rowCount: consolidatedData.data.length,
        fileSize
      });

    } catch (error) {
      setProcessingError('Download failed. Please try again.');
      console.error('Download error:', error);
    }
  };

  const resetFiles = () => {
    setFiles([]);
    setConsolidatedData(null);
    setProcessingError(null);
  };

  const handleStartProcessing = () => {
    setShowDashboard(false);
    // Reset any existing state to start fresh
    resetFiles();
  };

  if (showDashboard) {
    return (
      <Dashboard 
        onLogout={() => setShowDashboard(false)} 
        onStartProcessing={handleStartProcessing}
      />
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
        <Navbar 
          onDashboardClick={() => setShowDashboard(true)}
          onAuthClick={() => {}} // User is already authenticated
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Welcome Section */}
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-none tracking-tighter">
              WELCOME BACK,{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {profile?.first_name?.toUpperCase() || 'USER'}
              </span>
            </h1>
            <p className="text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Transform your CSV files into unified datasets with enterprise-grade processing power.
            </p>
          </div>

          {/* Subscription Banner */}
          {subscription && (
            <SubscriptionBanner 
              userType={subscription.type}
              downloadCount={subscription.download_count}
              onUpgrade={onShowPayment}
            />
          )}

          {/* File Upload Section */}
          <div className="mb-16">
            <div className="bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                 style={{
                   background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                   boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                 }}>
              <div className="px-10 py-8 bg-white/5 backdrop-blur-2xl border-b border-white/10">
                <h2 className="text-3xl font-black text-white flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  UPLOAD CSV FILES
                </h2>
                <p className="text-white/70 mt-3 font-light text-lg">Select up to 3 CSV files to consolidate (max 50MB each)</p>
              </div>
              
              <div className="p-10">
                <div className="border-2 border-dashed border-white/30 rounded-3xl p-20 text-center hover:border-white/50 transition-all duration-500 bg-white/5 backdrop-blur-sm">
                  <input
                    type="file"
                    multiple
                    accept=".csv"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-8"
                  >
                    <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Upload className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white mb-4 tracking-wider">
                        CHOOSE CSV FILES
                      </p>
                      <p className="text-white/70 font-light text-lg">
                        Click to browse or drag and drop your files here
                      </p>
                    </div>
                  </label>
                </div>

                {processingError && (
                  <div className="mt-8 p-8 bg-red-500/20 backdrop-blur-2xl rounded-3xl border border-red-500/30"
                       style={{
                         background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(220,38,38,0.1) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(239,68,68,0.2)'
                       }}>
                    <div className="flex items-start gap-6">
                      <AlertCircle className="w-8 h-8 text-red-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-black text-red-400 mb-3 text-lg">UPLOAD ERROR</h4>
                        <p className="text-sm text-red-300 whitespace-pre-line font-light">{processingError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {files.length > 0 && (
                  <div className="mt-12 space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-white">UPLOADED FILES ({files.length})</h3>
                      <button
                        onClick={resetFiles}
                        className="px-6 py-3 bg-white/10 backdrop-blur-2xl hover:bg-white/20 text-white rounded-2xl transition-all duration-300 font-bold border border-white/20"
                      >
                        CLEAR ALL
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {files.map((file) => (
                        <div key={file.id} className="p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                               boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 10px 30px rgba(0,0,0,0.3)'
                             }}>
                          <div className="flex items-start gap-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                              <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-black text-white truncate mb-3 text-lg" title={file.name}>
                                {file.name}
                              </h4>
                              <div className="text-sm text-white/70 space-y-2 font-light">
                                <p>{file.rowCount.toLocaleString()} rows × {file.headers.length} columns</p>
                                <p>{(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Data Point Selector */}
          {files.length > 0 && (
            <DataPointSelector
              files={files}
              selectedDataPoints={consolidationOptions.dataPointSelection?.selectedPoints || []}
              onDataPointsChange={(dataPoints) => 
                setConsolidationOptions(prev => ({
                  ...prev,
                  dataPointSelection: {
                    ...prev.dataPointSelection!,
                    selectedPoints: dataPoints,
                    enabled: dataPoints.length > 0
                  }
                }))
              }
              mappings={consolidationOptions.dataPointSelection?.mappings || {}}
              onMappingsChange={(mappings) =>
                setConsolidationOptions(prev => ({
                  ...prev,
                  dataPointSelection: {
                    ...prev.dataPointSelection!,
                    mappings
                  }
                }))
              }
              isVisible={true}
              onToggleVisibility={() => {}}
            />
          )}

          {/* Consolidation Settings */}
          {files.length > 0 && (
            <ConsolidationSettings
              options={consolidationOptions}
              onChange={setConsolidationOptions}
              availableHeaders={files.length > 0 ? Array.from(new Set(files.flatMap(f => f.headers))) : []}
              onConsolidate={handleConsolidate}
              isProcessing={isProcessing}
            />
          )}

          {/* Processing Stats */}
          {consolidatedData && (
            <ProcessingStats 
              stats={consolidatedData.stats}
              isVisible={true}
            />
          )}

          {/* Download Section */}
          {consolidatedData && (
            <div className="mb-16">
              <div className="bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                   style={{
                     background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                     boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                   }}>
                <div className="px-10 py-8 bg-emerald-500/20 backdrop-blur-2xl border-b border-white/10">
                  <h2 className="text-3xl font-black text-white flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Download className="w-8 h-8 text-white" />
                    </div>
                    DOWNLOAD CONSOLIDATED DATA
                  </h2>
                  <p className="text-white/70 mt-3 font-light text-lg">Your consolidated CSV file is ready for download</p>
                </div>
                
                <div className="p-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                      <BarChart3 className="w-12 h-12 text-white mx-auto mb-4" />
                      <div className="text-4xl font-black text-white mb-3">
                        {consolidatedData.data.length.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/70 font-medium uppercase tracking-wider">TOTAL ROWS</div>
                    </div>
                    <div className="text-center p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                      <Layers className="w-12 h-12 text-white mx-auto mb-4" />
                      <div className="text-4xl font-black text-white mb-3">
                        {consolidatedData.headers.length}
                      </div>
                      <div className="text-sm text-white/70 font-medium uppercase tracking-wider">COLUMNS</div>
                    </div>
                    <div className="text-center p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                      <Upload className="w-12 h-12 text-white mx-auto mb-4" />
                      <div className="text-4xl font-black text-white mb-3">
                        {files.length}
                      </div>
                      <div className="text-sm text-white/70 font-medium uppercase tracking-wider">FILES MERGED</div>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full py-8 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-3xl font-black text-2xl hover:from-emerald-400 hover:to-cyan-400 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 flex items-center justify-center gap-4"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                      boxShadow: '0 25px 50px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                  >
                    <Download className="w-8 h-8" />
                    DOWNLOAD CONSOLIDATED CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default UserDashboard;