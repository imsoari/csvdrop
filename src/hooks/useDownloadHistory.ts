import { useState, useEffect } from 'react';
import { getDownloadHistory, recordDownload } from '../lib/supabase';
import { useAuth } from './useAuth';

interface DownloadHistoryItem {
  id: string;
  file_name: string;
  row_count: number;
  column_count: number;
  file_size: number;
  ticket_number: string;
  download_type: 'free' | 'pro' | 'single';
  created_at: string;
}

export const useDownloadHistory = () => {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<DownloadHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchDownloads = async (page = 1, limit = 10) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await getDownloadHistory(page, limit);
      if (error) throw error;
      
      setDownloads(data?.downloads || []);
      setPagination(data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
    } catch (error) {
      console.error('Failed to fetch download history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDownload = async (downloadData: {
    fileName: string;
    rowCount: number;
    columnCount: number;
    fileSize: number;
    ticketNumber: string;
    downloadType: 'free' | 'pro' | 'single';
  }) => {
    if (!user) return;

    try {
      const { data, error } = await recordDownload(downloadData);
      if (error) throw error;
      
      // Refresh the download history
      await fetchDownloads(pagination.page, pagination.limit);
      
      return { data, error: null };
    } catch (error) {
      console.error('Failed to record download:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchDownloads();
    } else {
      setDownloads([]);
      setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
    }
  }, [user]);

  return {
    downloads,
    loading,
    pagination,
    fetchDownloads,
    addDownload,
  };
};