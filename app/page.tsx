export default function Home() {
  return (
    <main style={{
      backgroundColor: '#0f0f0f',
      minHeight: '100vh',
      padding: '80px 40px',
      color: '#eaeaea',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ color: '#7b1e24', fontSize: 48 }}>
        Happy Birthday.
      </h1>

      <p style={{ opacity: 0.8 }}>
        Web ini dibuat dengan niat.
        Dan sedikit kegabutan.
      </p>

      <p style={{ marginTop: 20 }}>
        Katanya makin dewasa.
        Tapi ketawanya masih receh.
      </p>

      <button
        onClick={() => alert('Iya tau kamu keren. Jangan GR 😌')}
        style={{
          marginTop: 40,
          padding: '14px 26px',
          borderRadius: 14,
          border: 'none',
          backgroundColor: '#7b1e24',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 16
        }}
      >
        Klik kalo kamu ngerasa keren
      </button>

      <div style={{ marginTop: 120, maxWidth: 600 }}>
        <p style={{ fontSize: 14, opacity: 0.6 }}>
          Bercanda dikit.
        </p>
        <p>
          Tapi seriusnya,
          makasih udah jadi temen yang bikin hidup ga flat.
        </p>
      </div>
    </main>
  )
}
