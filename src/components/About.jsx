const skills = [
  'React', 'JavaScript', 'Node.js', 'Python',
  'HTML & CSS', 'Git', 'SQL', 'TypeScript'
]

// ── MÓDULO DE SOBRE MÍ ───────────────────────────────────────────────
// Sección de presentación con foto, descripción y habilidades destacadas

function About() {
  return (
    <section id="sobre-mi" className="about">
      <div className="about__container">
        <div className="about__text">
          <p className="about__greeting">Hola, soy</p>
          <h1 className="about__role">Carlos</h1>
          <h2 className="about__role">
            Desarrollador <span className="highlight">Full Stack</span>
          </h2>
          <p className="about__bio">
            Apasionado por crear experiencias digitales únicas y funcionales.
            Me especializo en construir aplicaciones web modernas con tecnologías
            actuales, siempre buscando la mejor solución para cada problema.
          </p>

          <div className="about__skills">
            {skills.map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>

          <div className="about__buttons">
            <a
              href="/CV.pdf"
              download
              className="btn btn--primary"
            >
              Descargar CV
            </a>
            <button
              className="btn btn--outline"
              onClick={() => document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' })}
            >
              Contactarme
            </button>
          </div>
        </div>

        <div className="about__avatar-wrapper">
          <div className="about__avatar">
            <div className="about__avatar-inner">
              <img src="/img_cara.jpeg" alt="Carlos" />
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="38" r="22" fill="#a29bfe" opacity="0.9"/>
                <ellipse cx="50" cy="85" rx="32" ry="20" fill="#6c5ce7" opacity="0.8"/>
              </svg>
            </div>
          </div>
          <div className="about__avatar-glow" />
        </div>
      </div>

      <div className="about__scroll-hint">
        <div className="scroll-arrow" />
      </div>
    </section>
  )
}

export default About
