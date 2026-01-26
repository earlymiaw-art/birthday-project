'use client'
import { useEffect, useRef, useState } from 'react'

export default function ScratchPage() {
  const imgCanvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)

  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  const imgCache = useRef<HTMLImageElement | null>(null)

  // 🔥 SLIDE STATE
  const [slide, setSlide] = useState(0)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    const imgCanvas = imgCanvasRef.current!
    const maskCanvas = maskCanvasRef.current!

    const imgCtx = imgCanvas.getContext('2d')!
    const maskCtx = maskCanvas.getContext('2d')!

    const img = new Image()
    img.src = '/img/photo.jpg'

    img.onload = () => {
      imgCache.current = img

      const w = img.width
      const h = img.height

      imgCanvas.width = w
      imgCanvas.height = h
      maskCanvas.width = w
      maskCanvas.height = h

      // 🔥 GAMBAR ASLI (BERWARNA)
      imgCtx.drawImage(img, 0, 0, w, h)

      // 🔥 TUTUP ARSIR
      maskCtx.fillStyle = '#111'
      maskCtx.fillRect(0, 0, w, h)

      maskCtx.fillStyle = '#7b1e24'
      maskCtx.font = '24px serif'
      maskCtx.textAlign = 'center'
      maskCtx.fillText('Gosok sampai 100%', w / 2, h / 2)
    }
  }, [])

  const getPos = (e: any) => {
    const rect = maskCanvasRef.current!.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    return { x, y }
  }

  const calculateProgress = () => {
    const canvas = maskCanvasRef.current!
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data

    let transparent = 0
    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] === 0) transparent++
    }

    const percent = Math.min(
      100,
      Math.round((transparent / (imageData.length / 4)) * 100)
    )

    setProgress(percent)

    if (percent >= 100 && !done) finish()
  }

  const finish = () => {
    const imgCtx = imgCanvasRef.current!.getContext('2d')!
    const img = imgCache.current!

    // 🔥 GAMBAR BAWAH JADI HITAM PUTIH
    imgCtx.clearRect(
      0,
      0,
      imgCanvasRef.current!.width,
      imgCanvasRef.current!.height
    )
    imgCtx.filter = 'grayscale(100%)'
    imgCtx.drawImage(img, 0, 0)
    imgCtx.filter = 'none'

    setDone(true)
  }

  const draw = (e: any) => {
    if (!isDrawing.current || done) return
    e.preventDefault()

    const ctx = maskCanvasRef.current!.getContext('2d')!
    const { x, y } = getPos(e)

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 32, 0, Math.PI * 2)
    ctx.fill()

    calculateProgress()
  }

  // 🔥 SWIPE SLIDE (HP)
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return
    const diff = startX.current - e.changedTouches[0].clientX

    if (diff > 50 && slide < 2) setSlide(slide + 1)
    if (diff < -50 && slide > 0) setSlide(slide - 1)

    startX.current = null
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
      {/* 🔥 SLIDER WRAPPER */}
      <div
        style={{ width: 320, overflow: 'hidden' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            display: 'flex',
            transform: `translateX(-${slide * 100}%)`,
            transition: 'transform .4s ease',
          }}
        >
          {/* ===== SLIDE 1 (SCRATCH) ===== */}
          <div style={{ minWidth: '100%', position: 'relative' }}>
            <canvas ref={imgCanvasRef} style={{ borderRadius: 16 }} />

            {!done && (
              <canvas
                ref={maskCanvasRef}
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

            {!done && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 14,
                }}
              >
                {progress}%
              </div>
            )}

            {done && (
              <div
                style={{
                  position: 'absolute',
                  bottom: -80,
                  left: 12,
                  right: 12,
                  background: '#fff',
                  borderRadius: 18,
                  padding: 12,
                  boxShadow: '0 10px 30px rgba(0,0,0,.4)',
                }}
              >
                <img
                  src="/img/photo.jpg"
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                />

                <p style={{ margin: 4, fontWeight: 'bold', color: '#000' }}>
                  Dari Bocah Roblok:b
                </p>
                <p style={{ margin: 4, color: '#000' }}>
                  HBD YA, JGN LUPA LOGIN ROBLOK.
                </p>
                <small style={{ color: '#000' }}>mwah</small>
              </div>
            )}
          </div>

          {/* ===== SLIDE 2 ===== */}
          <div style={{ minWidth: '100%' }}>
            <img
              src="/img/photo2.jpg"
              style={{ width: '100%', borderRadius: 16 }}
            />
          </div>

          {/* ===== SLIDE 3 ===== */}
          <div style={{ minWidth: '100%' }}>
            <img
              src="/img/photo3.jpg"
              style={{ width: '100%', borderRadius: 16 }}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
