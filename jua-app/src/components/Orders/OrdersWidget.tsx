"use client";
import { useEffect, useState, useRef } from "react";
import { createOrder, subscribeToOrders, supabase } from "@/lib/supabaseOrders";

interface Order {
  id: string;
  user_id: string;
  vehicle_id: string;
  amount: number;
  status: string;
  [key: string]: any;
}

export default function OrdersWidget() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("pending");
  const ordersEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || "guest");
    });
    supabase.from('orders').select('*').order('created_at', { ascending: true }).then(({ data }) => {
      setOrders((data as Order[]) || []);
    });
    const subscription = subscribeToOrders((order: Order) => {
      setOrders((prev: Order[]) => [...prev, order]);
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    ordersEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [orders]);

  const handleCreate = async () => {
    if (!vehicleId || !amount) return;
    await createOrder({ user_id: userId, vehicle_id: vehicleId, amount: Number(amount), status });
    setVehicleId("");
    setAmount("");
  };

  return (
    <div style={{
      position: "fixed", bottom: 24, left: 380, width: 340, background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #0a254033", display: "flex", flexDirection: "column", zIndex: 1000
    }}>
      <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb", background: "#1e3a8a", color: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, fontWeight: 700 }}>
        Orders
      </div>
      <div style={{ flex: 1, padding: 16, overflowY: "auto", maxHeight: 320, background: "#f9fafb" }}>
        {orders.map((order, idx) => (
          <div key={order.id || idx} style={{
            marginBottom: 12,
            textAlign: order.user_id === userId ? "right" : "left"
          }}>
            <span style={{
              display: "inline-block",
              background: order.user_id === userId ? "#10b981" : "#e5e7eb",
              color: order.user_id === userId ? "#fff" : "#222",
              borderRadius: 12,
              padding: "8px 16px",
              fontSize: 15,
              maxWidth: 220,
              wordBreak: "break-word"
            }}>{order.vehicle_id} - ${order.amount} ({order.status})</span>
          </div>
        ))}
        <div ref={ordersEndRef} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #e5e7eb", padding: 8, background: "#fff", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <input
          value={vehicleId}
          onChange={e => setVehicleId(e.target.value)}
          placeholder="Vehicle ID"
          style={{ marginBottom: 8, border: "none", outline: "none", padding: 8, fontSize: 15, borderRadius: 8, background: "#f3f4f6" }}
        />
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount"
          style={{ marginBottom: 8, border: "none", outline: "none", padding: 8, fontSize: 15, borderRadius: 8, background: "#f3f4f6" }}
        />
        <button onClick={handleCreate} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, cursor: "pointer" }}>
          Create Order
        </button>
      </div>
    </div>
  );
} 