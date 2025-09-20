// src/config/environment.ts
export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  
  // Feature Flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
    exportFeatures: import.meta.env.VITE_ENABLE_EXPORT !== 'false',
    importFeatures: import.meta.env.VITE_ENABLE_IMPORT !== 'false',
    darkMode: import.meta.env.VITE_ENABLE_DARK_MODE !== 'false',
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Contact Manager Pro',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development',
  },
  
  // UI Configuration
  ui: {
    itemsPerPage: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE || '12'),
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'), // 5MB
    allowedFileTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif').split(','),
  },
  
  // Development flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate required environment variables
if (!config.apiUrl && config.isProduction) {
  console.error('VITE_API_URL is required in production');
}

// Log configuration in development
if (config.isDevelopment) {
  console.log('App Configuration:', config);
}