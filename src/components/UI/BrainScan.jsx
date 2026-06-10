import { useEffect, useRef } from 'react'

const PHRASES = [
  'Scanning neural pathways...',
  'Reading emotional frequencies...',
  'Mapping cinematic memories...',
  'Syncing with your subconscious...',
  'Analyzing dopamine responses...',
  'Decoding thought patterns...',
  'Calibrating mood receptors...',
  'Accessing dream sequences...',
  'Quantum mood entanglement...',
  'Processing emotional DNA...',
  'Tuning into your frequency...',
  'Downloading prescription...',
  'Connecting neural nodes...',
  'Interpreting brain waves...',
  'Calculating therapeutic dosage...',
]

export default function BrainScan({ isActive }) {
  const canvasRef = useRef(null)
  const phraseRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!isActive) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = 280
    const h = 280
    canvas.width = w
    canvas.height = h

    let rot = 0
    let pulse = 0
    let running = true

    const brainX = w / 2
    const brainY = h / 2 + 10

    const phraseInterval = setInterval(() => {
      if (phraseRef.current) {
        phraseRef.current.textContent = PHRASES[Math.floor(Math.random() * PHRASES.length)]
      }
    }, 1800)

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, w, h)
      rot += 0.015
      pulse = Math.sin(rot * 2) * 0.3 + 0.7

      // Outer ring
      ctx.beginPath()
      ctx.arc(brainX, brainY, 90, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(229, 9, 20, ${0.15 + pulse * 0.15})`
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Middle ring
      ctx.beginPath()
      ctx.arc(brainX, brainY, 70, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(229, 9, 20, ${0.1 + pulse * 0.1})`
      ctx.lineWidth = 1
      ctx.stroke()

      // Brain shape (simplified)
      ctx.beginPath()
      ctx.ellipse(brainX - 10, brainY - 5, 35, 40, 0, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + pulse * 0.2})`
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(brainX + 10, brainY - 5, 35, 40, 0, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + pulse * 0.2})`
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Center line (corpus callosum)
      ctx.beginPath()
      ctx.moveTo(brainX, brainY - 40)
      ctx.lineTo(brainX, brainY + 30)
      ctx.strokeStyle = `rgba(229, 9, 20, ${0.2 + pulse * 0.1})`
      ctx.lineWidth = 1
      ctx.stroke()

      // EEG waves
      for (let row = 0; row < 3; row++) {
        const y = brainY - 15 + row * 20
        ctx.beginPath()
        for (let x = -35; x <= 35; x += 2) {
          const freq = 0.08 + row * 0.03
          const amp = 3 + row * 0.5
          const yy = y + Math.sin(x * freq + rot * row + frameRef.current * 0.02) * amp
          const px = brainX + x * 0.9
          if (x === -35) ctx.moveTo(px, yy)
          else ctx.lineTo(px, yy)
        }
        ctx.strokeStyle = `rgba(229, 9, 20, ${0.3 + pulse * 0.2})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Scanning line
      const scanY = ((frameRef.current % 180) / 180) * 180 - 90 + brainY
      ctx.beginPath()
      ctx.moveTo(brainX - 80, scanY)
      ctx.lineTo(brainX + 80, scanY)
      ctx.strokeStyle = `rgba(229, 9, 20, ${0.4 + Math.sin(rot * 3) * 0.1})`
      ctx.lineWidth = 1
      ctx.setLineDash([5, 10])
      ctx.stroke()
      ctx.setLineDash([])

      // Particles
      for (let i = 0; i < 8; i++) {
        const angle = rot + i * (Math.PI * 2 / 8)
        const dist = 55 + Math.sin(rot * 3 + i) * 15
        const px = brainX + Math.cos(angle) * dist
        const py = brainY + Math.sin(angle) * dist
        const size = 1 + Math.sin(rot * 2 + i) * 0.5
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(229, 9, 20, ${0.3 + pulse * 0.3})`
        ctx.fill()
      }

      frameRef.current++
      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      running = false
      clearInterval(phraseInterval)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4">
      <canvas ref={canvasRef} width={280} height={280} className="w-[200px] h-[200px]" />
      <p ref={phraseRef} className="text-cinema-red text-xs font-mono animate-pulse">
        Scanning neural pathways...
      </p>
    </div>
  )
}
