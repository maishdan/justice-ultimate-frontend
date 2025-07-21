import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { uploadConfig, getOptimizedTimeout, createTimeoutPromise } from '../lib/uploadConfig';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
}

export default function DatabaseConnectionTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  // Auto-run tests when component mounts
  useEffect(() => {
    runAllTests();
  }, []);

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    setTestResults([]);

    const tests = [
      { name: 'Supabase Connection', test: testSupabaseConnection },
      { name: 'Database Read Access', test: testDatabaseRead },
      { name: 'Database Write Access', test: testDatabaseWrite },
      { name: 'Storage Bucket Access', test: testStorageAccess },
      { name: 'Storage Upload Test', test: testStorageUpload },
      { name: 'Environment Detection', test: testEnvironmentDetection },
      { name: 'Timeout Configuration', test: testTimeoutConfiguration },
    ];

    const results: TestResult[] = [];

    for (const { name, test } of tests) {
      const startTime = Date.now();
      const result: TestResult = { name, status: 'pending', message: 'Running...' };
      
      setTestResults([...results, result]);
      
      try {
        const testResult = await test();
        const duration = Date.now() - startTime;
        results.push({
          name,
          status: 'success',
          message: testResult,
          duration
        });
      } catch (error) {
        const duration = Date.now() - startTime;
        results.push({
          name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          duration
        });
      }
      
      setTestResults([...results]);
    }

    const hasErrors = results.some(r => r.status === 'error');
    setOverallStatus(hasErrors ? 'error' : 'success');
    setIsRunning(false);
  };

  const testSupabaseConnection = async (): Promise<string> => {
    const connectionTimeout = getOptimizedTimeout('connection');
    const connectionPromise = supabase.from('cars').select('count').limit(1);
    const timeoutPromise = createTimeoutPromise(connectionTimeout, 'Connection timeout');
    // Await both and check which resolves first
    const result = await Promise.race([connectionPromise, timeoutPromise]);
    // result can be { data, error } or a string (timeout message)
    if (typeof result === 'string') throw new Error(result);
    const { data, error } = result as { data: any; error: any };
    if (error) throw new Error(`Connection failed: ${error.message}`);
    return `Connected successfully. Found ${data?.length || 0} records.`;
  };

  const testDatabaseRead = async (): Promise<string> => {
    const { data: _data, error } = await supabase.from('cars').select('id, name').limit(5);
    if (error) throw new Error(`Read failed: ${error.message}`);
    return `Read successful.`;
  };

  const testDatabaseWrite = async (): Promise<string> => {
    // Test with a temporary record
    const testData = {
      name: 'Connection Test Car',
      brand: 'Test Brand',
      year: '2024',
      price: '100000',
      status: 'draft'
    };
    
    const { data: _data, error } = await supabase.from('cars').insert([testData]).select();
    if (error) throw new Error(`Write failed: ${error.message}`);
    // Clean up test data
    if (_data && _data[0]) {
      await supabase.from('cars').delete().eq('id', _data[0].id);
    }
    return 'Write and delete test successful.';
  };

  const testStorageAccess = async (): Promise<string> => {
    const { data, error } = await supabase.storage.from('vehicles').list('', { limit: 1 });
    if (error) throw new Error(`Storage access failed: ${error.message}`);
    return `Storage access successful. Bucket contains files.`;
  };

  const testStorageUpload = async (): Promise<string> => {
    // Create a small test file
    const testContent = 'Test file for connection verification';
    const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });
    
    const fileName = `test_${Date.now()}.txt`;
    const uploadTimeout = getOptimizedTimeout('upload');
    
    const uploadPromise = supabase.storage.from('vehicles').upload(fileName, testFile, {
      upsert: true,
      cacheControl: uploadConfig.supabase.cacheControl
    });
    const timeoutPromise: Promise<never> = createTimeoutPromise(uploadTimeout, 'Upload timeout');
    
    const result = await (Promise.race([uploadPromise, timeoutPromise]) as Promise<{ data: any; error: any } | string>);
    if (typeof result === 'string') throw new Error(result);
    const { data, error } = result;
    if (error) throw new Error(`Upload failed: ${error.message}`);
    
    // Clean up test file
    await supabase.storage.from('vehicles').remove([fileName]);
    
    return 'Storage upload and delete test successful.';
  };

  const testEnvironmentDetection = async (): Promise<string> => {
    const env = {
      isDevelopment: uploadConfig.environment.isDevelopment,
      isProduction: uploadConfig.environment.isProduction,
      isVercel: uploadConfig.environment.isVercel,
      bucket: uploadConfig.supabase.bucket
    };
    
    return `Environment: ${env.isDevelopment ? 'Development' : env.isProduction ? 'Production' : 'Unknown'}, 
            Vercel: ${env.isVercel ? 'Yes' : 'No'}, 
            Bucket: ${env.bucket}`;
  };

  const testTimeoutConfiguration = async (): Promise<string> => {
    const timeouts = {
      upload: getOptimizedTimeout('upload'),
      database: getOptimizedTimeout('database'),
      connection: getOptimizedTimeout('connection')
    };
    
    return `Timeouts configured - Upload: ${timeouts.upload}ms, Database: ${timeouts.database}ms, Connection: ${timeouts.connection}ms`;
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Database Connection Test
        </h2>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isRunning
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </button>
      </div>

      {/* Overall Status */}
      <div className="mb-6">
        <div className={`p-4 rounded-lg ${
          overallStatus === 'idle' ? 'bg-gray-100 dark:bg-gray-800' :
          overallStatus === 'running' ? 'bg-yellow-100 dark:bg-yellow-900' :
          overallStatus === 'success' ? 'bg-green-100 dark:bg-green-900' :
          'bg-red-100 dark:bg-red-900'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              overallStatus === 'idle' ? 'bg-gray-400' :
              overallStatus === 'running' ? 'bg-yellow-500 animate-pulse' :
              overallStatus === 'success' ? 'bg-green-500' :
              'bg-red-500'
            }`} />
            <span className="font-medium">
              {overallStatus === 'idle' ? 'Ready to test' :
               overallStatus === 'running' ? 'Tests running...' :
               overallStatus === 'success' ? 'All tests passed!' :
               'Some tests failed'}
            </span>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="space-y-3">
        {testResults.map((result, index) => (
          <div key={index} className={`p-4 rounded-lg border ${
            result.status === 'pending' ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' :
            result.status === 'success' ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700' :
            'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${
                  result.status === 'pending' ? 'bg-gray-400 animate-pulse' :
                  result.status === 'success' ? 'bg-green-500' :
                  'bg-red-500'
                }`} />
                <span className="font-medium text-gray-900 dark:text-white">
                  {result.name}
                </span>
              </div>
              {result.duration && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {result.duration}ms
                </span>
              )}
            </div>
            <p className={`mt-2 text-sm ${
              result.status === 'pending' ? 'text-gray-600 dark:text-gray-300' :
              result.status === 'success' ? 'text-green-700 dark:text-green-300' :
              'text-red-700 dark:text-red-300'
            }`}>
              {result.message}
            </p>
          </div>
        ))}
      </div>

      {/* Configuration Info */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Configuration</h3>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL || "https://tyypdmhxuehzddudeuww.supabase.co"}</div>
          <div>Environment: {uploadConfig.environment.isDevelopment ? 'Development' : uploadConfig.environment.isProduction ? 'Production' : 'Unknown'}</div>
          <div>Storage Bucket: {uploadConfig.supabase.bucket}</div>
          <div>Upload Timeout: {getOptimizedTimeout('upload')}ms</div>
          <div>Database Timeout: {getOptimizedTimeout('database')}ms</div>
        </div>
      </div>
    </div>
  );
} 