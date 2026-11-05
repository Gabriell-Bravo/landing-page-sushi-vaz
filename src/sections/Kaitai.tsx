import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { Headline, Reveal } from '../components/Reveal'
import { waLink } from '../data/site'

export default function Kaitai() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia(el)

    mm.add('(not (prefers-reduced-motion: reduce))', () => {
      // O sol vermelho cresce atrás da cabeça do atum.
      gsap.fromTo(
        '.kaitai-sun',
        { scale: 0.08, yPercent: -50 },
        {
          scale: 1,
          yPercent: -50,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'center center', scrub: 0.7 },
        },
      )
      gsap.fromTo(
        '.kaitai-bg img',
        { yPercent: -6, scale: 1.12 },
        { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.fromTo(
        '.kaitai-photo--a',
        { yPercent: 8 },
        { yPercent: -8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.fromTo(
        '.kaitai-photo--b',
        { yPercent: -10 },
        { yPercent: 14, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="kaitai" id="kaitai" ref={root}>
      <div className="kaitai-bg" aria-hidden="true">
        <img src="/fotos/balcao.jpg" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="kaitai-sun" aria-hidden="true" />

      <div className="kaitai-copy">
        <Reveal>
          <p className="eyebrow eyebrow--light">03 / Um encontro no balcão</p>
        </Reveal>
        <Headline
          className="h2 h2--light"
          lines={['Kaitai.', <em key="a">A arte do atum,</em>, <em key="b">de perto.</em>]}
        />
        <Reveal delay={0.2}>
          <p className="lead lead--light">
            O atum chega inteiro. Diante dos convidados, o chef abre o peixe,
            mostra cada parte e transforma o corte em uma noite de sabores e
            conversa. Datas, valores e lugares: consulte a equipe.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <motion.a
            className="btn btn--light"
            href={waLink('Olá! Gostaria de saber sobre o próximo Kaitai do Sushi Vaz.')}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            Perguntar sobre o Kaitai <ArrowUpRight size={16} />
          </motion.a>
        </Reveal>
      </div>

      <div className="kaitai-photos">
        <div className="kaitai-photo kaitai-photo--a">
          <img
            src="/fotos/kaitai-cabeca.jpg"
            alt="Chef erguendo a cabeça de um atum inteiro no balcão"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="kaitai-photo kaitai-photo--b">
          <img
            src="/fotos/kaitai-corte.jpg"
            alt="Equipe abrindo um atum inteiro sobre a tábua, durante o Kaitai"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
