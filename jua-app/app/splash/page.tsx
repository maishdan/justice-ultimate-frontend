"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import carAnimation from "@/assets/splash.json";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function SplashScreen() {
  const [userName, setUserName] = useState("Guest");
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (data?.user) {
        const name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email || "User";
        setUserName(name);
      }
    });
    const interval = setInterval(() => {
      setProgress((old) => (old < 100 ? old + 2 : 100));
    }, 30);
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2500);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1e3a8a 0%, #10b981 100%)",
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Image
          src="/logo.png"
          alt="Justice Ultimate Automobiles logo"
          width={120}
          height={120}
          style={{ marginBottom: 16, boxShadow: "0 4px 24px #0a254033" }}
        />
        <Lottie animationData={carAnimation} style={{ width: 200, height: 200 }} />
        <div style={{
          width: 220,
          height: 12,
          background: "#e5e7eb",
          borderRadius: 8,
          margin: "24px 0 0 0",
          boxShadow: "0 2px 8px #0a254033"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "#facc15",
            borderRadius: 8,
            transition: "width 0.3s cubic-bezier(.4,2,.6,1)",
            boxShadow: "0 1px 4px #facc1533"
          }} />
        </div>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 28, margin: "24px 0 0 0", letterSpacing: 1 }}>
          Welcome, {userName}!
        </h2>
        <p style={{ color: "#facc15", fontWeight: 600, fontSize: 18, marginTop: 8, letterSpacing: 0.5 }}>
          yourbest car masters
        </p>
        <p style={{ color: "#d1fae5", marginTop: 4, fontSize: 16, fontWeight: 400 }}>
          Drive Your Dream Today
        </p>
      </div>
    </div>
  );
} 