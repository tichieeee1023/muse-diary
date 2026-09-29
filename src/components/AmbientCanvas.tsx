import { useEffect, useRef } from 'react'

export type AmbientEffect = 'rain' | 'snow' | 'dust' | 'sparkle' | 'petals' | 'leaves' | 'mist' | 'bokeh'

interface AmbientCanvasProps {
  effect: AmbientEffect
  density?: 'low' | 'medium'
  className?: string
}

type Particle = {
  x: number
  y: number
  size: number
  speed: number
  drift: number
  alpha: number
  angle: number
  spin: number
}

const countByDensity = { low: 22, medium: 38 }

function effectCount(effect: AmbientEffect, base: number) {
  if (effect === 'mist') return Math.max(6, Math.round(base * .28))
  if (effect === 'bokeh') return Math.max(10, Math.round(base * .5))
  if (effect === 'rain') return Math.round(base * 1.15)
  return base
}

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
    let lastPaint = 0
    let active = !document.hidden
    const particles: Particle[] = []
    const parent = canvas.parentElement
    if (!parent) return

    const mobileScale = window.matchMedia('(max-width: 520px)').matches ? .76 : 1
    const particleCount = Math.max(5, Math.round(effectCount(effect, countByDensity[density]) * mobileScale))

    const makeParticle = (startAtTop = false): Particle => {
      const wide = effect === 'mist' || effect === 'bokeh'
      const size = effect === 'rain'
        ? 9 + Math.random() * 13
        : effect === 'snow'
          ? 1.4 + Math.random() * 3
          : effect === 'petals'
            ? 3 + Math.random() * 4
            : effect === 'leaves'
              ? 3.5 + Math.random() * 5
              : effect === 'mist'
                ? 36 + Math.random() * 90
                : effect === 'bokeh'
                  ? 8 + Math.random() * 22
                  : 1 + Math.random() * 2.5

      return {
        x: Math.random() * width,
        y: startAtTop ? -Math.max(14, size) : Math.random() * height,
        size,
        speed: effect === 'rain'
          ? 9 + Math.random() * 8
          : effect === 'snow'
            ? .45 + Math.random() * .75
            : effect === 'petals'
              ? .38 + Math.random() * .52
              : effect === 'leaves'
                ? .3 + Math.random() * .48
                : effect === 'mist'
                  ? .04 + Math.random() * .08
                  : effect === 'bokeh'
                    ? .035 + Math.random() * .07
                    : .14 + Math.random() * .38,
        drift: effect === 'rain'
          ? -2.6
          : effect === 'mist'
            ? .08 + Math.random() * .14
            : effect === 'bokeh'
              ? -.08 + Math.random() * .16
              : -.38 + Math.random() * .76,
        alpha: wide ? .035 + Math.random() * .12 : .12 + Math.random() * .34,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - .5) * (effect === 'petals' || effect === 'leaves' ? .035 : .012),
      }
    }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth <= 520 ? 1.15 : 1.4)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      particles.splice(0, particles.length, ...Array.from({ length: particleCount }, () => makeParticle()))
    }

    const resetParticle = (index: number) => {
      particles[index] = makeParticle(true)
      if (effect === 'mist' || effect === 'bokeh') particles[index].y = Math.random() * height
    }

    const drawPetal = (particle: Particle, leaf = false) => {
      context.save()
      context.translate(particle.x, particle.y)
      context.rotate(particle.angle)
      context.scale(1, .62)
      context.fillStyle = leaf ? '#d39059' : '#ffd7df'
      context.beginPath()
      context.ellipse(0, 0, particle.size, particle.size * .62, 0, 0, Math.PI * 2)
      context.fill()
      context.restore()
    }

    const draw = (timestamp: number) => {
      if (!active) return
      // 30fps is plenty for ambient motion and keeps mobile GPU use modest.
      if (timestamp - lastPaint < 32) {
        frame = window.requestAnimationFrame(draw)
        return
      }
      lastPaint = timestamp
      context.clearRect(0, 0, width, height)

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index]
        particle.y += particle.speed
        particle.x += particle.drift + (effect === 'petals' || effect === 'leaves' ? Math.sin(particle.y * .018) * .22 : 0)
        particle.angle += particle.spin

        if (effect === 'mist' || effect === 'bokeh') {
          if (particle.x > width + particle.size) particle.x = -particle.size
          if (particle.x < -particle.size) particle.x = width + particle.size
          if (particle.y > height + particle.size) particle.y = -particle.size
        } else if (particle.y > height + 18 || particle.x < -22 || particle.x > width + 22) {
          resetParticle(index)
        }

        const current = particles[index]
        context.globalAlpha = current.alpha

        if (effect === 'rain') {
          context.strokeStyle = '#e1edf1'
          context.lineWidth = .7
          context.beginPath()
          context.moveTo(current.x, current.y)
          context.lineTo(current.x + current.drift, current.y + current.size)
          context.stroke()
        } else if (effect === 'petals') {
          drawPetal(current)
        } else if (effect === 'leaves') {
          drawPetal(current, true)
        } else if (effect === 'mist') {
          const gradient = context.createRadialGradient(current.x, current.y, 0, current.x, current.y, current.size)
          gradient.addColorStop(0, 'rgba(245,246,242,.72)')
          gradient.addColorStop(1, 'rgba(245,246,242,0)')
          context.fillStyle = gradient
          context.beginPath()
          context.ellipse(current.x, current.y, current.size, current.size * .42, current.angle, 0, Math.PI * 2)
          context.fill()
        } else if (effect === 'bokeh') {
          context.fillStyle = '#ffe2b7'
          context.beginPath()
          context.arc(current.x, current.y, current.size, 0, Math.PI * 2)
          context.fill()
        } else if (effect === 'sparkle') {
          context.strokeStyle = '#ffe7ba'
          context.lineWidth = .8
          context.beginPath()
          context.moveTo(current.x - current.size * 1.8, current.y)
          context.lineTo(current.x + current.size * 1.8, current.y)
          context.moveTo(current.x, current.y - current.size * 1.8)
          context.lineTo(current.x, current.y + current.size * 1.8)
          context.stroke()
        } else {
          context.fillStyle = effect === 'snow' ? '#ffffff' : '#fff7e8'
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
