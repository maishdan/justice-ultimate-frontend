export default function TestHeaderFixed() {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          background: 'red',
          color: 'white',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
        }}
      >
        FIXED HEADER TEST
      </div>
      <div style={{ height: 3000, background: 'linear-gradient(white, gray)' }}>
        <h1 style={{ marginTop: 80, textAlign: 'center' }}>Scroll Down</h1>
        <p style={{ textAlign: 'center', marginTop: 40, fontSize: 24 }}>
          The red header should always remain visible at the very top as you scroll.
        </p>
      </div>
    </>
  );
} 