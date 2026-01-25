'use client'
import { useEffect, useRef } from 'react'

export default function ScratchPage() {
  const imgCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawing = useRef(false)

  useEffect(() => {
    const imgCanvas = imgCanvasRef.current
    const maskCanvas = maskCanvasRef.current
    if (!imgCanvas || !maskCanvas) return

    const imgCtx = imgCanvas.getContext('2d')
    const maskCtx = maskCanvas.getContext('2d')
    if (!imgCtx || !maskCtx) return

    const img = new Image()
    img.src = '/img/photo.jpg'

    img.onload = () => {
      const maxWidth = window.innerWidth * 0.9
      const scale = img.width > maxWidth ? maxWidth / img.width : 1

      const w = img.width * scale
      const h = img.height * scale

      imgCanvas.width = w
      imgCanvas.height = h
      maskCanvas.width = w
      maskCanvas.height = h

      // gambar asli (bawah)
      imgCtx.drawImage(img, 0, 0, w, h)

      // arsir (atas)
      maskCtx.fillStyle = '#0b0b0b'
      maskCtx.fillRect(0, 0, w, h)

      maskCtx.fillStyle = '#7b1e24'
      maskCtx.font = '24px serif'
      maskCtx.textAlign = 'center'
      maskCtx.fillText('Gosok biar keliatan', w / 2, h / 2)
    }
  }, [])

  const getPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = maskCanvasRef.current!
    const rect = canvas.getBoundingClientRect()

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDraw = () => {
    isDrawing.current = true
  }

  const endDraw = () => {
    isDrawing.current = false
  }

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing.current) return
    e.preventDefault()

    const canvas = maskCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getPos(e)

    // 🔥 INI YANG PASTI KEBUKA
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 35, 0, Math.PI * 2)
    ctx.fill()
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative' }}>
        {/* GAMBAR */}
        <canvas
          ref={imgCanvasRef}
          style={{ borderRadius: 16 }}
        />

        {/* ARSIR (DIGOSOK) */}
        <canvas
          ref={maskCanvasRef}
          onMouseDown={startDraw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onMouseMove={draw}
          onTouchStart={startDraw}
          onTouchEnd={endDraw}
          onTouchMove={draw}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            touchAction: 'none',
            cursor: 'pointer',
          }}
        />
      </div>
    </main>
  )
}
