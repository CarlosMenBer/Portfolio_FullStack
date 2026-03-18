/**
 * server.js — Servidor Express para el portfolio
 */

const express = require('express')
const fs      = require('fs')
const path    = require('path')

const app  = express()
const PORT = 3001

const NOTES_FILE = path.join(__dirname, 'notes.json')
const FORUM_FILE = path.join(__dirname, 'forum.json')

const NOTE_COLORS = [
  '#e8650a', '#d4541a', '#c4830a', '#b05020',
  '#9a7a40', '#8a6030', '#c06040', '#a05030',
]

app.use(express.json())

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) { fs.writeFileSync(filePath, JSON.stringify([])); return [] }
  try { return JSON.parse(fs.readFileSync(filePath, 'utf-8')) } catch { return [] }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

function today() { return new Date().toLocaleDateString('es-ES') }
function randomColor() { return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)] }

// ── NOTES (legacy) ────────────────────────────────────────────────────

app.get('/api/notes', (req, res) => {
  try { res.json(readJSON(NOTES_FILE)) } catch { res.status(500).json({ error: 'Error al leer las notas' }) }
})

app.post('/api/notes', (req, res) => {
  const { author, message } = req.body
  if (!author || !message) return res.status(400).json({ error: 'El nombre y el mensaje son obligatorios' })
  if (author.trim().length < 2) return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' })
  if (message.trim().length < 3) return res.status(400).json({ error: 'El mensaje debe tener al menos 3 caracteres' })
  try {
    const notes = readJSON(NOTES_FILE)
    const newNote = {
      id: Date.now(), author: author.trim().substring(0, 50),
      message: message.trim().substring(0, 300), date: today(),
      color: randomColor(), rotation: Math.floor(Math.random() * 7) - 3,
    }
    notes.unshift(newNote)
    writeJSON(NOTES_FILE, notes)
    res.status(201).json(newNote)
  } catch { res.status(500).json({ error: 'Error al guardar la nota' }) }
})

// ══════════════════════════════════════════════════════════════════════
//  FORO — cualquiera puede crear posts y comentar/responder
// ══════════════════════════════════════════════════════════════════════

/** GET /api/forum — todos los posts */
app.get('/api/forum', (req, res) => {
  try { res.json(readJSON(FORUM_FILE)) } catch { res.status(500).json({ error: 'Error al leer el foro' }) }
})

/** POST /api/forum — cualquiera crea un post */
app.post('/api/forum', (req, res) => {
  const { author, title, content } = req.body
  if (!author || !title || !content)
    return res.status(400).json({ error: 'El nombre, título y contenido son obligatorios' })
  if (author.trim().length < 2)
    return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' })
  if (title.trim().length < 3)
    return res.status(400).json({ error: 'El título debe tener al menos 3 caracteres' })
  if (content.trim().length < 5)
    return res.status(400).json({ error: 'El contenido debe tener al menos 5 caracteres' })
  try {
    const posts = readJSON(FORUM_FILE)
    const post = {
      id: Date.now(),
      author: author.trim().substring(0, 50),
      title: title.trim().substring(0, 120),
      content: content.trim().substring(0, 3000),
      date: today(),
      color: randomColor(),
      comments: [],
    }
    posts.unshift(post)
    writeJSON(FORUM_FILE, posts)
    res.status(201).json(post)
  } catch { res.status(500).json({ error: 'Error al crear el post' }) }
})

/** DELETE /api/forum/:id — solo admin */
app.delete('/api/forum/:id', (req, res) => {
  const ADMIN_KEY = process.env.ADMIN_KEY || 'portfolio-admin'
  const { adminKey } = req.body
  if (adminKey !== ADMIN_KEY) return res.status(403).json({ error: 'Contraseña incorrecta' })
  try {
    const posts = readJSON(FORUM_FILE)
    writeJSON(FORUM_FILE, posts.filter(p => p.id !== parseInt(req.params.id)))
    res.json({ ok: true })
  } catch { res.status(500).json({ error: 'Error al eliminar el post' }) }
})

// ── helpers para comentarios anidados ────────────────────────────────

/**
 * Inserta un comentario en el árbol. Si parentId es null va al nivel raíz.
 * Si parentId tiene valor, se busca recursivamente el comentario padre.
 */
function insertComment(comments, parentId, newComment) {
  if (!parentId) return [...comments, newComment]
  return comments.map(c => {
    if (c.id === parentId) return { ...c, replies: [...(c.replies || []), newComment] }
    if (c.replies && c.replies.length)
      return { ...c, replies: insertComment(c.replies, parentId, newComment) }
    return c
  })
}

/**
 * POST /api/forum/:id/comment
 * Body: { author, content, parentId? }
 * parentId=null → comentario raíz; parentId=<id> → reply anidada
 */
app.post('/api/forum/:id/comment', (req, res) => {
  const { author, content, parentId } = req.body
  if (!author || !content)
    return res.status(400).json({ error: 'El nombre y el comentario son obligatorios' })
  if (author.trim().length < 2)
    return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' })
  if (content.trim().length < 2)
    return res.status(400).json({ error: 'El comentario debe tener al menos 2 caracteres' })
  try {
    const posts = readJSON(FORUM_FILE)
    const post = posts.find(p => p.id === parseInt(req.params.id))
    if (!post) return res.status(404).json({ error: 'Post no encontrado' })
    const comment = {
      id: Date.now(),
      author: author.trim().substring(0, 50),
      content: content.trim().substring(0, 600),
      date: today(),
      color: randomColor(),
      replies: [],
    }
    if (!Array.isArray(post.comments)) post.comments = []
    post.comments = insertComment(post.comments, parentId || null, comment)
    writeJSON(FORUM_FILE, posts)
    res.status(201).json(comment)
  } catch { res.status(500).json({ error: 'Error al guardar el comentario' }) }
})

/** DELETE /api/forum/:postId/comment/:commentId — solo admin */
app.delete('/api/forum/:postId/comment/:commentId', (req, res) => {
  const ADMIN_KEY = process.env.ADMIN_KEY || 'portfolio-admin'
  const { adminKey } = req.body
  if (adminKey !== ADMIN_KEY) return res.status(403).json({ error: 'Contraseña incorrecta' })
  function removeComment(comments, id) {
    return comments
      .filter(c => c.id !== id)
      .map(c => ({ ...c, replies: removeComment(c.replies || [], id) }))
  }
  try {
    const posts = readJSON(FORUM_FILE)
    const post  = posts.find(p => p.id === parseInt(req.params.postId))
    if (!post) return res.status(404).json({ error: 'Post no encontrado' })
    post.comments = removeComment(post.comments || [], parseInt(req.params.commentId))
    writeJSON(FORUM_FILE, posts)
    res.json({ ok: true })
  } catch { res.status(500).json({ error: 'Error al eliminar el comentario' }) }
})

app.listen(PORT, () => {
  const ADMIN_KEY = process.env.ADMIN_KEY || 'portfolio-admin'
  console.log(`Servidor de foro corriendo en http://localhost:${PORT}`)
  console.log(`Admin key: ${ADMIN_KEY === 'portfolio-admin' ? '⚠️  usando clave por defecto (cámbiala)' : '✓ configurada'}`)
})