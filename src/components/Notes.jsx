import { useState, useEffect } from 'react'

function NoteCard({ note }) {
  return (
    <div
      className="note-card"
      style={{
        backgroundColor: note.color,
        transform: `rotate(${note.rotation}deg)`
      }}
    >
      <div className="note-card__pin" />
      <p className="note-card__message">&ldquo;{note.message}&rdquo;</p>
      <div className="note-card__footer">
        <span className="note-card__author">— {note.author}</span>
        <span className="note-card__date">{note.date}</span>
      </div>
    </div>
  )
}

function Notes() {
  const [notes, setNotes] = useState([])
  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data)
        setLoading(false)
      })
      .catch(() => {
        setError('No se pudieron cargar las notas.')
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!author.trim() || !message.trim()) {
      setError('Por favor completa todos los campos.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, message })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al enviar la nota.')
      } else {
        setNotes(prev => [data, ...prev])
        setAuthor('')
        setMessage('')
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="notas" className="notes">
      <div className="section-header">
        <h2 className="section-title">Tablón de <span className="highlight">Notas</span></h2>
        <p className="section-subtitle">
          Deja un mensaje, una opinión o simplemente saluda. Tu nota se guardará aquí para siempre.
        </p>
      </div>

      <div className="notes__form-wrapper">
        <form className="notes__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="note-author">Tu nombre</label>
            <input
              id="note-author"
              type="text"
              placeholder="¿Cómo te llamas?"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              maxLength={50}
              disabled={submitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="note-message">Tu mensaje</label>
            <textarea
              id="note-message"
              placeholder="Escribe tu nota aquí..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={300}
              rows={4}
              disabled={submitting}
            />
            <span className="char-count">{message.length}/300</span>
          </div>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">¡Nota publicada con éxito!</p>}

          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Publicando...' : 'Publicar nota'}
          </button>
        </form>
      </div>

      <div className="notes__grid">
        {loading && (
          <div className="notes__loading">
            <div className="spinner" />
            <p>Cargando notas...</p>
          </div>
        )}
        {!loading && notes.length === 0 && (
          <p className="notes__empty">Sé el primero en dejar una nota!</p>
        )}
        {notes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </section>
  )
}

export default Notes
