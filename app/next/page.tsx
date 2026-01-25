'use client'
import { useEffect, useRef, useState } from 'react'

export default function ScratchPage() {
  const imgCanvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)

  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  const imgSrc = '/img/photo.jpg'

  useEffect(() => {
    const imgCanvas = imgCanvasRef.current!
    const maskCanvas = maskCanvasRef.current!

    const imgCtx = imgCanvas.getContext('2d')!
    const maskCtx = maskCanvas.getContext('2d')!

    const img = new Image()
    img.src = imgSrc

    img.onload = () => {
      const w = img.width
      const h = img.height

      imgCanvas.width = w
      imgCanvas.height = h
      maskCanvas.width = w
      maskCanvas.height = h

      // 🔥 GAMBAR AWAL BERWARNA
      imgCtx.drawImage(img, 0, 0, w, h)

      // 🔥 OVERLAY ARSIR
      maskCtx.fillStyle = '#0b0b0b'
      maskCtx.fillRect(0, 0, w, h)

      maskCtx.fillStyle = '#7b1e24'
      maskCtx.font = '24px serif'
      maskCtx.textAlign = 'center'
      maskCtx.fillText('Gosok sampai 100%', w / 2, h / 2)
    }
  }, [])

  const calculateProgress = () => {
    const canvas = maskCanvasRef.current!
    const ctx = canvas.getContext('2d')!
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data

    let transparent = 0
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparent++
    }

    const percent = Math.round((transparent / (data.length / 4)) * 100)
    setProgress(percent)

    if (percent >= 100) {
      setDone(true)

      // 🔥 JADI HITAM PUTIH
      const img = new Image()
      img.src = imgSrc
      img.onload = () => {
        const ctxImg = imgCanvasRef.current!.getContext('2d')!
        ctxImg.filter = 'grayscale(100%)'
        ctxImg.drawImage(img, 0, 0)
        ctxImg.filter = 'none'
      }
    }
  }

  const draw = (e: any) => {
    if (!isDrawing.current || done) return
    e.preventDefault()

    const ctx = maskCanvasRef.current!.getContext('2d')!
    const rect = maskCanvasRef.current!.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 32, 0, Math.PI * 2)
    ctx.fill()

    calculateProgress()
  }

  return (
    <main style={{ background: '#000', minHeight: '100vh', padding: 24 }}>
      {/* CANVAS */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <canvas ref={imgCanvasRef} style={{ borderRadius: 16 }} />

        {!done && (
          <canvas
            ref={maskCanvasRef}
            onMouseDown={() => (isDrawing.current = true)}
            onMouseUp={() => (isDrawing.current = false)}
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
      </div>

      {/* CARD SETELAH SELESAI */}
      {done && (
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <img
            src={imgSrc}
            style={{ width: '100%', maxWidth: 360, borderRadius: 16 }}
          />

          <h3 style={{ marginTop: 16 }}>Dari aku</h3>
          <p>meong</p>

          <p style={{ marginTop: 16 }}>
            Ini nanti kamu bebas nulis ucapan panjang,
            mau lebay, mau manis, mau nangis juga bisa.
          </p>
        </div>
      )}
    </main>
  )
}
