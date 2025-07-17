"use client";
import { useEffect, useState, useRef } from "react";
import { sendMessage, subscribeToMessages, supabase } from "@/lib/supabaseChat";

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch user ID from Supabase Auth
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || "guest");
    });
    // Fetch initial messages
    supabase.from('messages').select('*').order('created_at', { ascending: true }).then(({ data }) => {
      setMessages(data || []);
    });
    // Subscribe to new messages
    const subscription = subscribeToMessages((msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage({ sender_id: userId, content: input });
    setInput("");
  };

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, width: 340, background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #0a254033", display: "flex", flexDirection: "column", zIndex: 1000
    }}>
      <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb", background: "#1e3a8a", color: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, fontWeight: 700 }}>
        JusticeAI Chat
      </div>
      <div style={{ flex: 1, padding: 16, overflowY: "auto", maxHeight: 320, background: "#f9fafb" }}>
        {messages.map((msg, idx) => (
          <div key={msg.id || idx} style={{
            marginBottom: 12,
            textAlign: msg.sender_id === userId ? "right" : "left"
          }}>
            <span style={{
              display: "inline-block",
              background: msg.sender_id === userId ? "#10b981" : "#e5e7eb",
              color: msg.sender_id === userId ? "#fff" : "#222",
              borderRadius: 12,
              padding: "8px 16px",
              fontSize: 15,
              maxWidth: 220,
              wordBreak: "break-word"
            }}>{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #e5e7eb", padding: 8, background: "#fff", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          style={{ flex: 1, border: "none", outline: "none", padding: 8, fontSize: 15, borderRadius: 8, background: "#f3f4f6" }}
        />
        <button onClick={handleSend} style={{ marginLeft: 8, background: "#10b981", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, cursor: "pointer" }}>
          Send
        </button>
      </div>
    </div>
  );
} 