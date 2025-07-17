"use client";
import { useEffect, useState, useRef } from "react";
import { addVehicle, subscribeToInventory, supabase } from "@/lib/supabaseInventory";

export default function InventoryWidget() {
  const [vehicles, setVehicles] = useState([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("available");
  const vehiclesEndRef = useRef(null);

  useEffect(() => {
    supabase.from('inventory').select('*').order('created_at', { ascending: true }).then(({ data }) => {
      setVehicles(data || []);
    });
    const subscription = subscribeToInventory((vehicle) => {
      setVehicles((prev) => [...prev, vehicle]);
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    vehiclesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [vehicles]);

  const handleAdd = async () => {
    if (!make || !model || !year || !price) return;
    await addVehicle({ make, model, year, price, status });
    setMake("");
    setModel("");
    setYear("");
    setPrice("");
  };

  return (
    <div style={{
      position: "fixed", bottom: 24, left: 1092, width: 340, background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #0a254033", display: "flex", flexDirection: "column", zIndex: 1000
    }}>
      <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb", background: "#1e3a8a", color: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, fontWeight: 700 }}>
        Inventory
      </div>
      <div style={{ flex: 1, padding: 16, overflowY: "auto", maxHeight: 320, background: "#f9fafb" }}>
        {vehicles.map((vehicle, idx) => (
          <div key={vehicle.id || idx} style={{
            marginBottom: 12,
            textAlign: "left"
          }}>
            <span style={{
              display: "inline-block",
              background: "#e5e7eb",
              color: "#222",
              borderRadius: 12,
              padding: "8px 16px",
              fontSize: 15,
              maxWidth: 220,
              wordBreak: "break-word"
            }}>{vehicle.make} {vehicle.model} ({vehicle.year}) - ${vehicle.price} [{vehicle.status}]</span>
          </div>
        ))}
        <div ref={vehiclesEndRef} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #e5e7eb", padding: 8, background: "#fff", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <input
          value={make}
          onChange={e => setMake(e.target.value)}
          placeholder="Make"
          style={{ marginBottom: 8, border: "none", outline: "none", padding: 8, fontSize: 15, borderRadius: 8, background: "#f3f4f6" }}
        />
        <input
          value={model}
          onChange={e => setModel(e.target.value)}
          placeholder="Model"
          style={{ marginBottom: 8, border: "none", outline: "none", padding: 8, fontSize: 15, borderRadius: 8, background: "#f3f4f6" }}
        />
        <input
          type="number"
          value={year}
          onChange={e => setYear(e.target.value)}
          placeholder="Year"
          style={{ marginBottom: 8, border: "none", outline: "none", padding: 8, fontSize: 15, borderRadius: 8, background: "#f3f4f6" }}
        />
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Price"
          style={{ marginBottom: 8, border: "none", outline: "none", padding: 8, fontSize: 15, borderRadius: 8, background: "#f3f4f6" }}
        />
        <button onClick={handleAdd} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, cursor: "pointer" }}>
          Add Vehicle
        </button>
      </div>
    </div>
  );
} 