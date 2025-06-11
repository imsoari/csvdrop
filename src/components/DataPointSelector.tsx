import React, { useState, useEffect } from 'react';
import { Check, Search, Sparkles, ArrowRight, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { CSVFile, STANDARD_DATA_POINTS, DataPointMapping } from '../utils/csvProcessor';

interface DataPointSelectorProps {
  files: CSVFile[];
  selectedDataPoints: string[];
  onDataPointsChange: (dataPoints: string[]) => void;
  mappings: { [fileId: string]: DataPointMapping };
  onMappingsChange: (mappings: { [fileId: string]: DataPointMapping }) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const DataPointSelector: React.FC<DataPointSelectorProps> = ({
  files,
  selectedDataPoints,
  onDataPointsChange,
  mappings,
  onMappingsChange,
  isVisible,
  onToggleVisibility
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMappings, setShowMappings] = useState(false);
  const [autoMappingInProgress, setAutoMappingInProgress] = useState(false);

  // Auto-suggest mappings when files change
  useEffect(() => {
    if (files.length > 0 && Object.keys(mappings).length === 0) {
      autoSuggestMappings();
    }
  }, [files]);

  const autoSuggestMappings = async () => {
    setAutoMappingInProgress(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMappings: { [fileId: string]: DataPointMapping } = {};
    
    files.forEach(file => {
      const suggestions: DataPointMapping = {};
      
      Object.entries(STANDARD_DATA_POINTS).forEach(([dataPoint, config]) => {
        const matchedHeader = file.headers.find(header => {
          const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '_');
          return config.commonHeaders.some(commonHeader => 
            normalizedHeader.includes(commonHeader) || 
            commonHeader.includes(normalizedHeader)
          );
        });
        
        if (matchedHeader) {
          suggestions[dataPoint] = matchedHeader;
        }
      });
      
      newMappings[file.id] = suggestions;
    });
    
    onMappingsChange(newMappings);
    setAutoMappingInProgress(false);
  };

  const filteredDataPoints = Object.entries(STANDARD_DATA_POINTS).filter(([key, config]) =>
    config.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDataPointToggle = (dataPoint: string) => {
    if (selectedDataPoints.includes(dataPoint)) {
      onDataPointsChange(selectedDataPoints.filter(dp => dp !== dataPoint));
    } else {
      onDataPointsChange([...selectedDataPoints, dataPoint]);
    }
  };

  const handleMappingChange = (fileId: string, dataPoint: string, header: string) => {
    const newMappings = {
      ...mappings,
      [fileId]: {
        ...mappings[fileId],
        [dataPoint]: header
      }
    };
    onMappingsChange(newMappings);
  };

  const selectAllDataPoints = () => {
    onDataPointsChange(Object.keys(STANDARD_DATA_POINTS));
  };

  const clearAllDataPoints = () => {
    onDataPointsChange([]);
  };

  const getDataPointCoverage = (dataPoint: string): number => {
    if (files.length === 0) return 0;
    
    const mappedFiles = files.filter(file => 
      mappings[file.id] && mappings[file.id][dataPoint]
    );
    
    return (mappedFiles.length / files.length) * 100;
  };

  if (!isVisible) {
    return (
      <div className="mb-4 sm:mb-6 md:mb-8">
        <button
          onClick={onToggleVisibility}
          className="w-full p-4 sm:p-6 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-3xl border border-purple-200/50 hover:from-purple-100/80 hover:to-pink-100/80 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(168,85,247,0.1) 100%)',
            boxShadow: '0 15px 35px -5px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.6)'
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 text-center sm:text-left">Smart Data Point Consolidation</h3>
              <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">Select specific data fields to consolidate (name, email, phone, etc.)</p>
            </div>
            <ArrowRight className="w-6 h-6 text-purple-600" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
             boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)'
           }}>
        
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-b border-white/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Smart Data Point Consolidation</h2>
                <p className="text-gray-600 text-sm">Select specific data fields to consolidate across your CSV files</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMappings(!showMappings)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all duration-300 text-sm font-medium"
              >
                {showMappings ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showMappings ? 'Hide' : 'Show'} Mappings
              </button>
              <button
                onClick={onToggleVisibility}
                className="p-2 hover:bg-white/60 rounded-xl transition-all duration-300"
              >
                <EyeOff className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search data points (e.g., name, email, phone)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              />
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={selectAllDataPoints}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Select All
              </button>
              <button
                onClick={clearAllDataPoints}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Clear All
              </button>
              <button
                onClick={autoSuggestMappings}
                disabled={autoMappingInProgress}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {autoMappingInProgress ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Auto-mapping...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Auto-map
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Selected Data Points Summary */}
          {selectedDataPoints.length > 0 && (
            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-purple-100/80 to-pink-100/80 rounded-2xl border border-purple-200/50"
                 style={{
                   background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(168,85,247,0.1) 100%)',
                   boxShadow: '0 8px 20px -5px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.6)'
                 }}>
              <h3 className="text-base sm:text-lg font-bold text-purple-900 mb-2 sm:mb-3">Selected Data Points ({selectedDataPoints.length})</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDataPoints.map(dataPoint => (
                  <span
                    key={dataPoint}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-purple-800 border border-purple-200/50"
                  >
                    <span>{STANDARD_DATA_POINTS[dataPoint]?.icon}</span>
                    {STANDARD_DATA_POINTS[dataPoint]?.label}
                    <button
                      onClick={() => handleDataPointToggle(dataPoint)}
                      className="ml-1 hover:bg-purple-200 rounded-full p-1 transition-colors duration-200"
                    >
                      <EyeOff className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Data Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDataPoints.map(([dataPoint, config]) => {
              const isSelected = selectedDataPoints.includes(dataPoint);
              const coverage = getDataPointCoverage(dataPoint);
              
              return (
                <div
                  key={dataPoint}
                  className={`p-3 sm:p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                    isSelected
                      ? 'border-purple-400 bg-gradient-to-br from-purple-50/80 to-pink-50/80 shadow-lg'
                      : 'border-gray-200 bg-white/60 hover:border-purple-300 hover:bg-purple-50/40'
                  }`}
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(168,85,247,0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                    boxShadow: isSelected
                      ? '0 15px 35px -5px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.6)'
                      : '0 8px 20px -5px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'
                  }}
                  onClick={() => handleDataPointToggle(dataPoint)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl">{config.icon}</span>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900">{config.label}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{config.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="p-1 bg-purple-500 rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Coverage indicator */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Coverage</span>
                      <span>{coverage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          coverage > 80 ? 'bg-emerald-500' :
                          coverage > 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${coverage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column Mappings */}
          {showMappings && selectedDataPoints.length > 0 && files.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-purple-600" />
                Column Mappings
              </h3>
              
              {files.map(file => (
                <div key={file.id} className="p-3 sm:p-4 md:p-6 bg-gray-50/80 rounded-2xl border border-gray-200/50">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                      📄
                    </span>
                    {file.name}
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {selectedDataPoints.map(dataPoint => (
                      <div key={dataPoint} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {STANDARD_DATA_POINTS[dataPoint]?.icon} {STANDARD_DATA_POINTS[dataPoint]?.label}
                        </label>
                        <select
                          value={mappings[file.id]?.[dataPoint] || ''}
                          onChange={(e) => handleMappingChange(file.id, dataPoint, e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                        >
                          <option value="">Select column...</option>
                          {file.headers.map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Help Text */}
          <div className="p-3 sm:p-4 bg-blue-50/80 rounded-2xl border border-blue-200/50">
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>💡 Tip:</strong> Data point consolidation intelligently maps similar columns across your CSV files. 
              For example, "First Name", "fname", and "given_name\" will all be consolidated into a single "First Name\" column.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPointSelector;