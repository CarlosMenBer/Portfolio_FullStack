import { useState, useRef, useCallback } from 'react'
import Navbar from './components/Navbar'
import Welcome from './components/Welcome'
import Forum from './components/Forum'
import Profile from './components/Profile'
import Contact from './components/Contact'
import SocialLinks from './components/SocialLinks'
import FireBackground from './components/FireBackground'
import Spotlight from './components/Spotlight'
import './App.css'

const PAGES = { welcome: Welcome, forum: Forum, profile: Profile, contact: Contact, social: SocialLinks }

function App() {
  const [page, setPage] = useState('welcome')
  const [animKey, setAnimKey] = useState(0)
  const [exiting, setExiting] = useState(false)
  const nextPageRef = useRef(null)

  const navigate = useCallback((newPage) => {
    if (newPage === page || exiting) return
    nextPageRef.current = newPage
    setExiting(true)
    setTimeout(() => {
      setPage(nextPageRef.current)
      setExiting(false)
      setAnimKey(k => k + 1)
    }, 280)
  }, [page, exiting])

  const PageComponent = PAGES[page] || Welcome

  return (
    <div className="app">
      <FireBackground />
      <Spotlight />
      <Navbar page={page} navigate={navigate} />
      <main className="main-content">
        <div
          key={animKey}
          className={`page-wrapper${exiting ? ' page-wrapper--exit' : ''}`}
        >
          <PageComponent navigate={navigate} />
        </div>
      </main>
      <footer className="footer">
        <span className="footer__code">&lt; portfolio &mdash; {new Date().getFullYear()} /&gt;</span>
      </footer>
    </div>
  )
}

export default App