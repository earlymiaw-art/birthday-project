'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleClick = async () => {
    const { default: confetti } = await import("canvas-confetti")

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7b1e24', '#5a1419'],
    })

    setTimeout(() => {
      router.push('/next')
    }, 700)
  }
  
  return (
    <main
      style={{
        backgroundColor: '#0b0b0b',
        minHeight: '100vh',
        padding: '120px 32px',
        color: '#f2f2f2',
        fontFamily:
          "'Playfair Display', 'Georgia', serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* TITLE */}
      <h1
        style={{
          color: '#7b1e24',
          fontSize: 64,
          letterSpacing: '-1px',
          marginBottom: 24,
          textShadow: '0 0 20px rgba(123,30,36,0.35)',
        }}
      >
        Another Year.
      </h1>

      {/* SUBTEXT */}
      <p
        style={{
          fontSize: 20,
          maxWidth: 520,
          lineHeight: 1.6,
          opacity: 0.9,
        }}
      >
        Web ini dibuat karena ya masa engga? wkwk
      </p>

      {/* DIVIDER */}
      <div
        style={{
          width: 80,
          height: 2,
          backgroundColor: '#7b1e24',
          margin: '48px 0',
          opacity: 0.6,
        }}
      />

      {/* BUTTON */}
        <Link
    href="/next"
    style={{
      padding: '16px 36px',
      borderRadius: 999,
      border: '1px solid #7b1e24',
      background: 'transparent',
      color: '#7b1e24',
      fontSize: 16,
      letterSpacing: 0.5,
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      textDecoration: 'none',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#7b1e24'
      e.currentTarget.style.color = '#fff'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent'
      e.currentTarget.style.color = '#7b1e24'
    }}
  >
    Klik kalo kamu ngerasa keren
  </Link>



      {/* FOOTER NOTE */}
      <p
        style={{
          marginTop: 120,
          fontSize: 14,
          opacity: 0.5,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        dibuat karena adalah pokoknya:b
      </p>
    </main>
  )
}
