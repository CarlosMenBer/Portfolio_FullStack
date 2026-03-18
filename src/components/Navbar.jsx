import { useState } from 'react'
import { House, ClipboardList, User, Mail, Share2, Menu, X, Flame } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'welcome',  label: 'Inicio',   Icon: House },
  { id: 'forum',    label: 'Tablón',   Icon: ClipboardList },
  { id: 'profile',  label: 'Perfil',   Icon: User },
  { id: 'contact',  label: 'Contacto', Icon: Mail },
  { id: 'social',   label: 'Redes',    Icon: Share2 },
]

function Navbar({ page, navigate }) {
  const [open, setOpen] = useState(false)

  const handleNav = (id) => {
    navigate(id)
    setOpen(false)
  }

  return (
    <>
      {/* ── Top bar ──────────────────────────────────────────── */}
      <nav className="navbar">
        <button className="navbar__logo" onClick={() => handleNav('welcome')}>
          <Flame size={16} className="navbar__logo-icon" />
          <span className="navbar__logo-bracket">&lt;</span>
          Carlos Mendoza Bernal
          <span className="navbar__logo-bracket"> /&gt;</span>
        </button>

        {/* desktop links */}
        <ul className="navbar__links navbar__links--desktop">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <li key={id}>
              <button
                onClick={() => handleNav(id)}
                className={page === id ? 'navbar__link--active' : ''}
              >
                <Icon size={13} strokeWidth={2} />
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* mobile hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* ── Mobile sidebar overlay ───────────────────────────── */}
      <div
        className={`sidebar-overlay${open ? ' sidebar-overlay--open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`} aria-label="Menú lateral">
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <Flame size={18} className="sidebar__logo-icon" />
            <span className="sidebar__logo-bracket">&lt;</span>
            Carlos Mendoza Bernal
            <span className="sidebar__logo-bracket"> /&gt;</span>
          </div>
          <button className="sidebar__close" onClick={() => setOpen(false)} aria-label="Cerrar menú">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sidebar__item${page === id ? ' sidebar__item--active' : ''}`}
              onClick={() => handleNav(id)}
            >
              <span className="sidebar__item-icon">
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <span>{label}</span>
              {page === id && <span className="sidebar__item-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <span>&lt; portfolio / {new Date().getFullYear()} &gt;</span>
        </div>
      </aside>
    </>
  )
}

export default Navbar