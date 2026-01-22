'use client'

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

      <p>Web ini dibuat dengan niat.</p>

      <button
        onClick={() => alert('Iya tau kamu keren 😌')}
        style={{
          marginTop: 40,
          padding: '14px 26px',
          borderRadius: 14,
          border: 'none',
          backgroundColor: '#7b1e24',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        Klik kalo kamu ngerasa keren
      </button>
    </main>
  )
}
