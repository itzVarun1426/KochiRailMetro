import { config } from './config';

const API_BASE_URL = config.apiUrl;

export class ApiError extends Error {
  constructor(public status: number, message: string, public retryable: boolean = true) {
    super(message);
    this.name = 'ApiError';
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount: number = 0
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const requestConfig: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, requestConfig);
    if (!response.ok) {
      const isRetryable = response.status >= 500 || response.status === 0;
      let serverMessage = '';
      try {
        const text = await response.text();
        // Try to parse JSON error if available
        serverMessage = text;
      } catch {}
      throw new ApiError(
        response.status,
        serverMessage || `HTTP error! status: ${response.status}`,
        isRetryable
      );
    }
    // Attempt to parse JSON; fallback to text
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : ({} as T);
    } catch {
      return (text as unknown) as T;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      // Retry logic for network errors and server errors
      if (error.retryable && retryCount < config.retryAttempts) {
        console.warn(`API request failed (attempt ${retryCount + 1}/${config.retryAttempts + 1}), retrying in ${config.retryDelay}ms...`);
        await delay(config.retryDelay * (retryCount + 1)); // Exponential backoff
        return apiRequest<T>(endpoint, options, retryCount + 1);
      }
      throw error;
    }
    // Network errors are retryable
    if (retryCount < config.retryAttempts) {
      console.warn(`Network error (attempt ${retryCount + 1}/${config.retryAttempts + 1}), retrying in ${config.retryDelay}ms...`);
      await delay(config.retryDelay * (retryCount + 1));
      return apiRequest<T>(endpoint, options, retryCount + 1);
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
  }
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: any) => 
    apiRequest<T>(endpoint, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  put: <T>(endpoint: string, data?: any) => 
    apiRequest<T>(endpoint, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};
