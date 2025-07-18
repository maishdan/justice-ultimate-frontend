import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { analyzeSecurityEvents } from '../../ai/SecurityAI';

export default function SecurityEventsTable() {
  const [events, setEvents] = useState<any[]>([]);
  const [flagged, setFlagged] = useState<any[]>([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  async function fetchEvents() {
    setLoading(true);
    setErrorMsg('');
    // Force session refresh to get latest 2FA status
    await supabase.auth.refreshSession();
    // Debug: Check current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log('Current user for security_events:', userData, userError);
    if (!userData?.user) {
      setErrorMsg('You must be logged in as an admin to view security events.');
      setLoading(false);
      return;
    }
    if (userData.user.app_metadata?.role !== 'admin') {
      setErrorMsg('Only admins can view security events.');
      setLoading(false);
      return;
    }
    // Query security_events
    const { data, error } = await supabase
      .from('security_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);
    if (error) {
      setErrorMsg('Error fetching events: ' + error.message);
      setLoading(false);
      return;
    }
    setEvents(data);
    const ai = await analyzeSecurityEvents();
    setFlagged(ai.flagged);
    setSummary(ai.summary);
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">System Security Monitor (AI)</h2>
      <div className="flex items-center gap-4 mb-2">
        <p className="text-green-700 font-semibold flex-1">{summary}</p>
        <button onClick={fetchEvents} className="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Refresh</button>
      </div>
      {errorMsg && <div className="text-red-600 font-semibold mb-2">{errorMsg}</div>}
      {loading ? <div>Loading security events...</div> : !errorMsg && (
        <table className="min-w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1">Time</th>
              <th className="border px-2 py-1">Event Type</th>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">IP</th>
              <th className="border px-2 py-1">Details</th>
              <th className="border px-2 py-1">AI Verdict</th>
            </tr>
          </thead>
          <tbody>
            {events.map(ev => {
              const aiFlag = flagged.find(f => f.id === ev.id);
              return (
                <tr key={ev.id} className={aiFlag ? 'bg-red-100' : ''}>
                  <td className="border px-2 py-1">{new Date(ev.timestamp).toLocaleString()}</td>
                  <td className="border px-2 py-1">{ev.event_type}</td>
                  <td className="border px-2 py-1">{ev.user_id}</td>
                  <td className="border px-2 py-1">{ev.ip}</td>
                  <td className="border px-2 py-1">{JSON.stringify(ev.details)}</td>
                  <td className="border px-2 py-1">{aiFlag ? aiFlag.reason : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
} 