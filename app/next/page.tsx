'use client'
import { useEffect, useRef, useState } from 'react'

export default function ScratchPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawing = useRef(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const img = new Image()
    img.src = '/img/photo.jpg'

    img.onload = () => {
      const maxWidth = window.innerWidth * 0.9
      const scale = img.width > maxWidth ? maxWidth / img.width : 1

      canvas.width = img.width * scale
      canvas.height = img.height * scale

      /** 1️⃣ gambar HITAM PUTIH (background) */
      ctx.filter = 'grayscale(100%)'
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      /** 2️⃣ gambar WARNA (layer atas) */
      ctx.filter = 'none'
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      /** 3️⃣ siap dihapus */
      ctx.globalCompositeOperation = 'destination-out'
    }
  }, [])

  const getPos = (e: any) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const touch = e.touches?.[0]
    return {
      x: (touch ? touch.clientX : e.clientX) - rect.left,
      y: (touch ? touch.clientY : e.clientY) - rect.top,
    }
  }

  const startDraw = () => (isDrawing.current = true)
  const endDraw = () => (isDrawing.current = false)

  const calculateProgress = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    let transparent = 0
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++
    }

    const percent = Math.round((transparent / (pixels.length / 4)) * 100)
    setProgress(percent)

    if (percent >= 100) setDone(true)
  }

  const draw = (e: any) => {
    if (!isDrawing.current || done) return
    e.preventDefault()

    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = getPos(e)

    ctx.beginPath()
    ctx.arc(x, y, 40, 0, Math.PI * 2)
    ctx.fill()

    calculateProgress()
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        gap: 16,
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
        }}
      />

      {!done && <p>Digosok {progress}%</p>}
      {done && <p>🎉 Kebuka semua!</p>}
    </main>
  )
}
