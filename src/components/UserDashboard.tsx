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
    // Keep the user in the dashboard but reset the processing state
    // Don't set showDashboard to false as that causes redirection issues
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
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          {/* Welcome Section */}
          <div className="text-center mb-10 sm:mb-16 md:mb-20">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-monument font-black text-white mb-4 sm:mb-6 md:mb-8 leading-none tracking-tighter">
              WELCOME BACK,{' '}
              <span className="bg-gradient-to-r from-csv-orange-400 to-csv-orange-600 bg-clip-text text-transparent">
                {profile?.first_name?.toUpperCase() || 'USER'}
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-6 sm:mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed font-light">
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
          <div className="mb-8 sm:mb-12 md:mb-16">
            <div className="bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                 style={{
                   background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                   boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
                 }}>
              <div className="px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8 bg-white/5 backdrop-blur-2xl border-b border-white/10">
                <h2 className="text-3xl font-monument font-black text-white flex items-center gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-csv-gradient rounded-2xl flex items-center justify-center shadow-2xl">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  UPLOAD CSV FILES
                </h2>
                <p className="text-white/70 mt-2 sm:mt-3 font-light text-base sm:text-lg">Select up to 3 CSV files to consolidate (max 50MB each)</p>
              </div>
              
              <div className="p-10">
                <div className="border-2 border-dashed border-white/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-20 text-center hover:border-white/50 transition-all duration-500 bg-white/5 backdrop-blur-sm">
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
                    className="cursor-pointer flex flex-col items-center gap-4 sm:gap-6 md:gap-8"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-csv-gradient rounded-3xl flex items-center justify-center shadow-2xl">
                      <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl md:text-3xl font-monument font-black text-white mb-2 sm:mb-3 md:mb-4 tracking-wider">
                        CHOOSE CSV FILES
                      </p>
                      <p className="text-white/70 font-light text-sm sm:text-base md:text-lg">
                        Click to browse or drag and drop your files here
                      </p>
                    </div>
                  </label>
                </div>

                {processingError && (
                  <div className="mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-6 lg:p-8 bg-red-500/20 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-red-500/30"
                       style={{
                         background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(220,38,38,0.1) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(239,68,68,0.2)'
                       }}>
                    <div className="flex items-start gap-6">
                      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-black text-red-400 mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">UPLOAD ERROR</h4>
                        <p className="text-xs sm:text-sm text-red-300 whitespace-pre-line font-light">{processingError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {files.length > 0 && (
                  <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-12 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-monument font-black text-white">UPLOADED FILES ({files.length})</h3>
                      <button
                        onClick={resetFiles}
                        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 bg-white/10 backdrop-blur-2xl hover:bg-white/20 text-white rounded-xl sm:rounded-2xl transition-all duration-300 font-bold border border-white/20 text-xs sm:text-sm md:text-base"
                      >
                        CLEAR ALL
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                      {files.map((file) => (
                        <div key={file.id} className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                               boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 10px 30px rgba(0,0,0,0.3)'
                             }}>
                          <div className="flex items-start gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-csv-gradient rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-black text-white truncate mb-2 sm:mb-3 text-sm sm:text-base md:text-lg" title={file.name}>
                                {file.name}
                              </h4>
                              <div className="text-xs sm:text-sm text-white/70 space-y-1 sm:space-y-2 font-light">
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
                <div className="px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8 bg-csv-orange-500/20 backdrop-blur-2xl border-b border-white/10">
                  <h2 className="text-3xl font-monument font-black text-white flex items-center gap-6">
                    <div className="w-16 h-16 bg-csv-gradient rounded-2xl flex items-center justify-center shadow-2xl">
                      <Download className="w-8 h-8 text-white" />
                    </div>
                    DOWNLOAD CONSOLIDATED DATA
                  </h2>
                  <p className="text-white/70 mt-2 sm:mt-3 font-light text-base sm:text-lg">Your consolidated CSV file is ready for download</p>
                </div>
                
                <div className="p-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
                    <div className="text-center p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                      <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white mx-auto mb-2 sm:mb-3 md:mb-4" />
                      <div className="text-4xl font-black text-white mb-3">
                        {consolidatedData.data.length.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/70 font-medium uppercase tracking-wider">TOTAL ROWS</div>
                    </div>
                    <div className="text-center p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                      <Layers className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white mx-auto mb-2 sm:mb-3 md:mb-4" />
                      <div className="text-4xl font-black text-white mb-3">
                        {consolidatedData.headers.length}
                      </div>
                      <div className="text-sm text-white/70 font-medium uppercase tracking-wider">COLUMNS</div>
                    </div>
                    <div className="text-center p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                      <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white mx-auto mb-2 sm:mb-3 md:mb-4" />
                      <div className="text-4xl font-black text-white mb-3">
                        {files.length}
                      </div>
                      <div className="text-sm text-white/70 font-medium uppercase tracking-wider">FILES MERGED</div>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full py-4 sm:py-6 md:py-8 bg-csv-gradient text-white rounded-3xl font-black text-lg sm:text-xl md:text-2xl hover:from-csv-orange-400 hover:to-csv-orange-600 transition-all duration-500 shadow-2xl hover:shadow-csv-orange-500/25 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 md:gap-4"
                    style={{
                      boxShadow: '0 25px 50px rgba(249,115,22,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                  >
                    <Download className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
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