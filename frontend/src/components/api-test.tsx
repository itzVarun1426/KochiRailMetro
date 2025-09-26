'use client';

import React, { useState } from 'react';
import { trainService } from '@/lib/services/trainService';
import { Button } from '@/components/ui/button';

export function ApiTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing API connection...');
      const trains = await trainService.getAllTrains();
      console.log('API Response:', trains);
      setResult({
        success: true,
        count: trains.length,
        sampleTrain: trains[0],
        allTrains: trains
      });
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      
      <Button 
        onClick={testApiConnection} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </Button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800">
          <strong>Success!</strong>
          <div className="mt-2">
            <p>Found {result.count} trains</p>
            {result.sampleTrain && (
              <div className="mt-2">
                <p><strong>Sample Train:</strong></p>
                <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-40">
                  {JSON.stringify(result.sampleTrain, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
