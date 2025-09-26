'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '@/lib/api';
import { healthService } from '@/lib/services/healthService';

interface UseBackendDataOptions {
  retryOnError?: boolean;
  retryDelay?: number;
  maxRetries?: number;
}

interface UseBackendDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  isRetrying: boolean;
}

export function useBackendData<T>(
  fetchFn: () => Promise<T>,
  options: UseBackendDataOptions = {}
): UseBackendDataState<T> {
  const {
    retryOnError = true,
    retryDelay = 3000,
    maxRetries = 3
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchData = useCallback(async (isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true);
      } else {
        setLoading(true);
      }
      
      setError(null);

      // First check backend health
      const health = await healthService.checkHealth();
      if (health.status !== 'healthy') {
        throw new Error('Backend is not ready. Please wait for the backend to start.');
      }

      const result = await fetchFn();
      setData(result);
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      // Auto-retry on network errors or server errors
      if (retryOnError && retryCount < maxRetries && (err instanceof ApiError)) {
        const shouldRetry = err.retryable || err.status >= 500;
        
        if (shouldRetry) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchData(true);
          }, retryDelay * (retryCount + 1)); // Exponential backoff
        }
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [fetchFn, retryOnError, retryDelay, maxRetries, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(0);
    fetchData(false);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    retry,
    isRetrying
  };
}
