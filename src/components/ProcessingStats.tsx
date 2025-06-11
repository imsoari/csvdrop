import React from 'react';
import { BarChart3, Clock, Trash2, Layers, CheckCircle, Sparkles } from 'lucide-react';

interface ProcessingStatsProps {
  stats: {
    totalRows: number;
    duplicatesRemoved: number;
    emptyRowsRemoved: number;
    columnsAligned: number;
    processingTime: number;
    dataPointsConsolidated: number;
  };
  isVisible: boolean;
}

const ProcessingStats: React.FC<ProcessingStatsProps> = ({ stats, isVisible }) => {
  if (!isVisible) return null;

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const statItems = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Total Rows',
      value: stats.totalRows.toLocaleString(),
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'rgba(59,130,246,0.1)'
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      label: 'Duplicates Removed',
      value: stats.duplicatesRemoved.toLocaleString(),
      color: 'from-red-500 to-rose-600',
      bgColor: 'rgba(239,68,68,0.1)'
    },
    {
      icon: <Layers className="w-5 h-5" />,
      label: 'Empty Rows Removed',
      value: stats.emptyRowsRemoved.toLocaleString(),
      color: 'from-orange-500 to-amber-600',
      bgColor: 'rgba(249,115,22,0.1)'
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: 'Columns Aligned',
      value: stats.columnsAligned > 0 ? stats.columnsAligned.toString() : 'N/A',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'rgba(16,185,129,0.1)'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Processing Time',
      value: formatTime(stats.processingTime),
      color: 'from-purple-500 to-pink-600',
      bgColor: 'rgba(139,92,246,0.1)'
    }
  ];

  // Add data points stat if applicable
  if (stats.dataPointsConsolidated > 0) {
    statItems.push({
      icon: <Sparkles className="w-5 h-5" />,
      label: 'Data Points Consolidated',
      value: stats.dataPointsConsolidated.toString(),
      color: 'from-violet-500 to-purple-600',
      bgColor: 'rgba(139,92,246,0.1)'
    });
  }

  return (
    <div className="mb-8">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
             boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)'
           }}>
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50/80 to-gray-100/80 border-b border-white/30">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Processing Results
            {stats.dataPointsConsolidated > 0 && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Smart Data Points
              </span>
            )}
          </h2>
          <p className="text-gray-600 mt-2">Summary of consolidation operations</p>
        </div>
        
        <div className="p-8">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(statItems.length, 6)} gap-6`}>
            {statItems.map((item, index) => (
              <div
                key={item.label}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg transform hover:scale-105 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${item.bgColor} 0%, rgba(255,255,255,0.6) 100%)`,
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 bg-gradient-to-r ${item.color} rounded-xl text-white shadow-lg`}>
                    {item.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {item.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Message */}
          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl border border-emerald-200/50"
               style={{
                 background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(13,148,136,0.1) 100%)',
                 boxShadow: '0 10px 25px -5px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.6)'
               }}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-emerald-800">Consolidation Complete!</h3>
            </div>
            <p className="text-emerald-700">
              Successfully processed your CSV files in {formatTime(stats.processingTime)}. 
              {stats.duplicatesRemoved > 0 && ` Removed ${stats.duplicatesRemoved} duplicate rows.`}
              {stats.emptyRowsRemoved > 0 && ` Filtered out ${stats.emptyRowsRemoved} empty rows.`}
              {stats.columnsAligned > 0 && ` Aligned ${stats.columnsAligned} unique columns.`}
              {stats.dataPointsConsolidated > 0 && ` Consolidated ${stats.dataPointsConsolidated} data points using smart mapping.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStats;