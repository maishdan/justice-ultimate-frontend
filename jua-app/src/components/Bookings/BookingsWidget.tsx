"use client";
import { useEffect, useState, useRef, RefObject } from "react";
import { createBooking, subscribeToBookings, supabase } from "@/lib/supabaseBookings";

interface Booking {
  id: string;
  user_id: string;
  vehicle_id: string;
  date: string;
  status: string;
  [key: string]: any;
}

export default function BookingsWidget() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [date, setDate] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("pending");
  const bookingsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || "guest");
    });
    supabase.from('bookings').select('*').order('date', { ascending: true }).then(({ data }) => {
      setBookings((data as Booking[]) || []);
    });
    const subscription = subscribeToBookings((booking: Booking) => {
      setBookings((prev: Booking[]) => [...prev, booking]);
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    bookingsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bookings]);

  const handleCreate = async () => {
    if (!vehicleId || !date) return;
    await createBooking({ user_id: userId, vehicle_id: vehicleId, date, status });
    setVehicleId("");
    setDate("");
  };

  return (
    <div style={{
      position: "fixed", bottom: 24, left: 24, width: 340, background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #0a254033", display: "flex", flexDirection: "column", zIndex: 1000
    }}>
      <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb", background: "#1e3a8a", color: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, fontWeight: 700 }}>
        Bookings
      </div>
      <div style={{ flex: 1, padding: 16, overflowY: "auto", maxHeight: 320, background: "#f9fafb" }}>
        {bookings.map((booking, idx) => (
          <div key={booking.id || idx} style={{
            marginBottom: 12,
            textAlign: booking.user_id === userId ? "right" : "left"
          }}>
            <span style={{
              display: "inline-block",
              background: booking.user_id === userId ? "#10b981" : "#e5e7eb",
              color: booking.user_id === userId ? "#fff" : "#222",
              borderRadius: 12,
              padding: "8px 16px",
              fontSize: 15,
              maxWidth: 220,
              wordBreak: "break-word"
            }}>{booking.vehicle_id} on {booking.date} ({booking.status})</span>
          </div>
        ))}
        <div ref={bookingsEndRef} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #e5e7eb", padding: 8, background: "#fff", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <input
          value={vehicleId}
          onChange={e => setVehicleId(e.target.value)}
          placeholder="Vehicle ID"
          style={{ marginBottom: 8, border: "none", outline: "none", padding: 8, fontSize: 15, borderRadius: 8, background: "#f3f4f6" }}
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ marginBottom: 8, border: "none", outline: "none", padding: 8, fontSize: 15, borderRadius: 8, background: "#f3f4f6" }}
        />
        <button onClick={handleCreate} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, cursor: "pointer" }}>
          Create Booking
        </button>
      </div>
    </div>
  );
} 