import { useRef } from 'react'
import { Github, Linkedin, Send, Instagram } from 'lucide-react'

/* ─── TiltBubble (mismo sistema que Welcome) ────────────────────────── */
function TiltBubble({ mod }) {
  const ref = useRef(null)
  const { Icon, url } = mod

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    ref.current.style.transform =
      `perspective(600px) rotateX(${-y * 18}deg) rotateY(${x * 18}deg) scale(1.08)`
  }
  const onLeave = () => { ref.current.style.transform = '' }

  return (
    <a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bubble social-bubble"
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
        <Icon size={34} strokeWidth={1.5} />
      </span>
      <span className="bubble__title">{mod.title}</span>
      <span className="bubble__subtitle">{mod.handle}</span>
    </a>
  )
}

// ── DATOS DE REDES SOCIALES ─────────────────────────────────────────
const SOCIALS = [
  {
    id: 'github',
    Icon: Github,
    title: 'GitHub',
    handle: '@CarlosMenBer',
    url: 'https://github.com/CarlosMenBer',
    color: '#e8e8e8',
    glow: 'rgba(232,232,232,0.4)',
    delay: '0s',
  },
  {
    id: 'linkedin',
    Icon: Linkedin,
    title: 'LinkedIn',
    handle: 'Carlos Mendoza Bernal',
    url: 'https://www.linkedin.com/in/carlos-mendoza-bernal-82817428b',
    color: '#0a85d1',
    glow: 'rgba(10,133,209,0.5)',
    delay: '0.3s',
  },
  // {
  //   id: 'telegram',
  //   Icon: Send,
  //   title: 'Telegram',
  //   handle: '@tu-usuario',
  //   url: '',
  //   color: '#2AABEE',
  //   glow: 'rgba(42,171,238,0.5)',
  //   delay: '0.6s',
  // },
  {
    id: 'instagram',
    Icon: Instagram,
    title: 'Instagram',
    handle: '@tu-usuario',
    url: 'https://instagram.com/carlos._mdz',
    color: '#e8650a',
    glow: 'rgba(232,101,10,0.55)',
    delay: '0.9s',
  },
]

// ── MÓDULO DE REDES SOCIALES ─────────────────────────────────────────

function SocialLinks() {
  return (
    <section className="social">
      <div className="section-header">
        <h2 className="section-title">Mis <span className="highlight">Redes</span></h2>
        <p className="section-subtitle">
          Encuéntrame por aquí y hablemos.
        </p>
      </div>

      <div className="social__bubbles">
        {SOCIALS.map(mod => (
          <TiltBubble key={mod.id} mod={mod} />
        ))}
      </div>
    </section>
  )
}

export default SocialLinks