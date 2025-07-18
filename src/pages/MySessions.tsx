import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    async function fetchSessions() {
      const user = supabase.auth.user();
      if (!user) return;
      const { data } = await supabase.from('user_sessions').select('*').eq('user_id', user.id);
      setSessions(data || []);
    }
    fetchSessions();
  }, []);
  async function revokeSession(id: string) {
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
  }
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