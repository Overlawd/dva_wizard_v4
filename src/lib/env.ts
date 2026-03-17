// Environment Configuration
// Compatible with Create React App (REACT_APP_) and Vite (VITE_)

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // Try standard React/Node env vars first
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

export const env = {
  // Supports both REACT_APP_ (CRA) and VITE_ (Vite) prefixes
  API_URL: getEnvVar('REACT_APP_API_URL') || getEnvVar('VITE_API_URL') || 'http://localhost:3000/api',
  IS_DEV: getEnvVar('NODE_ENV', 'development') !== 'production',
};