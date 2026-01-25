'use client'
import { useEffect, useRef, useState } from 'react'

export default function ScratchPage() {
  const imgCanvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)

  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const imgCanvas = imgCanvasRef.current!
    const maskCanvas = maskCanvasRef.current!

    const imgCtx = imgCanvas.getContext('2d')!
    const maskCtx = maskCanvas.getContext('2d')!

    const img = new Image()
    img.src = '/img/photo.jpg'

    img.onload = () => {
      const w = img.width
      const h = img.height

      imgCanvas.width = w
      imgCanvas.height = h
      maskCanvas.width = w
      maskCanvas.height = h

      imgCtx.drawImage(img, 0, 0, w, h)

      maskCtx.fillStyle = '#0b0b0b'
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

    if (percent >= 100) {
      setDone(true)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const draw = (e: any) => {
    if (!isDrawing.current || done) return
    e.preventDefault()

    const ctx = maskCanvasRef.current!.getContext('2d')!
    const { x, y } = getPos(e)

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 35, 0, Math.PI * 2)
    ctx.fill()

    calculateProgress()
  }

  return (
    <main style={{ minHeight: '100vh', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
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

        {/* PERSENTASE */}
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
      </div>
    </main>
  )
}
