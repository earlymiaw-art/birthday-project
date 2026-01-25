'use client'
import { useEffect, useRef } from 'react'

export default function ScratchPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = '/img/photo.jpg'

    img.onload = () => {
      const maxWidth = window.innerWidth * 0.9
      const scale = img.width > maxWidth ? maxWidth / img.width : 1

      canvas.width = img.width * scale
      canvas.height = img.height * scale

      // gambar asli
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // tutup overlay
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#0b0b0b'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // teks
      ctx.fillStyle = '#7b1e24'
      ctx.font = '24px serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        'Gosok biar keliatan',
        canvas.width / 2,
        canvas.height / 2
      )
    }
  }, [])

  const getPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current!
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

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getPos(e)

    // 🔥 FIX ASLI: erase paksa
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 32, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
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
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onMouseMove={draw}
        onTouchStart={startDraw}
        onTouchEnd={endDraw}
        onTouchMove={draw}
        style={{
          maxWidth: '90%',
          borderRadius: 16,
          touchAction: 'none',
          cursor: 'pointer',
        }}
      />
    </main>
  )
}
