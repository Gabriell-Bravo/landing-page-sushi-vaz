import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { Headline, Reveal } from '../components/Reveal'
import { waLink } from '../data/site'
import { bindMutedAutoplay } from '../lib/playVideo'

export default function Kaitai() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia(el)

    mm.add('(not (prefers-reduced-motion: reduce))', () => {
      // O sol vermelho cresce atrás do vídeo.
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
    })

    return () => mm.revert()
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let stop = () => {}
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        stop = bindMutedAutoplay(v)
      },
      { threshold: 0.35 },
    )
    io.observe(v)
    return () => {
      io.disconnect()
      stop()
    }
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

      <div className="kaitai-media">
        <video
          ref={video}
          src="/kaitai-preview.mp4"
          muted
          playsInline
          loop
          controls
          preload="metadata"
          aria-label="Cenas de uma edição anterior da cerimônia Kaitai"
        />
      </div>
    </section>
  )
}
