import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Instagram,
} from 'lucide-react'

function MuscularBody({ size = 32 }) {
  const iconSize = size + 12
  return <img className="muscular-body-icon" src="/torso.png" alt="" aria-hidden="true" width={iconSize} height={iconSize} />
}

function WeightLossIcon({ size = 32 }) {
  const iconSize = size + 12
  return <img src="/weight-loss-card.png" alt="" aria-hidden="true" width={iconSize} height={iconSize} />
}

function StrengthIcon({ size = 32 }) {
  const iconSize = size + 8
  return <img src="/lighting.png" alt="" aria-hidden="true" width={iconSize} height={iconSize} />
}

function HealthyFoodIcon({ size = 32 }) {
  const iconSize = size + 12
  return <img src="/salad.png" alt="" aria-hidden="true" width={iconSize} height={iconSize} />
}

const navigation = [
  { id: 'home', label: 'Kreu' },
  { id: 'about', label: 'Rreth nesh' },
  { id: 'programs', label: 'Programet' },
  { id: 'bmi', label: 'BMI' },
  { id: 'contact', label: 'Kontakti' },
]

const programs = [
  { icon: StrengthIcon, name: 'FORCË', text: 'Seanca progresive me rezistencë, të ndërtuara sipas objektivave të tua.' },
  { icon: MuscularBody, name: 'MASË MUSKULORE', text: 'Program i strukturuar për zhvillimin e muskujve, me ngarkesë dhe progres të kontrolluar.' },
  { icon: WeightLossIcon, name: 'DOBËSIM', text: 'Stërvitje efikase për humbje peshe, formësim dhe përmirësim të kondicionit fizik.' },
  { icon: HealthyFoodIcon, name: 'USHQYERJE E SHËNDETSHME', text: 'Strategji të thjeshta dhe realiste ushqyerjeje që mund t’i ruash në vazhdimësi.' },
]

const benefits = [
  ['Strategji ushqyerjeje', 'Udhëzime të qarta që mbështesin stërvitjen, rikuperimin dhe energjinë e përditshme.'],
  ['Rutina stërvitore', 'Stërvitje të strukturuara sipas objektivit tënd, jo ushtrime të zgjedhura rastësisht.'],
  ['STËRVITJE E PERSONALIZUAR', 'Stërvitje e përshtatur sipas nivelit, orarit dhe objektivave të tua.'],
  ['NDJEKJE E PROGRESIT', 'Monitorim i vazhdueshëm i rezultateve për të parë zhvillimin dhe për të përshtatur programin.'],
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
  const [bmi, setBmi] = useState(null)
  const [form, setForm] = useState({ age: '', weight: '', height: '' })
  const [activeSection, setActiveSection] = useState('home')
  const [navOnDark, setNavOnDark] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigationTarget = useRef(null)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const returnToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    returnToTop()
    window.addEventListener('pageshow', returnToTop)

    return () => window.removeEventListener('pageshow', returnToTop)
  }, [])

  useEffect(() => {
    const photos = document.querySelectorAll('.motion-photo')
    const photosByTrigger = new Map()

    photos.forEach((photo) => {
      const trigger = photo.closest('.photo-collage, .hero-visual, .bmi-art') || photo.parentElement
      const triggerPhotos = photosByTrigger.get(trigger) || []
      triggerPhotos.push(photo)
      photosByTrigger.set(trigger, triggerPhotos)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const linkedPhotos = photosByTrigger.get(entry.target) || []

          if (entry.intersectionRatio >= 0.18) {
            linkedPhotos.forEach((photo) => photo.classList.add('is-visible'))
          } else if (entry.intersectionRatio <= 0.02) {
            linkedPhotos.forEach((photo) => photo.classList.remove('is-visible'))
          }
        })
      },
      { threshold: [0, 0.02, 0.18] },
    )

    photosByTrigger.forEach((_, trigger) => observer.observe(trigger))
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
      const isResponsive = window.innerWidth <= 900
      const marker = isResponsive
        ? navbarBounds.bottom + 24
        : window.innerHeight * 0.5
      const sections = navigation
        .map(({ id }) => {
          const section = document.getElementById(id)
          if (!section) return null

          const responsiveAnchor = {
            about: '.about-copy',
            programs: '.program-heading',
            bmi: '.bmi-content',
            contact: '.contact-poster-copy',
          }[id]

          return {
            id,
            anchor: isResponsive && responsiveAnchor
              ? section.querySelector(responsiveAnchor) || section
              : section,
          }
        })
        .filter(Boolean)

      const currentSection = [...sections].reverse().find(({ id, anchor }) => {
        const tabletTolerance = window.innerWidth > 640 && window.innerWidth <= 900 ? 4 : 0
        const sectionMarker = isResponsive && id === 'contact'
          ? navbarBounds.bottom + 82 + tabletTolerance
          : marker + tabletTolerance
        return anchor.getBoundingClientRect().top <= sectionMarker
      })
      const darkSection = [...document.querySelectorAll('.programs, footer')]
        .find((section) => {
          const bounds = section.getBoundingClientRect()
          const navbarMiddle = navbarBounds.top + navbarBounds.height / 2
          return bounds.top <= navbarMiddle && bounds.bottom >= navbarMiddle
        })

      setActiveSection(navigationTarget.current || currentSection?.id || 'home')
      setNavOnDark(isResponsive
        ? currentSection?.id === 'programs' || darkSection?.tagName === 'FOOTER'
        : Boolean(darkSection))
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
    const target = document.getElementById(id)
    if (!target) return

    if (window.innerWidth > 900 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: id === 'about' || id === 'bmi' || id === 'contact' ? 'center' : 'start',
      })
      return
    }

    const isTabletNavigation = window.innerWidth > 640 && window.innerWidth <= 900
    if (isTabletNavigation) {
      navigationTarget.current = id
      setActiveSection(id)
    }

    window.requestAnimationFrame(() => {
      const start = window.scrollY
      const bounds = target.getBoundingClientRect()
      const centered = id === 'contact'
      const scrollMargin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
      const navbar = document.querySelector('.topbar')
      const menuToggle = navbar?.querySelector('.menu-toggle')
      const navbarBottom = window.innerWidth <= 640 && menuToggle
        ? menuToggle.getBoundingClientRect().bottom + (Number.parseFloat(getComputedStyle(navbar).paddingBottom) || 0)
        : navbar?.getBoundingClientRect().bottom || scrollMargin
      const aboutCopyTop = id === 'about'
        ? target.querySelector('.about-copy')?.getBoundingClientRect().top
        : null
      const programHeadingTop = id === 'programs'
        ? target.querySelector('.program-heading')?.getBoundingClientRect().top
        : null
      const bmiContentTop = id === 'bmi'
        ? target.querySelector('.bmi-content')?.getBoundingClientRect().top
        : null
      const contactCopyTop = id === 'contact'
        ? target.querySelector('.contact-poster-copy')?.getBoundingClientRect().top
        : null
      const destination = id === 'home'
        ? 0
        : id === 'about' && aboutCopyTop != null
          ? start + aboutCopyTop - navbarBottom - 24
        : id === 'programs' && programHeadingTop != null
          ? start + programHeadingTop - navbarBottom - 24
        : id === 'bmi' && bmiContentTop != null
          ? start + bmiContentTop - navbarBottom - 24
        : id === 'contact' && contactCopyTop != null
          ? start + contactCopyTop - navbarBottom - 82
        : centered
          ? start + bounds.top - ((window.innerHeight - bounds.height) / 2)
          : start + bounds.top - scrollMargin
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const end = Math.max(0, Math.min(destination, maxScroll))
      const scrollDistance = Math.abs(end - start)
      const duration = window.innerWidth <= 640
        ? Math.min(2400, Math.max(1150, scrollDistance * 0.75))
        : 750
      const startedAt = performance.now()
      const pageRoot = document.documentElement
      const previousScrollBehavior = pageRoot.style.scrollBehavior
      if (window.innerWidth <= 640) pageRoot.style.scrollBehavior = 'auto'

      const animateScroll = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        const eased = window.innerWidth <= 640
          ? 0.5 - (Math.cos(Math.PI * progress) / 2)
          : progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2

        window.scrollTo(0, start + ((end - start) * eased))
        if (progress < 1) {
          window.requestAnimationFrame(animateScroll)
        } else if (id === 'contact') {
          window.requestAnimationFrame(() => {
            const finalNavbar = document.querySelector('.topbar')
            const finalToggle = finalNavbar?.querySelector('.menu-toggle')
            const finalNavbarBottom = window.innerWidth <= 640 && finalToggle
              ? finalToggle.getBoundingClientRect().bottom + (Number.parseFloat(getComputedStyle(finalNavbar).paddingBottom) || 0)
              : finalNavbar?.getBoundingClientRect().bottom || 0
            const finalContactTop = target.querySelector('.contact-poster-copy')?.getBoundingClientRect().top

            if (finalContactTop != null) {
              window.scrollTo(0, window.scrollY + finalContactTop - finalNavbarBottom - 82)
            }
            pageRoot.style.scrollBehavior = previousScrollBehavior
          })
        } else if (progress === 1) {
          pageRoot.style.scrollBehavior = previousScrollBehavior
        }

        if (progress === 1 && isTabletNavigation) {
          window.setTimeout(() => {
            if (navigationTarget.current === id) navigationTarget.current = null
          }, 180)
        }
      }

      window.requestAnimationFrame(animateScroll)
    })
  }

  return (
    <div className="site-shell">
      <header className={`topbar${navOnDark ? ' topbar--dark' : ''}${navScrolled ? ' topbar--scrolled' : ''}`}>
        <button className="brand-button" onClick={() => scrollTo('home')} aria-label="Shko te kreu">
          <Brand />
        </button>

        <button
          className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Mbyll menunë' : 'Hap menunë'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <ChevronDown className="dropdown-arrow" size={24} strokeWidth={2} aria-hidden="true" />
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
            <h1>NE JEMI <span className="hero-brand"><span className="hero-accent">BASHKËFIT</span><span className="hero-dot">.</span></span></h1>
            <p className="hero-description">
              BashkëFit lindi me një ide të thjeshtë: ta bëjmë stërvitjen pjesë të jetës, jo thjesht të rutinës. Një hapësirë ku motivimi, disiplina dhe progresi bashkohen për të të çuar më pranë versionit tënd më të mirë.
            </p>
            <button className="primary-button" onClick={() => scrollTo('contact')}>FILLO TANI <ArrowRight size={18} /></button>
          </div>

          <div className="hero-visual reveal">
            <div className="lime-panel"></div>
            <div className="dot-grid hero-dots"></div>
            <div className="hero-image-wrap motion-photo from-right">
              <img
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=90"
                srcSet="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=480&q=82 480w, https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=760&q=85 760w, https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=90 1100w"
                sizes="(max-width: 640px) 94vw, (max-width: 900px) 86vw, 40vw"
                alt="Atlete duke u stërvitur"
                className="hero-image"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>

        </section>

        <section className="about section" id="about">
          <div className="photo-collage reveal">
            <div className="photo photo-a motion-photo from-left"><img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85" srcSet="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=360&q=80 360w, https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=85 700w" sizes="(max-width: 640px) 38vw, 28vw" alt="Seancë stërvitore" loading="lazy" decoding="async" /></div>
            <div className="photo photo-b motion-photo from-top"><img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85" srcSet="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=360&q=80 360w, https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=85 700w" sizes="(max-width: 640px) 40vw, 30vw" alt="Pajisje palestre" loading="lazy" decoding="async" /></div>
            <div className="photo photo-c motion-photo from-right"><img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85" srcSet="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=360&q=80 360w, https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=85 700w" sizes="(max-width: 640px) 34vw, 26vw" alt="Stërvitje fitnesi" loading="lazy" decoding="async" /></div>
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

        <section className="bmi section" id="bmi">
          <div className="bmi-art reveal">
            <div className="bmi-photo motion-photo from-bottom">
              <img src="/bmi-realistic-branded.png" alt="Atlete me logon BashkëFit duke matur belin" loading="lazy" decoding="async" />
            </div>
            <div className="bmi-lime-block"></div>
            <div className="dot-grid bmi-dots"></div>
          </div>

          <div className="bmi-content reveal">
            <p className="eyebrow">MJET I SHPEJTË SHËNDETËSOR</p>
            <h2>LLOGARIT<br /><span>BMI-NË</span> TËNDE</h2>
            <p>Vendos matjet e tua për një vlerësim të shpejtë të indeksit të masës trupore (BMI). Ky është një tregues i thjeshtë orientues, jo një diagnozë.</p>
            <form className="bmi-form" onSubmit={calculateBmi}>
              <input type="number" inputMode="numeric" min="1" placeholder="Mosha" aria-label="Mosha" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              <input type="number" inputMode="decimal" min="1" step="0.1" placeholder="Pesha / kg" aria-label="Pesha në kilogramë" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required />
              <input type="number" inputMode="decimal" min="1" step="0.1" placeholder="Gjatësia / cm" aria-label="Gjatësia në centimetra" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} required />
              <button className="primary-button" type="submit">LLOGARIT</button>
            </form>
            {bmi && <div className="bmi-result" aria-live="polite"><strong>{bmi}</strong><span>{bmiLabel}</span></div>}
          </div>
        </section>

        <section className="cta section" id="contact">
          <div className="contact-poster reveal">
            <Instagram className="contact-watermark" aria-hidden="true" strokeWidth={1.2} />
            <div className="contact-poster-copy">
              <p className="eyebrow">FILLIMI YT NIS KËTU</p>
              <h2>LE TA NISIM<br /><span>BASHKË.</span></h2>
              <p>Na trego objektivin tënd dhe ne do të të ndihmojmë të ndërtosh një plan të qartë, të përshtatur për ty.</p>
            </div>
            <a className="contact-instagram-button" href="https://www.instagram.com/bashkefit" target="_blank" rel="noreferrer">
              <Instagram size={22} /> NA KONTAKTO <ArrowRight size={20} />
            </a>
            <div className="contact-poster-footer">
              <div className="contact-meta">
                <div><span>EMAIL</span><a href="mailto:bashkefit@gmail.com">bashkefit@gmail.com</a></div>
                <div><span>INSTAGRAM</span><a href="https://www.instagram.com/bashkefit" target="_blank" rel="noreferrer">@bashkefit</a></div>
                <div><span>VENDNDODHJA</span><strong>TIRANË</strong></div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer>
        <div className="footer-grid">
          <div className="footer-intro"><button className="footer-brand-button" onClick={() => scrollTo('home')} aria-label="Shko te kreu"><Brand footer /></button><p>Bashkë drejt më shumë force, energjie dhe progresi.</p></div>
          <div className="footer-links"><h4>MENU-ja</h4><button onClick={() => scrollTo('home')}>Kreu</button><button onClick={() => scrollTo('about')}>Rreth nesh</button><button onClick={() => scrollTo('programs')}>Programet</button></div>
          <div className="footer-contact"><h4>KONTAKTI</h4><p>Tiranë, Shqipëri</p><a href="https://www.instagram.com/bashkefit" target="_blank" rel="noreferrer">Instagram</a><a href="mailto:bashkefit@gmail.com">bashkefit@gmail.com</a></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 BashkëFit</span>
        </div>
      </footer>
    </div>
  )
}

export default App
