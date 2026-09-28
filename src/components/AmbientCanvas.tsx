import { useEffect, useRef } from 'react'

export type AmbientEffect = 'rain' | 'snow' | 'dust' | 'sparkle'

interface AmbientCanvasProps {
  effect: AmbientEffect
  density?: 'low' | 'medium'
  className?: string
}

type Particle = { x: number; y: number; size: number; speed: number; drift: number; alpha: number }

const countByDensity = { low: 28, medium: 46 }

export function AmbientCanvas({ effect, density = 'low', className = '' }: AmbientCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = canvas.getContext('2d')
    if (!context) return

    let width = 0
    let height = 0
    let frame = 0
    let active = !document.hidden
    const particles: Particle[] = []
    const parent = canvas.parentElement
    if (!parent) return

    const makeParticle = (startAtTop = false): Particle => ({
      x: Math.random() * width,
      y: startAtTop ? -12 : Math.random() * height,
      size: effect === 'rain' ? 8 + Math.random() * 11 : 1 + Math.random() * 2.4,
      speed: effect === 'rain' ? 8 + Math.random() * 7 : effect === 'snow' ? .45 + Math.random() * .8 : .18 + Math.random() * .5,
      drift: effect === 'rain' ? -2.5 : -0.35 + Math.random() * .7,
      alpha: .12 + Math.random() * .35,
    })

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      particles.splice(0, particles.length, ...Array.from({ length: countByDensity[density] }, () => makeParticle()))
    }

    const draw = () => {
      if (!active) return
      context.clearRect(0, 0, width, height)
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index]
        particle.y += particle.speed
        particle.x += particle.drift
        if (particle.y > height + 16 || particle.x < -16 || particle.x > width + 16) particles[index] = makeParticle(true)
        const current = particles[index]
        context.globalAlpha = current.alpha
        if (effect === 'rain') {
          context.strokeStyle = '#dce8ed'
          context.lineWidth = .75
          context.beginPath()
          context.moveTo(current.x, current.y)
          context.lineTo(current.x + current.drift, current.y + current.size)
          context.stroke()
        } else {
          context.fillStyle = effect === 'sparkle' ? '#ffe2ad' : '#fff9ec'
          context.beginPath()
          context.arc(current.x, current.y, current.size, 0, Math.PI * 2)
          context.fill()
        }
      }
      context.globalAlpha = 1
      frame = window.requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      active = !document.hidden
      if (active) frame = window.requestAnimationFrame(draw)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(parent)
    document.addEventListener('visibilitychange', onVisibility)
    resize()
    frame = window.requestAnimationFrame(draw)
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [density, effect])

  return <canvas ref={canvasRef} className={`ambient-canvas ambient-${effect}${className ? ` ${className}` : ''}`} aria-hidden="true" />
}
