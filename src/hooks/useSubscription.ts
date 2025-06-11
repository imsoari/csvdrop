import { useState, useEffect } from 'react';
import { Subscription, getSubscription, updateSubscription } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
    }
  }, [user]);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await getSubscription();
      if (error) throw error;
      setSubscription(data?.subscription || null);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementDownloadCount = async () => {
    try {
      const { data, error } = await updateSubscription({ incrementDownloadCount: true });
      if (error) throw error;
      setSubscription(data?.subscription || null);
      return { data, error: null };
    } catch (error) {
      console.error('Error incrementing download count:', error);
      return { data: null, error };
    }
  };

  const markSingleDownloadUsed = async () => {
    try {
      const { data, error } = await updateSubscription({ markSingleDownloadUsed: true });
      if (error) throw error;
      setSubscription(data?.subscription || null);
      return { data, error: null };
    } catch (error) {
      console.error('Error marking single download used:', error);
      return { data: null, error };
    }
  };

  const canDownload = (): boolean => {
    if (!subscription) return false;
    
    if (subscription.type === 'pro') return true;
    if (subscription.type === 'single' && !subscription.single_download_used) return true;
    if (subscription.type === 'free' && subscription.download_count === 0) return true;
    
    return false;
  };

  return {
    subscription,
    loading,
    canDownload,
    incrementDownloadCount,
    markSingleDownloadUsed,
    refetch: fetchSubscription,
  };
};