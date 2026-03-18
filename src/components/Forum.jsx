import { useState, useEffect } from 'react'
import {
  Send, User, MessageSquarePlus, ChevronDown, ChevronUp,
  MessageSquare, CornerDownRight, Pencil, X
} from 'lucide-react'

const COLORS = [
  '#e8650a','#d4541a','#c4830a','#b05020',
  '#9a7a40','#8a6030','#c06040','#a05030',
]
function randomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)] }
function avatar(name) { return name.trim().charAt(0).toUpperCase() }

function countAllComments(comments) {
  return comments.reduce((acc, c) => acc + 1 + countAllComments(c.replies || []), 0)
}

function insertReply(comments, parentId, newReply) {
  return comments.map(c => {
    if (c.id === parentId) return { ...c, replies: [...(c.replies || []), newReply] }
    if (c.replies && c.replies.length) return { ...c, replies: insertReply(c.replies, parentId, newReply) }
    return c
  })
}

function CommentItem({ comment, depth = 0, postId, onReplyAdded }) {
  const [showReply, setShowReply] = useState(false)
  const [replyAuthor, setReplyAuthor] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const maxDepth = 4

  const handleReply = async (e) => {
    e.preventDefault()
    setError('')
    if (!replyAuthor.trim() || !replyContent.trim()) { setError('Rellena nombre y respuesta.'); return }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/forum/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: replyAuthor, content: replyContent, parentId: comment.id }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al responder.'); return }
      onReplyAdded(postId, data, comment.id)
      setReplyAuthor(''); setReplyContent(''); setShowReply(false)
    } catch { setError('No se pudo conectar.') }
    finally { setSubmitting(false) }
  }

  return (
    <div className={`comment depth-${Math.min(depth, maxDepth)}`}>
      <div className="comment__thread-line" onClick={() => setCollapsed(c => !c)} />
      <div className="comment__body">
        <div className="comment__header">
          <span className="comment__avatar" style={{ background: comment.color || randomColor() }}>
            {avatar(comment.author)}
          </span>
          <span className="comment__author">{comment.author}</span>
          <span className="comment__date">{comment.date}</span>
          <button className="comment__collapse" onClick={() => setCollapsed(c => !c)}>
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>

        {!collapsed && (
          <>
            <p className="comment__content">{comment.content}</p>
            <div className="comment__actions">
              <button className="comment__action-btn" onClick={() => setShowReply(r => !r)}>
                <CornerDownRight size={12} /> Responder
              </button>
            </div>

            {showReply && (
              <form className="comment__reply-form" onSubmit={handleReply}>
                <div className="form-group">
                  <input type="text" placeholder="Tu nombre" value={replyAuthor}
                    onChange={e => setReplyAuthor(e.target.value)} maxLength={50} disabled={submitting} />
                </div>
                <div className="form-group">
                  <textarea placeholder="Escribe tu respuesta..." value={replyContent}
                    onChange={e => setReplyContent(e.target.value)} maxLength={600} rows={3} disabled={submitting} />
                </div>
                {error && <p className="form-error">{error}</p>}
                <div className="comment__reply-actions">
                  <button type="submit" className="btn btn--primary" disabled={submitting}>
                    <Send size={13} />{submitting ? 'Enviando...' : 'Responder'}
                  </button>
                  <button type="button" className="btn btn--outline" onClick={() => { setShowReply(false); setError('') }}>
                    <X size={13} />Cancelar
                  </button>
                </div>
              </form>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="comment__replies">
                {comment.replies.map(reply => (
                  <CommentItem key={reply.id} comment={reply} depth={depth + 1} postId={postId} onReplyAdded={onReplyAdded} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function PostCard({ post, onCommentAdded, onReplyAdded }) {
  const [expanded, setExpanded] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const commentCount = countAllComments(post.comments || [])

  const handleComment = async (e) => {
    e.preventDefault()
    setError('')
    if (!author.trim() || !content.trim()) { setError('Rellena nombre y comentario.'); return }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/forum/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content, parentId: null }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al comentar.'); return }
      onCommentAdded(post.id, data)
      setAuthor(''); setContent(''); setShowCommentForm(false); setExpanded(true)
    } catch { setError('No se pudo conectar.') }
    finally { setSubmitting(false) }
  }

  return (
    <article className="post-card" style={{ '--post-color': post.color }}>
      <div className="post-card__header">
        <span className="post-card__avatar" style={{ background: post.color || randomColor() }}>
          {avatar(post.author)}
        </span>
        <div className="post-card__meta">
          <span className="post-card__author">{post.author}</span>
          <span className="post-card__date">{post.date}</span>
        </div>
      </div>

      <h3 className="post-card__title">{post.title}</h3>
      <p className="post-card__content">{post.content}</p>

      <div className="post-card__actions">
        <button className="post-card__action" onClick={() => { setExpanded(e => !e); setShowCommentForm(false) }}>
          <MessageSquare size={14} />
          {commentCount} {commentCount === 1 ? 'comentario' : 'comentarios'}
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        <button className="post-card__action post-card__action--comment"
          onClick={() => { setShowCommentForm(f => !f); setExpanded(true) }}>
          <MessageSquarePlus size={14} /> Comentar
        </button>
      </div>

      {showCommentForm && (
        <form className="post-card__comment-form" onSubmit={handleComment}>
          <div className="form-group">
            <label htmlFor={`name-${post.id}`}><User size={11} /> Tu nombre</label>
            <input id={`name-${post.id}`} type="text" placeholder="¿Cómo te llamas?"
              value={author} onChange={e => setAuthor(e.target.value)} maxLength={50} disabled={submitting} />
          </div>
          <div className="form-group">
            <label htmlFor={`msg-${post.id}`}><MessageSquarePlus size={11} /> Comentario</label>
            <textarea id={`msg-${post.id}`} placeholder="Escribe tu comentario..."
              value={content} onChange={e => setContent(e.target.value)} maxLength={600} rows={3} disabled={submitting} />
            <span className="char-count">{content.length}/600</span>
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="post-card__form-actions">
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              <Send size={13} />{submitting ? 'Publicando...' : 'Publicar'}
            </button>
            <button type="button" className="btn btn--outline" onClick={() => { setShowCommentForm(false); setError('') }}>
              <X size={13} />Cancelar
            </button>
          </div>
        </form>
      )}

      {expanded && (post.comments || []).length > 0 && (
        <div className="post-card__comments">
          {post.comments.map(c => (
            <CommentItem key={c.id} comment={c} depth={0} postId={post.id} onReplyAdded={onReplyAdded} />
          ))}
        </div>
      )}
    </article>
  )
}

function Forum() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)
  const [npAuthor, setNpAuthor]   = useState('')
  const [npTitle, setNpTitle]     = useState('')
  const [npContent, setNpContent] = useState('')
  const [npSubmitting, setNpSubmitting] = useState(false)
  const [npError, setNpError]     = useState('')
  const [npSuccess, setNpSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/forum')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => { setError('No se pudieron cargar los posts.'); setLoading(false) })
  }, [])

  const handleNewPost = async (e) => {
    e.preventDefault()
    setNpError('')
    if (!npAuthor.trim() || !npTitle.trim() || !npContent.trim()) { setNpError('Rellena todos los campos.'); return }
    setNpSubmitting(true)
    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: npAuthor, title: npTitle, content: npContent }),
      })
      const data = await res.json()
      if (!res.ok) { setNpError(data.error || 'Error al publicar.'); return }
      setPosts(prev => [data, ...prev])
      setNpAuthor(''); setNpTitle(''); setNpContent('')
      setShowNewPost(false); setNpSuccess(true)
      setTimeout(() => setNpSuccess(false), 3000)
    } catch { setNpError('No se pudo conectar.') }
    finally { setNpSubmitting(false) }
  }

  const handleCommentAdded = (postId, newComment) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p
    ))
  }

  const handleReplyAdded = (postId, newReply, parentId) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return { ...p, comments: insertReply(p.comments || [], parentId, newReply) }
    }))
  }

  return (
    <section className="forum">
      <div className="section-header">
        <h2 className="section-title">Tablón de <span className="highlight">Debate</span></h2>
        <p className="section-subtitle">
          Crea un post, deja un comentario o únete a la conversación.
        </p>
      </div>

      <div className="forum__container">
        <div className="forum__topbar">
          {npSuccess && <p className="form-success">Post publicado correctamente</p>}
          <button
            className={`btn ${showNewPost ? 'btn--outline' : 'btn--primary'} forum__new-btn`}
            onClick={() => { setShowNewPost(n => !n); setNpError('') }}
          >
            {showNewPost ? <><X size={15} /> Cancelar</> : <><Pencil size={15} /> Nuevo post</>}
          </button>
        </div>

        {showNewPost && (
          <form className="forum__new-post-form" onSubmit={handleNewPost}>
            <div className="form-group">
              <label htmlFor="np-author"><User size={11} /> Tu nombre</label>
              <input id="np-author" type="text" placeholder="¿Cómo te llamas?" value={npAuthor}
                onChange={e => setNpAuthor(e.target.value)} maxLength={50} disabled={npSubmitting} />
            </div>
            <div className="form-group">
              <label htmlFor="np-title"><Pencil size={11} /> Título</label>
              <input id="np-title" type="text" placeholder="¿De qué quieres hablar?" value={npTitle}
                onChange={e => setNpTitle(e.target.value)} maxLength={120} disabled={npSubmitting} />
            </div>
            <div className="form-group">
              <label htmlFor="np-content"><MessageSquarePlus size={11} /> Contenido</label>
              <textarea id="np-content" placeholder="Escribe tu mensaje aquí..." value={npContent}
                onChange={e => setNpContent(e.target.value)} maxLength={3000} rows={5} disabled={npSubmitting} />
              <span className="char-count">{npContent.length}/3000</span>
            </div>
            {npError && <p className="form-error">{npError}</p>}
            <button type="submit" className="btn btn--primary" disabled={npSubmitting}>
              <Send size={15} />{npSubmitting ? 'Publicando...' : 'Publicar post'}
            </button>
          </form>
        )}

        <div className="forum__feed">
          {loading && <div className="forum__loading"><div className="spinner" /><p>Cargando posts...</p></div>}
          {!loading && error && <p className="form-error">{error}</p>}
          {!loading && !error && posts.length === 0 && <p className="forum__empty">Sé el primero en publicar algo.</p>}
          {posts.map(post => (
            <PostCard key={post.id} post={post} onCommentAdded={handleCommentAdded} onReplyAdded={handleReplyAdded} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Forum