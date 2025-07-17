"use client";
import { useEffect, useState, useRef } from "react";
import { createTicket, subscribeToTickets, supabase } from "@/lib/supabaseSupport";

export default function SupportWidget() {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("open");
  const ticketsEndRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || "guest");
    });
    supabase.from('support_tickets').select('*').order('created_at', { ascending: true }).then(({ data }) => {
      setTickets(data || []);
    });
    const subscription = subscribeToTickets((ticket) => {
      setTickets((prev) => [...prev, ticket]);
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    ticketsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tickets]);

  const handleCreate = async () => {
    if (!subject || !message) return;
    await createTicket({ user_id: userId, subject, message, status });
    setSubject("");
    setMessage("");
  };

  return (
    <div style={{
      position: "fixed", bottom: 24, left: 736, width: 340, background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #0a254033", display: "flex", flexDirection: "column", zIndex: 1000
    }}>
      <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb", background: "#1e3a8a", color: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, fontWeight: 700 }}>
        Support Tickets
      </div>
      <div style={{ flex: 1, padding: 16, overflowY: "auto", maxHeight: 320, background: "#f9fafb" }}>
        {tickets.map((ticket, idx) => (
          <div key={ticket.id || idx} style={{
            marginBottom: 12,
            textAlign: ticket.user_id === userId ? "right" : "left"
          }}>
            <span style={{
              display: "inline-block",
              background: ticket.user_id === userId ? "#10b981" : "#e5e7eb",
              color: ticket.user_id === userId ? "#fff" : "#222",
              borderRadius: 12,
              padding: "8px 16px",
              fontSize: 15,
              maxWidth: 220,
              wordBreak: "break-word"
            }}>{ticket.subject}: {ticket.message} ({ticket.status})</span>
          </div>
        ))}
        <div ref={ticketsEndRef} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #e5e7eb", padding: 8, background: "#fff", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Subject"
          style={{ marginBottom: 8, border: "none", outline: "none", padding: 8, fontSize: 15, borderRadius: 8, background: "#f3f4f6" }}
        />
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Message"
          style={{ marginBottom: 8, border: "none", outline: "none", padding: 8, fontSize: 15, borderRadius: 8, background: "#f3f4f6" }}
        />
        <button onClick={handleCreate} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, cursor: "pointer" }}>
          Create Ticket
        </button>
      </div>
    </div>
  );
} 