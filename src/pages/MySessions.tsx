import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      setError('');
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setError('User not authenticated');
          return;
        }
        
        const { data, error } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          setError(error.message);
          return;
        }
        
        setSessions(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  async function revokeSession(id: string) {
    try {
      let url = 'http://localhost:5001/api/session/revoke';
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        url = 'https://backend-jua.onrender.com/api/session/revoke';
      }
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: id }),
      });
      setSessions(sessions => sessions.filter(s => s.id !== id));
    } catch (err: any) {
      console.error('Failed to revoke session:', err);
    }
  }

  if (loading) return <div>Loading sessions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Sessions</h2>
      <ul>
        {sessions.map((s: any) => (
          <li key={s.id}>
            {s.device_info} - {s.ip} - {new Date(s.created_at).toLocaleString()}
            <button onClick={() => revokeSession(s.id)}>Revoke</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 