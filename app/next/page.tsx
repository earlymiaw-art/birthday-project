'use client'
import { useEffect, useRef, useState } from 'react'

export default function ScratchPage() {
  const colorCanvasRef = useRef<HTMLCanvasElement>(null) // gambar warna
  const bwCanvasRef = useRef<HTMLCanvasElement>(null)    // gambar BW + digosok
  const isDrawing = useRef(false)

  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const colorCanvas = colorCanvasRef.current!
    const bwCanvas = bwCanvasRef.current!

    const colorCtx = colorCanvas.getContext('2d')!
    const bwCtx = bwCanvas.getContext('2d')!

    const img = new Image()
    img.src = '/img/photo.jpg'

    img.onload = () => {
      const w = img.width
      const h = img.height

      colorCanvas.width = w
      colorCanvas.height = h
      bwCanvas.width = w
      bwCanvas.height = h

      // 🔥 BASE: GAMBAR WARNA (DI BAWAH)
      colorCtx.drawImage(img, 0, 0, w, h)

      // 🔥 ATAS: GAMBAR HITAM PUTIH
      bwCtx.filter = 'grayscale(100%)'
      bwCtx.drawImage(img, 0, 0, w, h)
      bwCtx.filter = 'none'

      // 🔥 TULISAN
      bwCtx.fillStyle = 'rgba(0,0,0,0.6)'
      bwCtx.fillRect(0, h / 2 - 40, w, 80)

      bwCtx.fillStyle = '#fff'
      bwCtx.font = '24px serif'
      bwCtx.textAlign = 'center'
      bwCtx.fillText('Gosok sampai 100%', w / 2, h / 2)
    }
  }, [])

  const getPos = (e: any) => {
    const rect = bwCanvasRef.current!.getBoundingClientRect()
    const x =
      (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y =
      (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    return { x, y }
  }

  const calculateProgress = () => {
    const canvas = bwCanvasRef.current!
    const ctx = canvas.getContext('2d')!
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data

    let cleared = 0
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) cleared++
    }

    const percent = Math.round(
      (cleared / (data.length / 4)) * 100
    )

    setProgress(percent)

    if (percent >= 100) {
      setDone(true)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const draw = (e: any) => {
    if (!isDrawing.current || done) return
    e.preventDefault()

    const ctx = bwCanvasRef.current!.getContext('2d')!
    const { x, y } = getPos(e)

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 35, 0, Math.PI * 2)
    ctx.fill()

    calculateProgress()
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ position: 'relative' }}>
        {/* GAMBAR WARNA */}
        <canvas ref={colorCanvasRef} style={{ borderRadius: 16 }} />

        {/* BW DIGOSOK */}
        {!done && (
          <canvas
            ref={bwCanvasRef}
            onMouseDown={() => (isDrawing.current = true)}
            onMouseUp={() => (isDrawing.current = false)}
            onMouseLeave={() => (isDrawing.current = false)}
            onMouseMove={draw}
            onTouchStart={() => (isDrawing.current = true)}
            onTouchEnd={() => (isDrawing.current = false)}
            onTouchMove={draw}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 16,
              touchAction: 'none',
            }}
          />
        )}

        {/* PROGRESS */}
        {!done && (
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: 14,
            }}
          >
            {progress}%
          </div>
        )}

        {/* CARD SETELAH SELESAI */}
        {done && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#fff',
              borderRadius: 16,
              padding: 16,
              textAlign: 'center',
            }}
          >
            <img
              src="/img/photo.jpg"
              style={{ width: '100%', borderRadius: 12 }}
            />
            <p style={{ marginTop: 12, fontWeight: 600 }}>
              Ini pesan dari aku 💌
            </p>
            <p>Isi ucapan bebas lu mau nulis apa</p>
          </div>
        )}
      </div>
    </main>
  )
}
