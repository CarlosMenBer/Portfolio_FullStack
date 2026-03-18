import { useState } from 'react'
import { Mail, Linkedin, Github, Send, Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react'

const EMAIL = 'carlosmendozabernal14@gmail.com'


// Datos de habilidades (icono, nombre, colores)


function Contact() {
  const [name,    setName]    = useState('')
  const [subject, setSubject] = useState('')
  const [body,    setBody]    = useState('')
  const [status,  setStatus]  = useState(null) // null | 'success' | 'error'
  const [sending, setSending] = useState(false)

  const handleSend = (e) => {
    e.preventDefault()

    if (!name.trim() || !body.trim()) {
      setStatus('error')
      return
    }

    setSending(true)

    const mailtoLink =
      `mailto:${EMAIL}` +
      `?subject=${encodeURIComponent(subject || 'Contacto desde portfolio')}` +
      `&body=${encodeURIComponent(`Hola, soy ${name}.\n\n${body}`)}`

    // Intenta abrir el cliente de correo
    const opened = window.open(mailtoLink, '_blank')

    // Si el navegador bloqueó window.open, fallback con location
    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
      window.location.href = mailtoLink
    }

    setTimeout(() => {
      setSending(false)
      setStatus('success')
      setName('')
      setSubject('')
      setBody('')
    }, 800)
  }

  const resetStatus = () => setStatus(null)

  return (
    <section className="contact">
      <div className="section-header">
        <h2 className="section-title">Ponte en <span className="highlight">Contacto</span></h2>
        <p className="section-subtitle">
          ¿Tienes alguna idea o simplemente quieres hablar? Escríbeme.
        </p>
      </div>

      <div className="contact__container">
        {/* ── Info lateral ── */}
        <div className="contact__info">
          <div className="contact__info-card">
            <div className="contact__info-icon"><Mail size={18} strokeWidth={1.8} /></div>
            <div className="contact__info-text">
              <h3>Email</h3>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </div>
          </div>

          <div className="contact__info-card">
            <div className="contact__info-icon"><Linkedin size={18} strokeWidth={1.8} /></div>
            <div className="contact__info-text">
              <h3>LinkedIn</h3>
              <a href="www.linkedin.com/in/carlos-mendoza-bernal-82817428b" target="_blank" rel="noopener noreferrer">
                linkedin.com/in/carlos-mendoza-bernal
              </a>
            </div>
          </div>

          <div className="contact__info-card">
            <div className="contact__info-icon"><Github size={18} strokeWidth={1.8} /></div>
            <div className="contact__info-text">
              <h3>GitHub</h3>
              <a href="https://github.com/CarlosMenBer" target="_blank" rel="noopener noreferrer">
                github.com/CarlosMenBer
              </a>
            </div>
          </div>

          <div className="contact__response">
            <Clock size={14} strokeWidth={2} />
            Respondo en menos de 24 horas
          </div>
        </div>

        {/* ── Formulario ── */}
        <form className="contact__form" onSubmit={handleSend} onChange={resetStatus}>

          {/* Mensaje de éxito */}
          {status === 'success' && (
            <div className="contact__feedback contact__feedback--ok">
              <CheckCircle size={16} />
              ¡Mensaje listo! Se ha abierto tu cliente de correo.
            </div>
          )}

          {/* Mensaje de error */}
          {status === 'error' && (
            <div className="contact__feedback contact__feedback--err">
              <AlertCircle size={16} />
              Por favor rellena tu nombre y el mensaje.
            </div>
          )}

          <div className="form-group">
            <label htmlFor="contact-name"><User size={12} /> Tu nombre</label>
            <input
              id="contact-name"
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-subject"><FileText size={12} /> Asunto</label>
            <input
              id="contact-subject"
              type="text"
              placeholder="¿De qué quieres hablar?"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-body"><Mail size={12} /> Mensaje</label>
            <textarea
              id="contact-body"
              placeholder="Escribe tu mensaje aquí..."
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={5}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn--primary btn--full ${sending ? 'btn--sending' : ''}`}
            disabled={sending}
          >
            {sending
              ? <><span className="btn-spinner" /> Abriendo correo...</>
              : <><Send size={15} /> Enviar mensaje</>
            }
          </button>

          <p className="contact__mailto-note">
            <Mail size={11} />
            Se abrirá tu cliente de correo con el mensaje listo para enviar
          </p>
        </form>
      </div>
    </section>
  )
}

export default Contact