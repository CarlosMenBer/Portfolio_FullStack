import { useEffect, useRef } from 'react'
import { Gamepad2, MessageSquareMore, Smartphone, Heart, HeartHandshake, Globe, Leaf } from 'lucide-react'

const BUBBLE_SIZE = 150
const SPEED = 1.2

const PROJECTS = [
  {
    id: 'unity-game',
    Icon: Gamepad2,
    title: 'Unity Game',
    description: 'DnD roguelike con Unity',
    url: 'https://github.com/CarlosMenBer/Unity-Game',
    color: '#9a4dff',
    glow: 'rgba(154,77,255,0.5)',
  },
  {
    id: 'live-chat',
    Icon: MessageSquareMore,
    title: 'Live Chat',
    description: 'Chat en tiempo real con Java',
    url: 'https://github.com/CarlosMenBer/Live-Chat',
    color: '#e8650a',
    glow: 'rgba(232,101,10,0.55)',
  },
  {
    id: 'android-app',
    Icon: Smartphone,
    title: 'App Android',
    description: 'Pokémon API + Firebase',
    url: 'https://github.com/CarlosMenBer/App-Android-',
    color: '#3ddc84',
    glow: 'rgba(61,220,132,0.5)',
  },
  {
    id: 'java-spring',
    Icon: Leaf,
    title: 'Java Spring',
    description: 'Ejercicio Java Spring',
    url: 'https://github.com/CarlosMenBer/Java-Spring',
    color: '#6db33f',
    glow: 'rgba(109,179,63,0.5)',
  },
  {
    id: 'react-portfolio',
    Icon: Globe,
    title: 'React Portfolio',
    description: 'Portfolio con API del tiempo',
    url: 'https://github.com/CarlosMenBer/React-Portfolio',
    color: '#61dafb',
    glow: 'rgba(97,218,251,0.5)',
  },
  {
    id: 'san-valentin',
    Icon: Heart,
    title: 'San Valentín',
    description: 'Juego HTML & CSS',
    url: 'https://github.com/CarlosMenBer/San-Valentin',
    color: '#ff4d6d',
    glow: 'rgba(255,77,109,0.5)',
  }
]

// Componente para cada burbuja de proyecto

function Projects() {
  const containerRef = useRef(null)
  const bubbleRefs  = useRef([])
  const stateRef    = useRef([])
  const frameRef    = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cw = container.clientWidth
    const ch = container.clientHeight

    stateRef.current = PROJECTS.map(() => {
      const angle = Math.random() * Math.PI * 2
      return {
        x:      Math.random() * (cw - BUBBLE_SIZE),
        y:      Math.random() * (ch - BUBBLE_SIZE),
        vx:     Math.cos(angle) * SPEED,
        vy:     Math.sin(angle) * SPEED,
        paused: false,
      }
    })

    const animate = () => {
      const w = container.clientWidth
      const h = container.clientHeight

      stateRef.current.forEach((s, i) => {
        if (s.paused) return

        s.x += s.vx
        s.y += s.vy

        if (s.x <= 0)                    { s.vx =  Math.abs(s.vx); s.x = 0 }
        else if (s.x >= w - BUBBLE_SIZE) { s.vx = -Math.abs(s.vx); s.x = w - BUBBLE_SIZE }

        if (s.y <= 0)                    { s.vy =  Math.abs(s.vy); s.y = 0 }
        else if (s.y >= h - BUBBLE_SIZE) { s.vy = -Math.abs(s.vy); s.y = h - BUBBLE_SIZE }

        const el = bubbleRefs.current[i]
        if (el) el.style.transform = `translate(${s.x}px, ${s.y}px)`
      })

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <section className="projects">
      <div className="projects__header section-header">
        <h2 className="section-title">Mis <span className="highlight">Proyectos</span></h2>
        <p className="section-subtitle">Haz clic en una burbuja para ver el repositorio.</p>
      </div>

      <div ref={containerRef} className="projects__arena">
        {PROJECTS.map((proj, i) => {
          const pause  = () => { stateRef.current[i].paused = true }
          const resume = (e) => {
            const inner = e.currentTarget.querySelector('.proj-bubble__inner')
            if (inner) inner.style.transform = ''
            stateRef.current[i].paused = false
          }
          const tilt = (e) => {
            const inner = e.currentTarget.querySelector('.proj-bubble__inner')
            if (!inner) return
            const rect = e.currentTarget.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width  - 0.5
            const y = (e.clientY - rect.top)  / rect.height - 0.5
            inner.style.transform =
              `perspective(600px) rotateX(${-y * 18}deg) rotateY(${x * 18}deg) scale(1.08)`
          }

          return (
            <div
              key={proj.id}
              ref={el => { bubbleRefs.current[i] = el }}
              className="proj-bubble"
              onMouseEnter={pause}
              onMouseMove={tilt}
              onMouseLeave={resume}
            >
              <a
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                className="proj-bubble__inner"
                style={{ '--bubble-color': proj.color, '--bubble-glow': proj.glow }}
              >
                <span className="bubble__ring" />
                <span className="bubble__icon-wrapper">
                  <proj.Icon size={28} strokeWidth={1.5} />
                </span>
                <span className="bubble__title">{proj.title}</span>
                <span className="bubble__subtitle">{proj.description}</span>
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Projects