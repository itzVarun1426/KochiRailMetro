import { api } from '../api';
import { config } from '../config';

export interface BackendHealth {
  status: 'healthy' | 'unhealthy' | 'checking';
  message?: string;
  lastChecked?: Date;
}

class HealthService {
  private healthStatus: BackendHealth = {
    status: 'checking',
    message: 'Checking backend connectivity...'
  };

  private checkPromise: Promise<BackendHealth> | null = null;

  // Check if backend is healthy
  async checkHealth(): Promise<BackendHealth> {
    // If we're already checking, return the same promise
    if (this.checkPromise) {
      return this.checkPromise;
    }

    this.checkPromise = this.performHealthCheck();
    
    try {
      const result = await this.checkPromise;
      this.healthStatus = result;
      return result;
    } finally {
      this.checkPromise = null;
    }
  }

  private async performHealthCheck(): Promise<BackendHealth> {
    try {
      // Try to hit a simple endpoint to check if backend is up
      // Using trains endpoint as it should be available
      await api.get('/api/trains');
      
      return {
        status: 'healthy',
        message: 'Backend is ready',
        lastChecked: new Date()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Backend not ready: ${error instanceof Error ? error.message : 'Unknown error'}`,
        lastChecked: new Date()
      };
    }
  }

  // Wait for backend to be ready with timeout
  async waitForBackend(timeoutMs: number = config.backendTimeout): Promise<BackendHealth> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const health = await this.checkHealth();
      
      if (health.status === 'healthy') {
        return health;
      }
      
      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error(`Backend not ready after ${timeoutMs}ms timeout`);
  }

  // Get current health status
  getCurrentStatus(): BackendHealth {
    return this.healthStatus;
  }

  // Reset health status
  reset() {
    this.healthStatus = {
      status: 'checking',
      message: 'Checking backend connectivity...'
    };
    this.checkPromise = null;
  }
}

export const healthService = new HealthService();
