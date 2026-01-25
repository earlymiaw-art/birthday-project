'use client'
import { useEffect, useRef, useState } from 'react'

export default function ScratchPage() {
  const colorRef = useRef<HTMLCanvasElement>(null)
  const coverRef = useRef<HTMLCanvasElement>(null)
  const bwRef = useRef<HTMLCanvasElement>(null)

  const isDrawing = useRef(false)

  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!colorRef.current || !coverRef.current || !bwRef.current) return

    const color = colorRef.current
    const cover = coverRef.current
    const bw = bwRef.current

    const cCtx = color.getContext('2d')
    const coverCtx = cover.getContext('2d')
    const bwCtx = bw.getContext('2d')

    if (!cCtx || !coverCtx || !bwCtx) return

    const img = new window.Image()
    img.src = '/img/photo.jpg'

    img.onload = () => {
      const w = img.width
      const h = img.height

      ;[color, cover, bw].forEach(c => {
        c.width = w
        c.height = h
      })

      // 🔥 GAMBAR WARNA (DISIAPKAN, TAPI TERTUTUP COVER)
      cCtx.clearRect(0, 0, w, h)
      cCtx.drawImage(img, 0, 0, w, h)

      // 🔥 COVER / BATU
      coverCtx.globalCompositeOperation = 'source-over'
      coverCtx.fillStyle = '#0b0b0b'
      coverCtx.fillRect(0, 0, w, h)

      coverCtx.fillStyle = '#7b1e24'
      coverCtx.font = '24px serif'
      coverCtx.textAlign = 'center'
      coverCtx.textBaseline = 'middle'
      coverCtx.fillText('Gosok sampai habis', w / 2, h / 2)

      // BW KOSONG
      bwCtx.clearRect(0, 0, w, h)
    }
  }, [])

  const getPos = (e: any) => {
    const rect = coverRef.current!.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    return { x, y }
  }

  const calcProgress = () => {
    const canvas = coverRef.current!
    const ctx = canvas.getContext('2d')!
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data

    let cleared = 0
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) cleared++
    }

    const percent = Math.min(
      100,
      Math.round((cleared / (data.length / 4)) * 100)
    )

    setProgress(percent)

    if (percent >= 100) finish()
  }

  const finish = () => {
    if (!colorRef.current || !bwRef.current) return

    const bwCtx = bwRef.current.getContext('2d')!
    bwCtx.filter = 'grayscale(100%)'
    bwCtx.drawImage(colorRef.current, 0, 0)
    bwCtx.filter = 'none'

    setDone(true)
  }

  const draw = (e: any) => {
    if (!isDrawing.current || done) return
    e.preventDefault()

    const ctx = coverRef.current!.getContext('2d')!
    const { x, y } = getPos(e)

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 35, 0, Math.PI * 2)
    ctx.fill()

    calcProgress()
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
  {/* GAMBAR WARNA (DI BAWAH, KEKETUTUP COVER) */}
  <canvas
    ref={colorRef}
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 1,
    }}
  />

  {/* GAMBAR BW (TIMPA SETELAH DONE) */}
  {done && (
    <canvas
      ref={bwRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
      }}
    />
  )}

  {/* COVER / BATU (PALING ATAS SAAT GOSOK) */}
  {!done && (
    <canvas
      ref={coverRef}
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
        zIndex: 2,
        touchAction: 'none',
      }}
    />
  )}

  {/* CARD */}
  {done && (
    <div
      style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        background: '#fff',
        padding: 16,
        borderRadius: 12,
        zIndex: 4,
      }}
    >
      <b>Pesan dari aku</b>
      <p>Isi ucapan bebas</p>
    </div>
  )}

  {!done && (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#fff',
        zIndex: 5,
      }}
    >
      {progress}%
    </div>
  )}
</div>
    </main>
  )
}
