import { Download, ArrowRight, Code2 } from 'lucide-react'

const skills = [
  'React', 'JavaScript', 'Node.js', 'HTML & CSS', 'Python', 'Java',
  'COBOL', 'MySQL', 'MongoDB', 'MariaDB', 'Git',
]

// ── MÓDULO DE PERFIL ───────────────────────────────────────────────
// Página de perfil con foto, descripción, habilidades y botones de acción

function Profile({ navigate }) {
  return (
    <section className="profile">
      <div className="profile__container">
        <div className="profile__text">
          <div className="profile__label">
            <Code2 size={12} />
            Desarrollador Full Stack
          </div>
          <h1 className="profile__name">Carlos Mendoza</h1>
          <h2 className="profile__role">
            Desarrollador <span className="highlight">Fullstack</span>
          </h2>
          <p className="profile__bio">
            Apasionado por la IA y futuro especialista en IA y Big Data, siempre dispuesto a aprender,
            conocer y dar un paso más hacia el futuro poniendo otro objetivo en cada nuevo reto.
          </p>

          <div className="profile__skills">
            {skills.map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>

          <div className="profile__buttons">
            <a href="/CV.pdf" download className="btn btn--primary">
              <Download size={16} />
              Descargar CV
            </a>
            <button className="btn btn--outline" onClick={() => navigate('contact')}>
              Contactarme
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <div className="profile__avatar-wrapper">
          <div className="profile__avatar-ring" />
          <div className="profile__avatar-ring profile__avatar-ring--2" />
          <div className="profile__avatar">
            <div className="profile__avatar-inner">
              <img src="/img_entero.jpeg" alt="Carlos Mendoza" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile