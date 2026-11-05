import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { gsap } from '../lib/gsap'
import { gallery } from '../data/site'
import { Headline, Reveal } from '../components/Reveal'

/** O carrossel avança uma foto a cada 2 segundos. */
const STEP_MS = 2000
const SLIDE_S = 0.9

export default function Gallery() {
  const track = useRef<HTMLDivElement>(null)
  const [start, setStart] = useState(0)
  const n = gallery.length

  // A foto da frente vai para o fim da fila; assim o carrossel nunca acaba.
  const items = Array.from({ length: n }, (_, k) => ({ item: gallery[(start + k) % n], pos: (start + k) % n }))

  useEffect(() => {
    const t = track.current
    if (!t) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tween: gsap.core.Tween | undefined
    const id = window.setInterval(() => {
      const first = t.firstElementChild as HTMLElement | null
      if (!first) return
      const gap = parseFloat(getComputedStyle(t).columnGap) || 0
      tween = gsap.to(t, {
        x: -(first.offsetWidth + gap),
        duration: SLIDE_S,
        ease: 'power3.inOut',
        onComplete: () => {
          flushSync(() => setStart((s) => (s + 1) % n))
          gsap.set(t, { x: 0 })
        },
      })
    }, STEP_MS)

    return () => {
      window.clearInterval(id)
      tween?.kill()
      gsap.set(t, { x: 0 })
    }
  }, [n])

  return (
    <section className="gallery" id="galeria">
      <div className="gallery-intro">
        <Reveal>
          <p className="eyebrow">02 / Antes de provar</p>
        </Reveal>
        <Headline className="h2" lines={['Sinta a', <em key="b">experiência.</em>]} />
        <Reveal delay={0.2}>
          <p className="lead">
            Cada peça chega no seu tempo. Fotos reais da casa; o cardápio
            muda conforme o dia.
          </p>
        </Reveal>
      </div>

      <div className="gallery-viewport">
        <div className="gallery-track" ref={track}>
          {items.map(({ item, pos }) => (
            <figure
              className="gallery-card"
              key={item.src}
              style={{ ['--ar' as string]: item.ratio }}
            >
              <div className="gallery-frame">
                <img src={item.src} alt={item.alt} decoding="async" />
              </div>
              <figcaption>
                <span>{String(pos + 1).padStart(2, '0')}</span> {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
