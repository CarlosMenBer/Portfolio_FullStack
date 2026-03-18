import { useEffect, useRef, useState, useCallback } from 'react'


// componentes extraidos de paginas externas con diferantes efectos visuales, para no sobrecargar el codigo de las paginas principales y mantenerlos organizados en un modulo aparte
/* ═══════════════════════════════════════════════════════════════
   StarsBackground — canvas con estrellas parpadeantes
   Aceternity UI: shooting-stars-and-stars-background
   ═══════════════════════════════════════════════════════════════ */
function StarsBackground({
  starDensity        = 0.00015,
  allStarsTwinkle    = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed    = 0.5,
  maxTwinkleSpeed    = 1,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const generateStars = () => {
      const count = Math.floor(canvas.width * canvas.height * starDensity)
      return Array.from({ length: count }, () => {
        const twinkle = allStarsTwinkle || Math.random() < twinkleProbability
        return {
          x:        Math.random() * canvas.width,
          y:        Math.random() * canvas.height,
          radius:   Math.random() * 0.05 + 0.5,
          opacity:  Math.random() * 0.5 + 0.5,
          twinkle,
          twinkleSpeed: twinkle
            ? minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
          twinkleDirection: Math.random() < 0.5 ? 1 : -1,
        }
      })
    }

    let stars = generateStars()
    window.addEventListener('resize', () => { stars = generateStars() })

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        if (s.twinkle) {
          s.opacity += s.twinkleDirection * s.twinkleSpeed * 0.01
          if (s.opacity > 1) { s.opacity = 1; s.twinkleDirection = -1 }
          if (s.opacity < 0.2) { s.opacity = 0.2; s.twinkleDirection = 1 }
        }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════════════════
   ShootingStars — estrellas fugaces con gradiente SVG
   ═══════════════════════════════════════════════════════════════ */
const SHOOTING_DEFAULTS = {
  minSpeed:   10,
  maxSpeed:   30,
  minDelay:   1200,
  maxDelay:   4500,
  starColor:  '#9E00FF',
  trailColor: '#2EB9DF',
  starWidth:  12,
  starHeight: 1,
}

function ShootingStars(props) {
  const cfg = { ...SHOOTING_DEFAULTS, ...props }
  const svgRef = useRef(null)
  const starRef = useRef(null)
  const timeoutRef = useRef(null)
  const frameRef  = useRef(null)

  const getRandomStart = useCallback(() => {
    const svg   = svgRef.current
    if (!svg) return { startX: 0, startY: 0, angle: 45 }
    const w = svg.clientWidth, h = svg.clientHeight
    // pick a random edge: top or left, angle 35-55°
    const edge  = Math.random() < 0.5 ? 'top' : 'left'
    if (edge === 'top') {
      return { startX: Math.random() * w, startY: 0, angle: 35 + Math.random() * 20 }
    } else {
      return { startX: 0, startY: Math.random() * h, angle: 35 + Math.random() * 20 }
    }
  }, [])

  const animate = useCallback((star, startX, startY, angle) => {
    if (!svgRef.current) return
    const svg = svgRef.current
    const w = svg.clientWidth, h = svg.clientHeight
    const rad = (angle * Math.PI) / 180
    const speed = cfg.minSpeed + Math.random() * (cfg.maxSpeed - cfg.minSpeed)

    let x = startX, y = startY

    const step = () => {
      x += Math.cos(rad) * speed * 0.5
      y += Math.sin(rad) * speed * 0.5

      if (x > w + 100 || y > h + 100) {
        star.style.display = 'none'
        scheduleNext()
        return
      }

      star.setAttribute('x1', x)
      star.setAttribute('y1', y)
      star.setAttribute('x2', x - cfg.starWidth)
      star.setAttribute('y2', y - cfg.starHeight)
      star.style.display = 'block'
      frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
  }, [cfg])

  const scheduleNext = useCallback(() => {
    const delay = cfg.minDelay + Math.random() * (cfg.maxDelay - cfg.minDelay)
    timeoutRef.current = setTimeout(() => {
      if (!starRef.current) return
      const { startX, startY, angle } = getRandomStart()
      animate(starRef.current, startX, startY, angle)
    }, delay)
  }, [cfg, getRandomStart, animate])

  useEffect(() => {
    scheduleNext()
    return () => {
      clearTimeout(timeoutRef.current)
      cancelAnimationFrame(frameRef.current)
    }
  }, [scheduleNext])

  const gradId = 'shootGrad'

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={cfg.trailColor} stopOpacity="0" />
          <stop offset="100%" stopColor={cfg.starColor}  stopOpacity="1" />
        </linearGradient>
      </defs>
      <line
        ref={starRef}
        style={{ display: 'none' }}
        stroke={`url(#${gradId})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FireBackground — wrapper que combina ambos
   ═══════════════════════════════════════════════════════════════ */
function FireBackground() {
  return (
    <div className="fire-bg" aria-hidden="true">
      <StarsBackground />
      {/* Varias estrellas fugaces simultáneas con colores distintos */}
      <ShootingStars
        minSpeed={8} maxSpeed={20}
        minDelay={1000} maxDelay={3500}
        starColor="#FFFFFF" trailColor="#FF4500"
        starWidth={14} starHeight={1}
      />
      <ShootingStars
        minSpeed={6} maxSpeed={15}
        minDelay={2000} maxDelay={5000}
        starColor="#FFE0D0" trailColor="#CC2200"
        starWidth={10} starHeight={1}
      />
      <ShootingStars
        minSpeed={10} maxSpeed={25}
        minDelay={3000} maxDelay={7000}
        starColor="#FFFFFF" trailColor="#FF6633"
        starWidth={8} starHeight={1}
      />
    </div>
  )
}

export default FireBackground