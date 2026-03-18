import { useRef } from 'react'
import { ClipboardList, User, Mail, Share2, FolderGit2 } from 'lucide-react'

// Componente para texto con efecto brillante (usado en el rol del welcome)

function ShinyText({ children, className = '' }) {
  return <span className={`shiny-text ${className}`}>{children}</span>
}
// Módulos del welcome

function TiltBubble({ mod, onClick }) {
  const ref = useRef(null)
  const { Icon } = mod

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    ref.current.style.transform =
      `perspective(600px) rotateX(${-y * 18}deg) rotateY(${x * 18}deg) scale(1.08)`
  }
  const onLeave = () => { ref.current.style.transform = '' }

  return (
    <button
      ref={ref}
      className="bubble"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        '--bubble-color': mod.color,
        '--bubble-glow':  mod.glow,
        animationDelay:   mod.delay,
      }}
    >
      <span className="bubble__ring" />
      <span className="bubble__icon-wrapper">
        <Icon size={32} strokeWidth={1.5} />
      </span>
      <span className="bubble__title">{mod.title}</span>
      <span className="bubble__subtitle">{mod.subtitle}</span>
    </button>
  )
}

// Módulos del welcome

const MODULES = [
  { id: 'forum',    Icon: ClipboardList, title: 'Tablón',    subtitle: 'Deja tu mensaje', color: '#e8650a', glow: 'rgba(232,101,10,0.55)', delay: '0s'   },
  { id: 'projects', Icon: FolderGit2,    title: 'Proyectos', subtitle: 'Mis repositorios', color: '#9a4dff', glow: 'rgba(154,77,255,0.5)',  delay: '0.4s' },
  { id: 'profile',  Icon: User,          title: 'Perfil',    subtitle: 'Sobre mí & CV',   color: '#d4541a', glow: 'rgba(212,84,26,0.5)',   delay: '0.8s' },
  { id: 'contact',  Icon: Mail,          title: 'Contacto',  subtitle: 'Escríbeme',        color: '#c4830a', glow: 'rgba(196,131,10,0.5)',  delay: '1.2s' },
  { id: 'social',   Icon: Share2,        title: 'Redes',     subtitle: 'Sígueme',          color: '#0a85d1', glow: 'rgba(10,133,209,0.5)',  delay: '1.6s' },
]


// ── MÓDULO DE BIENVENIDA ────────────────────────────────────────────────
// Página de bienvenida con foto, rol y navegación a los módulos

function Welcome({ navigate }) {
  return (
    <section className="welcome">
      <div className="welcome__hero">
        <div className="welcome__photo-ring">
          <div className="welcome__photo">
            <img src="/img_cara.jpeg" alt="Carlos Mendoza" className="welcome__photo-img" />
          </div>
          <div className="welcome__photo-glow" />
        </div>

        <div className="welcome__tag">Portfolio</div>

        <h1 className="welcome__name">Carlos Mendoza</h1>

        <p className="welcome__role">
          <ShinyText>Desarrollador Full Stack</ShinyText>
        </p>

        <p className="welcome__tagline">
          Elige un módulo y conóceme un poco más
        </p>

        <div className="welcome__sep">
          <span />
          <span className="welcome__sep-dot" />
          <span />
        </div>
      </div>

      <div className="welcome__bubbles">
        {MODULES.map(mod => (
          <TiltBubble key={mod.id} mod={mod} onClick={() => navigate(mod.id)} />
        ))}
      </div>
    </section>
  )
}

export default Welcome