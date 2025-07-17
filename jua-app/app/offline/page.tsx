export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #10b981 100%)',
      color: '#fff',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      textAlign: 'center',
      padding: 32
    }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>You are offline</h1>
      <p style={{ fontSize: 18, marginBottom: 24 }}>
        Sorry, it looks like you’ve lost your internet connection.<br />
        Please check your network and try again.
      </p>
      <span style={{ fontSize: 48, marginBottom: 24 }}>🚗</span>
      <p style={{ color: '#facc15', fontWeight: 600, fontSize: 18 }}>Justice Ultimate Automobiles</p>
    </div>
  );
} 