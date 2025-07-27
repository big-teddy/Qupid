// Environment variable validation
export const validateEnvironment = () => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_GEMINI_API_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !(import.meta.env as any)[varName]);

  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    return false;
  }

  return true;
};

// Check if running in production
export const isProduction = (import.meta.env as any).PROD;

// Check if running in development
export const isDevelopment = (import.meta.env as any).DEV;

// Get API URLs
export const getApiUrl = () => {
  if (isDevelopment) {
    return 'http://localhost:5173';
  }
  return 'https://qupid-app.vercel.app';
}; 