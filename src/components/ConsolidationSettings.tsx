import React from 'react';
import { Settings, ArrowUpDown, Filter, Trash2, Sparkles } from 'lucide-react';

interface ConsolidationOptions {
  method: 'merge' | 'union' | 'intersect';
  removeDuplicates: boolean;
  headerHandling: 'first' | 'all' | 'custom';
  customHeaders?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filterEmpty: boolean;
}

interface ConsolidationSettingsProps {
  options: ConsolidationOptions;
  onChange: (options: ConsolidationOptions) => void;
  availableHeaders: string[];
  onConsolidate: () => void;
  isProcessing: boolean;
}

const ConsolidationSettings: React.FC<ConsolidationSettingsProps> = ({
  options,
  onChange,
  availableHeaders,
  onConsolidate,
  isProcessing
}) => {
  const updateOption = <K extends keyof ConsolidationOptions>(
    key: K,
    value: ConsolidationOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="mb-16">
      <div className="bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
           style={{
             background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 25px 50px rgba(0,0,0,0.3)'
           }}>
        <div className="px-10 py-8 bg-white/5 backdrop-blur-2xl border-b border-white/10">
          <h2 className="text-3xl font-black text-white flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            CONSOLIDATION SETTINGS
          </h2>
          <p className="text-white/70 mt-3 font-light text-lg">Configure how your CSV files should be merged</p>
        </div>
        
        <div className="p-10 space-y-12">
          {/* Consolidation Method */}
          <div>
            <label className="block text-2xl font-black text-white mb-8 flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              CONSOLIDATION METHOD
            </label>
            <div className="space-y-6">
              {[
                { 
                  value: 'merge', 
                  label: 'MERGE ALL', 
                  desc: 'Combine all rows from all files (fastest)',
                  gradient: 'from-blue-500 to-indigo-600'
                },
                { 
                  value: 'union', 
                  label: 'UNION (REMOVE DUPLICATES)', 
                  desc: 'Merge files and automatically remove duplicate rows',
                  gradient: 'from-emerald-500 to-teal-600'
                },
                { 
                  value: 'intersect', 
                  label: 'INTERSECTION', 
                  desc: 'Only keep rows that appear in ALL files',
                  gradient: 'from-purple-500 to-pink-600'
                }
              ].map(method => (
                <label key={method.value} className={`flex items-start gap-6 p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border transition-all duration-500 transform hover:scale-[1.02] cursor-pointer shadow-2xl ${
                  options.method === method.value 
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                       style={{
                         background: options.method === method.value 
                           ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)'
                           : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.2)'
                       }}>
                  <input
                    type="radio"
                    name="method"
                    value={method.value}
                    checked={options.method === method.value}
                    onChange={(e) => updateOption('method', e.target.value as any)}
                    className="mt-2 w-6 h-6 text-cyan-400 focus:ring-cyan-400"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${method.gradient}`}></div>
                      <div className="font-black text-white text-xl tracking-wider">{method.label}</div>
                    </div>
                    <div className="text-white/70 font-light text-lg">{method.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Header Handling */}
          <div>
            <label className="block text-2xl font-black text-white mb-8 flex items-center gap-4">
              <Filter className="w-8 h-8 text-purple-400" />
              HEADER HANDLING
            </label>
            <div className="space-y-6">
              {[
                { value: 'first', label: 'USE FIRST FILE HEADERS', desc: 'All files must have the same column structure' },
                { value: 'all', label: 'MERGE ALL HEADERS', desc: 'Combine unique headers from all files (recommended)' }
              ].map(option => (
                <label key={option.value} className={`flex items-start gap-6 p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border transition-all duration-500 transform hover:scale-[1.02] cursor-pointer shadow-2xl ${
                  options.headerHandling === option.value 
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                       style={{
                         background: options.headerHandling === option.value 
                           ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)'
                           : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.2)'
                       }}>
                  <input
                    type="radio"
                    name="headerHandling"
                    value={option.value}
                    checked={options.headerHandling === option.value}
                    onChange={(e) => updateOption('headerHandling', e.target.value as any)}
                    className="mt-2 w-6 h-6 text-purple-400 focus:ring-purple-400"
                  />
                  <div>
                    <div className="font-black text-white text-xl tracking-wider mb-2">{option.label}</div>
                    <div className="text-white/70 font-light text-lg">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <label className="block text-2xl font-black text-white mb-8 flex items-center gap-4">
              <ArrowUpDown className="w-8 h-8 text-emerald-400" />
              ADDITIONAL OPTIONS
            </label>
            <div className="space-y-6">
              {/* Remove Duplicates */}
              {options.method !== 'union' && (
                <label className="flex items-center gap-6 p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-500 transform hover:scale-[1.02] shadow-2xl"
                       style={{
                         background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.2)'
                       }}>
                  <input
                    type="checkbox"
                    checked={options.removeDuplicates}
                    onChange={(e) => updateOption('removeDuplicates', e.target.checked)}
                    className="w-6 h-6 text-cyan-400 focus:ring-cyan-400 rounded"
                  />
                  <div>
                    <div className="font-black text-white text-xl tracking-wider mb-2">REMOVE DUPLICATE ROWS</div>
                    <div className="text-white/70 font-light text-lg">Remove rows with identical data across all columns</div>
                  </div>
                </label>
              )}

              {/* Filter Empty Rows */}
              <label className="flex items-center gap-6 p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-500 transform hover:scale-[1.02] shadow-2xl"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                       boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.2)'
                     }}>
                <input
                  type="checkbox"
                  checked={options.filterEmpty}
                  onChange={(e) => updateOption('filterEmpty', e.target.checked)}
                  className="w-6 h-6 text-orange-400 focus:ring-orange-400 rounded"
                />
                <div>
                  <div className="font-black text-white text-xl tracking-wider mb-2 flex items-center gap-3">
                    <Trash2 className="w-6 h-6 text-orange-400" />
                    FILTER EMPTY ROWS
                  </div>
                  <div className="text-white/70 font-light text-lg">Remove rows that are completely empty</div>
                </div>
              </label>

              {/* Sort Options */}
              {availableHeaders.length > 0 && (
                <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                       boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.2)'
                     }}>
                  <div className="font-black text-white text-xl tracking-wider mb-6 flex items-center gap-3">
                    <ArrowUpDown className="w-6 h-6 text-purple-400" />
                    SORT RESULTS
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-white/80 mb-3 uppercase tracking-wider">Sort by Column</label>
                      <select
                        value={options.sortBy || ''}
                        onChange={(e) => updateOption('sortBy', e.target.value || undefined)}
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white"
                      >
                        <option value="">No sorting</option>
                        {availableHeaders.map(header => (
                          <option key={header} value={header} className="bg-black text-white">{header}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white/80 mb-3 uppercase tracking-wider">Sort Order</label>
                      <select
                        value={options.sortOrder || 'asc'}
                        onChange={(e) => updateOption('sortOrder', e.target.value as 'asc' | 'desc')}
                        disabled={!options.sortBy}
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 disabled:opacity-50 text-white"
                      >
                        <option value="asc" className="bg-black text-white">Ascending (A-Z, 1-9)</option>
                        <option value="desc" className="bg-black text-white">Descending (Z-A, 9-1)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Consolidate Button */}
          <button
            onClick={onConsolidate}
            disabled={isProcessing}
            className="w-full py-8 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-3xl font-black text-2xl hover:from-cyan-400 hover:to-purple-500 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
              boxShadow: '0 25px 50px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                PROCESSING...
              </>
            ) : (
              <>
                <Settings className="w-8 h-8" />
                CONSOLIDATE DATA
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsolidationSettings;