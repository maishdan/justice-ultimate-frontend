"use client";

import BookingsWidget from "@/components/Bookings/BookingsWidget";
import OrdersWidget from "@/components/Orders/OrdersWidget";
import SupportWidget from "@/components/Support/SupportWidget";
import InventoryWidget from "@/components/Inventory/InventoryWidget";
import ChatWidget from "@/components/Chat/ChatWidget";
import Image from "next/image";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", icon: "🏠" },
  { label: "Bookings", icon: "📅" },
  { label: "Orders", icon: "🧾" },
  { label: "Support", icon: "💬" },
  { label: "Inventory", icon: "🚗" },
  { label: "Chat", icon: "🤖" },
];

const widgetMap = {
  Bookings: <BookingsWidget />,
  Orders: <OrdersWidget />,
  Support: <SupportWidget />,
  Inventory: <InventoryWidget />,
  Chat: <ChatWidget />,
};

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");

  // List of widgets for the dashboard view
  const dashboardWidgets = [
    <BookingsWidget key="Bookings" />, 
    <OrdersWidget key="Orders" />, 
    <SupportWidget key="Support" />, 
    <InventoryWidget key="Inventory" />, 
    <ChatWidget key="Chat" />
  ];

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #1e3a8a 0%, #10b981 100%)",
      fontFamily: "Inter, Segoe UI, Arial, sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <header style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "16px 32px",
        background: "rgba(10,37,64,0.95)",
        boxShadow: "0 2px 16px 0 rgba(16,185,129,0.08)",
        zIndex: 10
      }}>
        <Image src="/logo.png" alt="Justice Ultimate Automobiles logo" width={48} height={48} style={{ borderRadius: 12, marginRight: 16, background: "#fff" }} />
        <span style={{ fontWeight: 800, fontSize: 28, letterSpacing: 1, color: "#facc15", textShadow: "0 2px 8px #0a254033" }}>
          Justice Ultimate Automobiles
        </span>
      </header>
      <div style={{ display: "flex", flex: 1, width: "100%", minHeight: 0 }}>
        {/* Sidebar Menu */}
        <nav style={{
          minWidth: 220,
          background: "rgba(30,58,138,0.95)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "32px 0 0 0",
          boxShadow: "2px 0 16px 0 rgba(16,185,129,0.08)",
          zIndex: 5
        }}>
          {menuItems.map(item => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              style={{
                width: "100%",
                background: active === item.label ? "#10b981" : "transparent",
                color: active === item.label ? "#fff" : "#facc15",
                border: "none",
                outline: "none",
                padding: "18px 32px",
                fontSize: 18,
                fontWeight: 600,
                textAlign: "left",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                boxShadow: active === item.label ? "0 2px 12px #10b98155" : "none",
                borderLeft: active === item.label ? "6px solid #facc15" : "6px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: 12,
                letterSpacing: 0.5
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
              onMouseLeave={e => e.currentTarget.style.background = active === item.label ? "#10b981" : "transparent"}
            >
              <span style={{ fontSize: 22, marginRight: 10 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        {/* Main Content Area */}
        <main style={{
          flex: 1,
          padding: "40px 24px",
          display: "grid",
          gridTemplateColumns: active === "Dashboard" ? "repeat(auto-fit, minmax(340px, 1fr))" : "1fr",
          gap: 32,
          justifyContent: "center",
          alignItems: "flex-start",
          minWidth: 0
        }}>
          {active === "Dashboard"
            ? dashboardWidgets.map((widget, idx) => (
                <div style={tileStyle} className="dashboard-tile" key={idx}>{widget}</div>
              ))
            : (
                <div style={tileStyle} className="dashboard-tile">
                  {widgetMap[active as keyof typeof widgetMap]}
                </div>
              )
          }
        </main>
      </div>
      <style jsx global>{`
        .dashboard-tile {
          background: rgba(255,255,255,0.97);
          border-radius: 20px;
          box-shadow: 0 4px 32px 0 rgba(16,185,129,0.10), 0 1.5px 8px 0 #0a254033;
          padding: 24px 16px 16px 16px;
          min-width: 0;
          min-height: 220px;
          max-width: 100%;
          margin-bottom: 0;
          transition: box-shadow 0.25s;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .dashboard-tile:hover {
          box-shadow: 0 8px 48px 0 #10b98133, 0 2px 16px 0 #0a254033;
        }
        @media (max-width: 900px) {
          main {
            grid-template-columns: 1fr;
            padding: 12px 2px;
            gap: 16px;
          }
        }
        @media (max-width: 600px) {
          header {
            flex-direction: column;
            align-items: flex-start;
            padding: 12px 8px;
          }
          nav {
            min-width: 60px;
            padding: 12px 0 0 0;
          }
          main {
            padding: 8px 2px;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}

const tileStyle = {
  background: "rgba(255,255,255,0.97)",
  borderRadius: 20,
  boxShadow: "0 4px 32px 0 rgba(16,185,129,0.10), 0 1.5px 8px 0 #0a254033",
  padding: "24px 16px 16px 16px",
  minWidth: 0,
  minHeight: 220,
  maxWidth: "100%",
  marginBottom: 0,
  transition: "box-shadow 0.25s",
  display: "flex" as const,
  flexDirection: "column" as const,
  alignItems: "stretch" as const
}; 