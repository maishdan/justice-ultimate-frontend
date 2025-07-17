import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="https://tyypdmhxuehzddudeuww.supabase.co/storage/v1/object/public/avatars/logo.png"
          alt="Justice Ultimate Automobiles logo"
          width={180}
          height={180}
          priority
        />
        <h1>Welcome to Justice Ultimate Automobiles</h1>
        <p>Drive Your Dream Today</p>
        <Link href="/splash" style={{
          marginTop: 24,
          padding: "12px 24px",
          background: "#facc15",
          color: "#222",
          borderRadius: 8,
          fontWeight: "bold",
          textDecoration: "none",
          display: "inline-block"
        }}>
          View Splash Screen
        </Link>
      </main>
    </div>
  );
}