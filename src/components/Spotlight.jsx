import { useState, useEffect } from 'react'

/* ─── Reactbits-style cursor spotlight ──────────────────────────────── */
function Spotlight() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 })

  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      className="spotlight"
      style={{
        background: `radial-gradient(520px circle at ${pos.x}px ${pos.y}px,
          rgba(232,100,10,0.07) 0%,
          rgba(200,70,0,0.035) 30%,
          transparent 65%
        )`,
      }}
    />
  )
}

export default Spotlight
