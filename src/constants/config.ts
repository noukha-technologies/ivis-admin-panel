/**
 * App-wide configuration from environment variables
 */
export const ENV_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4780/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Ivis Opal',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
