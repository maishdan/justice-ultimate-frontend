// Environment check for database and upload configuration
import { supabase } from './supabaseClient';
import { uploadConfig } from './uploadConfig';

export interface EnvironmentStatus {
  supabase: {
    url: string;
    connected: boolean;
    error?: string;
  };
  storage: {
    bucket: string;
    accessible: boolean;
    error?: string;
  };
  environment: {
    mode: 'development' | 'production' | 'unknown';
    isVercel: boolean;
    timeouts: {
      upload: number;
      database: number;
      connection: number;
    };
  };
  database: {
    tables: {
      cars: boolean;
      rentals: boolean;
      trade_ins: boolean;
    };
    error?: string;
  };
}

export async function checkEnvironment(): Promise<EnvironmentStatus> {
  const status: EnvironmentStatus = {
    supabase: {
      url: 'https://gzmgfgcgytafngvliqqj.supabase.co',
      connected: false,
    },
    storage: {
      bucket: uploadConfig.supabase.bucket,
      accessible: false,
    },
    environment: {
      mode: uploadConfig.environment.isDevelopment ? 'development' : 
            uploadConfig.environment.isProduction ? 'production' : 'unknown',
      isVercel: uploadConfig.environment.isVercel,
      timeouts: {
        upload: uploadConfig.timeouts.upload,
        database: uploadConfig.timeouts.database,
        connection: uploadConfig.timeouts.connection,
      },
    },
    database: {
      tables: {
        cars: false,
        rentals: false,
        trade_ins: false,
      },
    },
  };

  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('cars').select('count').limit(1);
    if (error) {
      status.supabase.error = error.message;
    } else {
      status.supabase.connected = true;
      status.database.tables.cars = true;
    }
  } catch (err) {
    status.supabase.error = err instanceof Error ? err.message : 'Unknown error';
  }

  try {
    // Test storage access
    const { data, error } = await supabase.storage.from(uploadConfig.supabase.bucket).list('', { limit: 1 });
    if (error) {
      status.storage.error = error.message;
    } else {
      status.storage.accessible = true;
    }
  } catch (err) {
    status.storage.error = err instanceof Error ? err.message : 'Unknown error';
  }

  try {
    // Test rentals table
    const { error } = await supabase.from('rentals').select('count').limit(1);
    if (!error) {
      status.database.tables.rentals = true;
    }
  } catch (err) {
    // Table might not exist, that's okay
  }

  try {
    // Test trade_ins table
    const { error } = await supabase.from('trade_ins').select('count').limit(1);
    if (!error) {
      status.database.tables.trade_ins = true;
    }
  } catch (err) {
    // Table might not exist, that's okay
  }

  return status;
}

export function logEnvironmentStatus(status: EnvironmentStatus) {
  console.group('🔍 Environment Check Results');
  
  console.group('🌐 Supabase Configuration');
  console.log('URL:', status.supabase.url);
  console.log('Connected:', status.supabase.connected ? '✅' : '❌');
  if (status.supabase.error) console.error('Error:', status.supabase.error);
  console.groupEnd();
  
  console.group('📦 Storage Configuration');
  console.log('Bucket:', status.storage.bucket);
  console.log('Accessible:', status.storage.accessible ? '✅' : '❌');
  if (status.storage.error) console.error('Error:', status.storage.error);
  console.groupEnd();
  
  console.group('⚙️ Environment Settings');
  console.log('Mode:', status.environment.mode);
  console.log('Vercel:', status.environment.isVercel ? 'Yes' : 'No');
  console.log('Timeouts:', status.environment.timeouts);
  console.groupEnd();
  
  console.group('🗄️ Database Tables');
  console.log('Cars:', status.database.tables.cars ? '✅' : '❌');
  console.log('Rentals:', status.database.tables.rentals ? '✅' : '❌');
  console.log('Trade-ins:', status.database.tables.trade_ins ? '✅' : '❌');
  console.groupEnd();
  
  console.groupEnd();
}

// Auto-run environment check on import
if (typeof window !== 'undefined') {
  checkEnvironment().then(logEnvironmentStatus).catch(console.error);
} 