import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { Headline, Reveal } from '../components/Reveal'

export default function Team() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia(el)
    mm.add('(not (prefers-reduced-motion: reduce))', () => {
      gsap.fromTo(
        '.team-bg img',
        { yPercent: -9, scale: 1.12 },
        { yPercent: 9, scale: 1.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="team" ref={root}>
      <div className="team-bg">
        <img
          src="/fotos/equipe.jpg"
          alt="Equipe do Sushi Vaz no balcão, segurando tábuas de sashimi"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="team-shade" />
      <div className="team-copy">
        <Reveal>
          <p className="eyebrow eyebrow--light">Gente de verdade</p>
        </Reveal>
        <Headline
          className="h2 h2--light"
          lines={['Quem prepara cada peça,', <em key="b">você vê de perto.</em>]}
        />
      </div>
    </section>
  )
}
