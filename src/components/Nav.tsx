import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { waLink } from '../data/site'

/** Posição da cabeça da carpa dentro do quadro do vídeo (fração da largura). */
const FISH_HEAD = 0.9

const links = [
  { href: '#experiencia', label: 'Experiência' },
  { href: '#kaitai', label: 'Kaitai' },
  { href: '#casas', label: 'Casas' },
  { href: '#reservas', label: 'Reservas' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const fish = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  // A carpa nada da esquerda para a direita pelo topo e a barra vai aparecendo por onde ela passa.
  useLayoutEffect(() => {
    const bar = header.current
    const fishEl = fish.current
    const vid = video.current
    if (!bar || !fishEl || !vid) return

    const finish = () => {
      bar.removeAttribute('data-intro')
      bar.style.removeProperty('--reveal')
      fishEl.style.display = 'none'
      vid.pause()
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }

    bar.setAttribute('data-intro', '')
    bar.style.setProperty('--reveal', '0px')

    const ctx = gsap.context(() => {
      const width = fishEl.offsetWidth
      const barH = bar.offsetHeight
      const vw = window.innerWidth
      const state = { x: -width }
      const place = () => {
        const t = (state.x + width) / (vw + width)
        const bob = Math.sin(t * Math.PI * 5) * 7
        const tilt = Math.cos(t * Math.PI * 5) * 3
        gsap.set(fishEl, { x: state.x, y: barH / 2 - fishEl.offsetHeight / 2 + bob, rotation: tilt })
        bar.style.setProperty('--reveal', `${Math.max(0, state.x + width * FISH_HEAD)}px`)
      }
      place()
      gsap.to(state, {
        x: vw,
        duration: 4.8,
        delay: 0.5,
        ease: 'power1.inOut',
        onUpdate: place,
        onComplete: finish,
      })
    })

    return () => {
      ctx.revert()
      bar.removeAttribute('data-intro')
      bar.style.removeProperty('--reveal')
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
    {/* Ajusta o fundo creme do vídeo para ficar igual ao fundo do site. */}
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <filter id="koi-match" colorInterpolationFilters="sRGB">
        <feComponentTransfer>
          <feFuncR type="linear" slope="0.972" />
          <feFuncG type="linear" slope="0.975" />
          <feFuncB type="linear" slope="0.978" />
        </feComponentTransfer>
      </filter>
    </svg>

    <div className="nav-fish" ref={fish} aria-hidden="true">
      <video ref={video} src="/koi.mp4" autoPlay muted loop playsInline preload="auto" tabIndex={-1} />
    </div>

    <header ref={header} className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <a href="#inicio" className="nav-brand" aria-label="Sushi Vaz, início">
        <img src="/logo.jpg" alt="" width={44} height={44} />
        <span>
          SUSHI VAZ
          <small>OMAKASE</small>
        </span>
      </a>

      <nav className="nav-links" aria-label="Principal">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>

      <motion.a
        className="btn btn--small nav-cta"
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        Reservar
      </motion.a>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-sheet"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn">
              Reservar pelo WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  )
}
