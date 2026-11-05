import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import Waves from '../animations/Waves'
import { Headline } from '../components/Reveal'
import { waLink } from '../data/site'
import { bindMutedAutoplay, chefVideoSrc } from '../lib/playVideo'

const slides = [
  { src: '/fotos/nigiri-vieira.jpg', alt: 'Nigiri de vieira com ouriço, caviar e uma flor comestível', pos: '48% 50%' },
  { src: '/fotos/nigiri-atum.jpg', alt: 'Nigiri de atum com corte brilhante', pos: '42% 60%' },
  { src: '/fotos/gunkan-uni.jpg', alt: 'Gunkans de ouriço, ikura e caviar', pos: '50% 55%' },
]

/** Tempo, em milissegundos, que cada foto fica na tela. */
const SLIDE_MS = 2000

/** Mesmo corte do layout: abaixo disso as fotos do nigiri somem. */
const COMPACT = '(max-width: 899px)'

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const chef = useRef<HTMLVideoElement>(null)
  const [slide, setSlide] = useState(0)
  const [compact, setCompact] = useState(() => window.matchMedia(COMPACT).matches)

  useEffect(() => {
    const mq = window.matchMedia(COMPACT)
    const sync = () => setCompact(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // O vídeo toca uma única vez e termina na pose final, com os sushis flutuando,
  // e assim fica até a página ser recarregada. Quem prefere menos movimento já vê a pose final.
  const freezeChef = () => {
    const v = chef.current
    if (!v || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    v.pause()
    v.currentTime = Math.max(0, v.duration - 0.05)
  }

  useEffect(() => {
    const v = chef.current
    if (!v) return

    // No celular o chef fica abaixo do texto: só começa a andar quando entra na tela,
    // para a entrada pela borda não acontecer fora de vista.
    if (!compact) return bindMutedAutoplay(v, '/chef.mp4')

    let stop = () => {}
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        stop = bindMutedAutoplay(v, '/chef.mp4')
      },
      { threshold: 0.45 },
    )
    io.observe(v)
    return () => {
      io.disconnect()
      stop()
    }
  }, [compact])

  // No desktop o quadro encosta na lateral direita do texto: o chef sai dessa borda.
  useLayoutEffect(() => {
    const el = root.current
    const box = chef.current?.parentElement
    if (!el || !box) return

    const place = () => {
      if (window.matchMedia(COMPACT).matches) {
        box.style.transform = ''
        return
      }
      const copy = el.querySelector('.hero-copy')
      if (!copy) return
      box.style.transform = ''
      const range = document.createRange()
      const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT)
      let textRight = 0
      let node = walker.nextNode()
      while (node) {
        if (node.textContent?.trim()) {
          range.selectNodeContents(node)
          for (const rect of range.getClientRects()) textRight = Math.max(textRight, rect.right)
        }
        node = walker.nextNode()
      }
      const shift = textRight - box.getBoundingClientRect().left
      box.style.transform = `translate3d(${shift}px, 0, 0)`
    }

    place()
    const ro = new ResizeObserver(place)
    ro.observe(el)
    document.fonts?.ready.then(place)
    return () => {
      ro.disconnect()
      box.style.transform = ''
    }
  }, [compact])

  // Troca a foto da abertura a cada 2 segundos (parada para quem prefere menos movimento).
  useEffect(() => {
    if (compact) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setSlide((s) => (s + 1) % slides.length), SLIDE_MS)
    return () => window.clearInterval(id)
  }, [compact])

  useEffect(() => {
    if (compact) return
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia(el)

    mm.add('(not (prefers-reduced-motion: reduce))', () => {
      const scrollOpts = { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.8 }

      // O sol nasce e depois sobe devagar com a rolagem.
      gsap.from('.hero-sun', { scale: 0.4, opacity: 0, duration: 1.8, ease: 'power3.out' })
      gsap.to('.hero-sun-drift', { yPercent: 24, scale: 1.18, ease: 'none', scrollTrigger: scrollOpts })
      gsap.to('.hero-photo img', { yPercent: 8, scale: 1.08, ease: 'none', scrollTrigger: scrollOpts })
    })

    return () => mm.revert()
  }, [compact])

  return (
    <section className="hero" id="inicio" ref={root}>
      <div className="hero-copy">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Omakase · São Paulo e Rio de Janeiro
        </motion.p>

        <Headline
          as="h1"
          className="hero-title"
          delay={0.2}
          lines={['Deixe com', <>o <em>chef.</em></>]}
        />

        <motion.p
          className="hero-lead"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          Sente no balcão e acompanhe cada corte. Uma sequência de peças guiada
          pelo que o mar trouxe hoje, servida na hora em que fica pronta.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85 }}
        >
          <motion.a
            className="btn"
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            Reservar um lugar <ArrowUpRight size={16} />
          </motion.a>
          <motion.a className="btn btn--ghost" href="#casas" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            Conhecer as casas
          </motion.a>
        </motion.div>

        <motion.p
          className="hero-tag"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Aqui não servimos salmão.
        </motion.p>
      </div>

      <div className="hero-chef" aria-hidden="true">
        <video
          ref={chef}
          src={chefVideoSrc()}
          autoPlay={!compact}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          onLoadedMetadata={freezeChef}
        />
        <span className="hero-chef-reveal" />
      </div>

      {!compact && (
        <div className="hero-visual">
          <div className="hero-sun-drift">
            <div className="hero-sun" />
          </div>
          <motion.div
            className="hero-photo"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {slides.map((s, i) => (
              <div key={s.src} className={i === slide ? 'hero-slide is-active' : 'hero-slide'} aria-hidden={i !== slide}>
                <img
                  src={s.src}
                  alt={s.alt}
                  style={{ objectPosition: s.pos }}
                  fetchPriority={i === 0 ? 'high' : undefined}
                />
              </div>
            ))}
          </motion.div>
          <span className="hero-kanji" aria-hidden="true">
            おまかせ
          </span>
        </div>
      )}

      <a className="hero-scroll" href="#experiencia" aria-label="Rolar para a próxima seção">
        <ArrowDown size={16} /> Role
      </a>

      <Waves className="hero-waves" background="#f4eee3" color="#171412" />
    </section>
  )
}
