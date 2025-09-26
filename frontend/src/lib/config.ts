export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://13.232.173.105:8080',
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 5, // Increased retry attempts
  retryDelay: 3000, // Increased to 3 seconds
  backendTimeout: 60000, // 60 seconds timeout for backend startup
};
