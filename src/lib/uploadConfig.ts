// Upload configuration for different environments
export const uploadConfig = {
  // Timeout settings
  timeouts: {
    upload: 60000, // 60 seconds for image uploads
    database: 15000, // 15 seconds for database operations
    connection: 10000, // 10 seconds for connection tests
  },
  
  // Chunk settings for multiple image uploads
  chunks: {
    size: 2, // Upload 2 images at a time
    delay: 500, // 500ms delay between chunks
  },
  
  // File size limits
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB per file
    maxTotalSize: 50 * 1024 * 1024, // 50MB total
  },
  
  // Environment-specific settings
  environment: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    isVercel: import.meta.env.VITE_VERCEL === 'true',
  },
  
  // Supabase settings
  supabase: {
    bucket: 'cars', // Use cars bucket for all car-related images
    cacheControl: '3600', // 1 hour cache
    upsert: true, // Overwrite existing files
  },
  
  // Performance optimizations
  performance: {
    enableCompression: true,
    enableRetry: true,
    maxRetries: 3,
    retryDelay: 1000, // 1 second between retries
  }
};

// Helper function to get optimized timeout based on environment
export function getOptimizedTimeout(type: 'upload' | 'database' | 'connection'): number {
  const baseTimeout = uploadConfig.timeouts[type];
  
  // Use shorter timeouts in development for faster feedback
  if (uploadConfig.environment.isDevelopment) {
    return baseTimeout * 0.3; // 70% faster in development
  }
  
  // Use base timeouts in production for reliability
  if (uploadConfig.environment.isProduction) {
    return baseTimeout; // Use full timeout in production
  }
  
  return baseTimeout;
}

// Helper function to create timeout promise
export function createTimeoutPromise(timeoutMs: number, errorMessage: string): Promise<never> {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
  );
}

// Helper function to validate file before upload
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > uploadConfig.limits.maxFileSize) {
    return { 
      valid: false, 
      error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds limit (${uploadConfig.limits.maxFileSize / 1024 / 1024}MB)` 
    };
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type ${file.type} not allowed. Use: ${allowedTypes.join(', ')}` 
    };
  }
  
  return { valid: true };
}

// Helper function to generate optimized filename
export function generateFileName(prefix: string, originalName: string, timestamp: number): string {
  const ext = originalName.split('.').pop();
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${timestamp}_${random}.${ext}`;
} 