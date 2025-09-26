'use client';

import React, { useState, useEffect } from 'react';
import { healthService, BackendHealth } from '@/lib/services/healthService';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface LoadingWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  timeout?: number;
}

export function LoadingWrapper({ children, fallback, timeout = 30000 }: LoadingWrapperProps) {
  const [health, setHealth] = useState<BackendHealth>({
    status: 'checking',
    message: 'Checking backend connectivity...'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const healthStatus = await healthService.waitForBackend(timeout);
        setHealth(healthStatus);
        setIsLoading(false);
      } catch (error) {
        setHealth({
          status: 'unhealthy',
          message: `Backend not ready: ${error instanceof Error ? error.message : 'Connection timeout'}`
        });
        setIsLoading(false);
      }
    };

    checkBackend();
  }, [timeout]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium">Connecting to backend...</span>
        </div>
        <div className="text-sm text-gray-600 text-center max-w-md">
          {health.message}
        </div>
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    );
  }

  if (health.status === 'unhealthy') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg font-medium">Backend Connection Failed</span>
        </div>
        <div className="text-sm text-gray-600 text-center max-w-md">
          {health.message}
        </div>
        <button
          onClick={() => {
            setIsLoading(true);
            healthService.reset();
            window.location.reload();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry Connection
        </button>
        {fallback && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Fallback Content:</div>
            {fallback}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
        <CheckCircle className="h-3 w-3" />
        <span>Backend Connected</span>
      </div>
      {children}
    </div>
  );
}
