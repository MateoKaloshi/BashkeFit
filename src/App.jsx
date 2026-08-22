import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  Menu,
  Salad,
  TimerReset,
  X,
} from 'lucide-react'

const navigation = [
  { id: 'home', label: 'Kreu' },
  { id: 'about', label: 'Rreth nesh' },
  { id: 'programs', label: 'Programet' },
  { id: 'results', label: 'Rezultatet' },
  { id: 'contact', label: 'Kontakti' },
]

const programs = [
  { icon: Dumbbell, name: 'FORCË', text: 'Seanca progresive me rezistencë, të ndërtuara sipas objektivave të tua.' },
  { icon: HeartPulse, name: 'MASË MUSKULORE', text: 'Program i strukturuar për zhvillimin e muskujve, me ngarkesë dhe progres të kontrolluar.' },
  { icon: TimerReset, name: 'DOBËSIM', text: 'Stërvitje efikase për humbje peshe, formësim dhe përmirësim të kondicionit fizik.' },
  { icon: Salad, name: 'USHQYERJE E SHËNDETSHME', text: 'Strategji të thjeshta dhe realiste ushqyerjeje që mund t’i ruash në vazhdimësi.' },
]

const benefits = [
  ['Strategji ushqyerjeje', 'Udhëzime të qarta që mbështesin stërvitjen, rikuperimin dhe energjinë e përditshme.'],
  ['Rutina stërvitore', 'Stërvitje të strukturuara sipas objektivit tënd, jo ushtrime të zgjedhura rastësisht.'],
  ['STËRVITJE E PERSONALIZUAR', 'Stërvitje e përshtatur sipas nivelit, orarit dhe objektivave të tua.'],
  ['NDJEKJE E PROGRESIT', 'Monitorim i vazhdueshëm i rezultateve për të parë zhvillimin dhe për të përshtatur programin.'],
]

const testimonials = [
  {
    name: 'Elena M.',
    meta: '12 javë · 4 stërvitje në javë',
    quote: 'Plani më dha më në fund strukturën që më mungonte. Ndihem më e fortë, më energjike dhe shumë më e sigurt në palestër.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Daniel K.',
    meta: '16 javë · program force',
    quote: 'Gjithçka ishte e thjeshtë për t’u ndjekur dhe e matshme. Ndjekja e progresit më mbajti të përqendruar nga java në javë.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Sara L.',
    meta: '10 javë · trajnim personal',
    quote: 'Ndërthurja e stërvitjes me këshillimin për ushqyerjen solli ndryshimin më të madh. Gjithçka ishte personale, jo e përgjithshme.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=85',
  },
]

function Brand({ footer = false }) {
  return (
    <span className={`brand-lockup${footer ? ' brand-lockup--footer' : ''}`}>
      <img src="/bashkefit-logo.png" alt="" aria-hidden="true" className="logo-mark" />
      <span className="brand-name">BASHKË<span>FIT</span></span>
    </span>
  )
}

function App() {
  const [testimonial, setTestimonial] = useState(0)
  const [bmi, setBmi] = useState(null)
  const [form, setForm] = useState({ age: '', weight: '', height: '' })
  const [activeSection, setActiveSection] = useState('home')
  const [navOnDark, setNavOnDark] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const photos = document.querySelectorAll('.motion-photo')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.18) {
            entry.target.classList.add('is-visible')
          } else {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      { threshold: [0, 0.18] },
    )

    photos.forEach((photo) => observer.observe(photo))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const closeMobileMenu = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const closeMenuOnDesktop = () => {
      if (window.innerWidth > 640) setMenuOpen(false)
    }

    window.addEventListener('keydown', closeMobileMenu)
    window.addEventListener('resize', closeMenuOnDesktop)
    return () => {
      window.removeEventListener('keydown', closeMobileMenu)
      window.removeEventListener('resize', closeMenuOnDesktop)
    }
  }, [])

  useEffect(() => {
    let animationFrame

    const updateNavbar = () => {
      animationFrame = undefined
      const navbar = document.querySelector('.topbar')
      if (!navbar) return

      const navbarBounds = navbar.getBoundingClientRect()
      const marker = navbarBounds.bottom + 24
      const sections = navigation
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean)

      const currentSection = [...sections].reverse().find((section) => (
        section.getBoundingClientRect().top <= marker
      ))
      const darkSection = [...document.querySelectorAll('.programs, .results, footer')]
        .find((section) => {
          const bounds = section.getBoundingClientRect()
          const navbarMiddle = navbarBounds.top + navbarBounds.height / 2
          return bounds.top <= navbarMiddle && bounds.bottom >= navbarMiddle
        })

      setActiveSection(currentSection?.id || 'home')
      setNavOnDark(Boolean(darkSection))
      setNavScrolled(window.scrollY > 24)
    }

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateNavbar)
    }

    updateNavbar()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  const bmiLabel = useMemo(() => {
    if (!bmi) return ''
    if (bmi < 18.5) return 'Nënpeshë'
    if (bmi < 25) return 'Peshë e shëndetshme'
    if (bmi < 30) return 'Mbipeshë'
    return 'Obezitet'
  }, [bmi])

  const calculateBmi = (event) => {
    event.preventDefault()
    const weight = Number(form.weight)
    const heightM = Number(form.height) / 100
    if (!weight || !heightM) return
    setBmi(Number((weight / (heightM * heightM)).toFixed(1)))
  }

  const scrollTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: id === 'about' ? 'center' : 'start',
    })
  }

  const nextTestimonial = () => setTestimonial((testimonial + 1) % testimonials.length)
  const prevTestimonial = () => setTestimonial((testimonial - 1 + testimonials.length) % testimonials.length)

  return (
    <div className="site-shell">
      <header className={`topbar${navOnDark ? ' topbar--dark' : ''}${navScrolled ? ' topbar--scrolled' : ''}`}>
        <button className="brand-button" onClick={() => scrollTo('home')} aria-label="Shko te kreu">
          <Brand />
        </button>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Mbyll menunë' : 'Hap menunë'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        <nav id="main-navigation" className={`desktop-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navigimi kryesor">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={activeSection === item.id ? 'is-active' : ''}
              aria-current={activeSection === item.id ? 'page' : undefined}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

      </header>

      <main>
        <section className="hero section" id="home">
          <div className="hero-copy reveal">
            <p className="eyebrow">STËRVITJE PERSONALE ONLINE DHE FIZIKISHT</p>
            <h1>NDËRTO FORCË.<br />KRIJO <span className="hero-accent">RITËM.</span></h1>
            <p className="hero-description">
              Stërvitje e zgjuar, udhëzim personal dhe një plan i ndërtuar rreth objektivave të tua — që progresi të bëhet pjesë e rutinës.
            </p>
            <button className="primary-button" onClick={() => scrollTo('contact')}>FILLO TANI <ArrowRight size={18} /></button>
          </div>

          <div className="hero-visual reveal">
            <div className="lime-panel"></div>
            <div className="dot-grid hero-dots"></div>
            <div className="hero-image-wrap motion-photo from-right">
              <img
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=90"
                alt="Atlete duke u stërvitur"
                className="hero-image"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div className="hero-note">
              <strong>Qëndro i shëndetshëm duke qenë aktiv.</strong>
              <p>Zakone të thjeshta. Performancë më e mirë. Progres i vazhdueshëm.</p>
            </div>
          </div>

          <div className="hero-stats">
            <div><strong>3</strong><span>Trajnerë të certifikuar</span></div>
            <div><strong>8</strong><span>Vite përvojë</span></div>
            <div><strong>47+</strong><span>Klientë aktivë</span></div>
          </div>
        </section>

        <section className="about section" id="about">
          <div className="photo-collage reveal">
            <div className="photo photo-a motion-photo from-left"><img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85" alt="Seancë stërvitore" loading="lazy" decoding="async" /></div>
            <div className="photo photo-b motion-photo from-top"><img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85" alt="Pajisje palestre" loading="lazy" decoding="async" /></div>
            <div className="photo photo-c motion-photo from-right"><img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85" alt="Stërvitje fitnesi" loading="lazy" decoding="async" /></div>
            <div className="about-square"></div>
            <div className="dot-grid about-dots"></div>
          </div>

          <div className="about-copy reveal">
            <p className="eyebrow">RRETH NESH</p>
            <h2 className="about-title">STËRVITEMI <span>BASHKË</span>,<br />QËNDROJMË <span>FIT</span>.</h2>
            <p>
              Ne kombinojmë stërvitjen e personalizuar, udhëzimin profesional dhe mbështetjen e vazhdueshme. Çdo program ndërtohet sipas nivelit dhe objektivave të tua, për rezultate reale dhe të qëndrueshme.
            </p>
            <button className="outline-button" onClick={() => scrollTo('programs')}>MËSO MË SHUMË <ArrowRight size={18} /></button>
          </div>
        </section>

        <section className="benefits section">
          <div className="section-title centered reveal">
            <p className="eyebrow">PSE TRAJNIM PERSONAL</p>
            <h2>PËRFITIMET E<br />TRAJNIMIT PERSONAL</h2>
          </div>
          <div className="benefit-grid">
            {benefits.map(([title, text], index) => (
              <article className="benefit-card reveal" key={title}>
                <span className="benefit-number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="programs section" id="programs">
          <div className="program-heading reveal">
            <div>
              <p className="eyebrow light">STËRVITU ME QËLLIM</p>
              <h2>PROGRAMET <span>TONA</span></h2>
            </div>
            <p>Zgjidh drejtimin tënd. Ne të ndihmojmë ta kthesh në progres real.</p>
          </div>
          <div className="program-grid">
            {programs.map(({ icon: Icon, name, text }) => (
              <article className="program-card reveal" key={name}>
                <div className="program-icon"><Icon size={32} strokeWidth={1.8} /></div>
                <h3>{name}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bmi section">
          <div className="bmi-art reveal">
            <div className="bmi-photo motion-photo from-bottom">
              <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1000&q=85" alt="Atlete fitnesi" loading="lazy" decoding="async" />
            </div>
            <div className="bmi-lime-block"></div>
            <div className="dot-grid bmi-dots"></div>
          </div>

          <div className="bmi-content reveal">
            <p className="eyebrow">MJET I SHPEJTË SHËNDETËSOR</p>
            <h2>LLOGARIT<br /><span>BMI-NË</span> TËNDE</h2>
            <p>Vendos matjet e tua për një vlerësim të shpejtë të indeksit të masës trupore (BMI). Ky është një tregues i thjeshtë orientues, jo një diagnozë.</p>
            <form className="bmi-form" onSubmit={calculateBmi}>
              <input type="number" placeholder="Mosha" aria-label="Mosha" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              <input type="number" placeholder="Pesha / kg" aria-label="Pesha në kilogramë" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required />
              <input type="number" placeholder="Gjatësia / cm" aria-label="Gjatësia në centimetra" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} required />
              <button className="primary-button" type="submit">LLOGARIT</button>
            </form>
            {bmi && <div className="bmi-result" aria-live="polite"><strong>{bmi}</strong><span>{bmiLabel}</span></div>}
          </div>
        </section>

        <section className="results section" id="results">
          <div className="results-intro reveal">
            <p className="eyebrow light">HISTORI KLIENTËSH</p>
            <h2>NJERËZ TË VËRTETË.<br /><span>REZULTATE TË VËRTETA.</span></h2>
            <p>Progresi duket ndryshe për secilin. Ajo që na bashkon është një plan i qartë dhe punë e vazhdueshme.</p>
            <div className="slider-buttons">
              <button onClick={prevTestimonial} aria-label="Dëshmia e mëparshme"><ChevronLeft size={22} /></button>
              <button onClick={nextTestimonial} aria-label="Dëshmia e radhës"><ChevronRight size={22} /></button>
            </div>
          </div>
          <div className="testimonial reveal">
            <img src={testimonials[testimonial].image} alt={'Klientja/klienti ' + testimonials[testimonial].name} loading="lazy" decoding="async" />
            <div className="testimonial-text">
              <div className="quote-mark">“</div>
              <p>{testimonials[testimonial].quote}</p>
              <div><strong>{testimonials[testimonial].name}</strong><span>{testimonials[testimonial].meta}</span></div>
            </div>
          </div>
        </section>

        <section className="cta section" id="contact">
          <div className="cta-copy reveal">
            <p className="eyebrow">GATI PËR TË LËVIZUR?</p>
            <h2>GATI PËR<br /><span>TË FILLUAR?</span></h2>
            <p>Na trego çfarë dëshiron të përmirësosh dhe ne do të të ndihmojmë të zgjedhësh pikënisjen e duhur.</p>
            <div className="cta-checks">
              <span><BadgeCheck size={18} /> Plan i personalizuar</span>
              <span><BadgeCheck size={18} /> Ndjekje e progresit</span>
              <span><BadgeCheck size={18} /> Mbështetje e vazhdueshme</span>
            </div>
          </div>
          <form className="contact-card reveal" onSubmit={(e) => e.preventDefault()}>
            <label>EMRI DHE MBIEMRI<input type="text" placeholder="Emri dhe mbiemri" /></label>
            <label>ADRESA E EMAILIT<input type="email" placeholder="ti@shembull.com" /></label>
            <label>OBJEKTIVI KRYESOR<select defaultValue=""><option value="" disabled>Zgjidh një objektiv</option><option>Humbje peshe</option><option>Rritje force</option><option>Përmirësim kondicioni</option><option>Trajnim personal</option></select></label>
            <button className="primary-button" type="submit">BASHKOHU TANI <ArrowRight size={18} /></button>
          </form>
        </section>

        <section className="newsletter section">
          <div className="newsletter-copy reveal">
            <p className="eyebrow">QËNDRO I MOTIVUAR</p>
            <h2>ABONOHU NË<br /><span>BULETININ TONË</span></h2>
          </div>
          <form className="newsletter-form reveal" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Emri yt" aria-label="Emri yt" />
            <input type="email" placeholder="Adresa jote e emailit" aria-label="Adresa jote e emailit" />
            <button className="primary-button" type="submit">ABONOHU</button>
          </form>
        </section>
      </main>

      <footer>
        <div className="footer-grid">
          <div className="footer-intro"><button className="footer-brand-button" onClick={() => scrollTo('home')} aria-label="Shko te kreu"><Brand footer /></button><p>Stërvitje, udhëzim dhe një komunitet i krijuar për të të mbajtur gjithmonë në lëvizje.</p></div>
          <div className="footer-links"><h4>MENU-ja</h4><button onClick={() => scrollTo('home')}>Kreu</button><button onClick={() => scrollTo('about')}>Rreth nesh</button><button onClick={() => scrollTo('programs')}>Programet</button></div>
          <div className="footer-contact"><h4>KONTAKTI</h4><p>Tiranë, Shqipëri</p><a href="https://www.instagram.com/bashkefit" target="_blank" rel="noreferrer">Instagram</a><p>bashkefit@gmail.com</p></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 BashkëFit</span>
        </div>
      </footer>
    </div>
  )
}

export default App
