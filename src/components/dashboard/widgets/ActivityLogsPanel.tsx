import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function ActivityLogsPanel() {
  const [sessionLogs, setSessionLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cache, setCache] = useState<{[key: string]: any[]}>({});

  // Fast data fetching with caching
  const fetchSessionLogs = useCallback(async (pageNum = 1, useCache = true) => {
    const cacheKey = `logs_page_${pageNum}_${filter}`;
    
    // Return cached data if available and requested
    if (useCache && cache[cacheKey]) {
      setSessionLogs(cache[cacheKey]);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );

      const queryPromise = supabase
        .from('user_sessions')
        .select('*')
        .order('last_active', { ascending: false })
        .range((pageNum - 1) * 20, pageNum * 20 - 1);

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      if (error) throw error;
      
      const logs = data || [];
      setSessionLogs(logs);
      setHasMore(logs.length === 20);
      
      // Cache the results
      setCache(prev => ({ ...prev, [cacheKey]: logs }));
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch session logs');
      // Fallback to mock data if database fails
      setSessionLogs([
        {
          user_id: 'demo-user-1',
          session_id: 'session-demo-1',
          ip_address: '192.168.1.100',
          user_agent: 'Chrome/120.0.0.0',
          last_active: new Date().toISOString()
        },
        {
          user_id: 'demo-user-2', 
          session_id: 'session-demo-2',
          ip_address: '192.168.1.101',
          user_agent: 'Firefox/119.0.0.0',
          last_active: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [filter, cache]);

  useEffect(() => { 
    fetchSessionLogs(1, false); 
  }, [fetchSessionLogs]);

  const filteredLogs = filter
    ? sessionLogs.filter(log =>
        log.user_id?.toLowerCase().includes(filter.toLowerCase()) ||
        log.session_id?.toLowerCase().includes(filter.toLowerCase()) ||
        log.ip_address?.toLowerCase().includes(filter.toLowerCase())
      )
    : sessionLogs;

  const exportLogs = () => {
    const csv = [
      ['User ID', 'Session ID', 'IP Address', 'User Agent', 'Last Active'].join(','),
      ...filteredLogs.map(log => [
        log.user_id,
        log.session_id,
        log.ip_address,
        log.user_agent,
        new Date(log.last_active).toLocaleString()
      ].map(field => `"${field || ''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'session_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSessionLogs(nextPage, true);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto glass-panel rounded-2xl shadow-xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-200">Activity & Session Logs</h2>
      <p className="text-gray-500 mb-6">Real-time session logs for advanced security monitoring. Filter, export, and audit all user sessions.</p>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by user, session, or IP..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button 
          onClick={() => fetchSessionLogs(1, false)} 
          className="px-4 py-2 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
        <button onClick={exportLogs} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Export Logs</button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50 dark:bg-blue-900/40">
              <th className="px-4 py-2 text-left font-semibold text-blue-700 dark:text-blue-200">User ID</th>
              <th className="px-4 py-2 text-left font-semibold text-blue-700 dark:text-blue-200">Session ID</th>
              <th className="px-4 py-2 text-left font-semibold text-blue-700 dark:text-blue-200">IP Address</th>
              <th className="px-4 py-2 text-left font-semibold text-blue-700 dark:text-blue-200">User Agent</th>
              <th className="px-4 py-2 text-left font-semibold text-blue-700 dark:text-blue-200">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {loading && page === 1 ? (
              <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
            ) : filteredLogs.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4">No session logs found.</td></tr>
            ) : filteredLogs.map((log, idx) => (
              <tr key={idx} className="border-b border-blue-100 dark:border-blue-800 hover:bg-blue-50/60 dark:hover:bg-blue-900/30 transition">
                <td className="px-4 py-2 font-mono text-xs">{log.user_id}</td>
                <td className="px-4 py-2 font-mono text-xs">{log.session_id?.slice(0, 12)}...</td>
                <td className="px-4 py-2 font-mono text-xs">{log.ip_address}</td>
                <td className="px-4 py-2 font-mono text-xs">{log.user_agent}</td>
                <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{new Date(log.last_active).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
} 