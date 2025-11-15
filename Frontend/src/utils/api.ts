/**
 * Global API configuration
 * Centralized API base URL and helper functions
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://oclservices.com';

/**
 * Constructs a full API URL from a path
 * @param path - API path (should start with /api)
 * @returns Full API URL
 * 
 * @example
 * api('/api/pincode/123456') // Returns: 'https://oclservices.com/api/pincode/123456'
 */
export const api = (path: string): string => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Remove trailing slash from API_BASE if present
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  return `${base}${normalizedPath}`;
};

/**
 * Get the API base URL (without trailing slash)
 */
export const getApiBase = (): string => {
  return API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
};

