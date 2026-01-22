'use client'
import Link from 'next/link'

export default function NextPage() {
  return (
    <main
      style={{
        backgroundColor: '#0b0b0b',
        minHeight: '100vh',
        padding: '80px 32px',
        color: '#f2f2f2',
        fontFamily: "'Playfair Display', Georgia, serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          color: '#7b1e24',
          fontSize: 56,
          marginBottom: 24,
          textShadow: '0 0 20px rgba(123,30,36,0.35)',
        }}
      >
        Ya jelas.
      </h1>

      <p
        style={{
          fontSize: 20,
          maxWidth: 520,
          lineHeight: 1.6,
          opacity: 0.9,
        }}
      >
        Kalo kamu ga ngerasa keren,  
        kamu ga akan ngeklik tombol itu.
      </p>

      <Link href="/">
        <button
          style={{
            marginTop: 48,
            padding: '14px 32px',
            borderRadius: 999,
            border: '1px solid #7b1e24',
            background: 'transparent',
            color: '#7b1e24',
            cursor: 'pointer',
          }}
        >
          Balik lagi
        </button>
      </Link>
    </main>
  )
}
