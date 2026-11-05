import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import SushiPhoto from '../animations/SushiPhoto'
import { Headline, Reveal } from '../components/Reveal'

const steps = [
  { n: '01', title: 'Escolha sua casa', text: 'Jardins, Pinheiros ou Leblon.' },
  { n: '02', title: 'Reserve pelo WhatsApp', text: 'A equipe confirma data, horário e lugares.' },
  { n: '03', title: 'Deixe-se surpreender', text: 'O chef conduz. Você só aproveita.' },
]

/** Intervalo, em segundos, entre o começo de uma montagem do sushi e o da próxima. */
const LOOP_S = 5

export default function Experience() {
  const root = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia(el)

    mm.add('(not (prefers-reduced-motion: reduce))', () => {
      // A montagem toca sozinha, sem depender da rolagem: começa quando a seção aparece na tela.
      const tl = gsap
        .timeline({ paused: true, defaults: { ease: 'power2.out' } })
        .call(() => setStep(0), undefined, 0)
        .from('.sa-sun', { scale: 0, transformOrigin: '50% 50%', duration: 0.9 }, 0)
        .from('.sa-plate', { scale: 0.6, opacity: 0, transformOrigin: '50% 50%', duration: 0.9 }, 0.15)
        .from('.sa-leaf', { scaleY: 0, opacity: 0, transformOrigin: '50% 100%', duration: 0.9 }, 0.9)
        .call(() => setStep(1), undefined, 1.6)
        .from('.sa-rice', { yPercent: -110, opacity: 0, duration: 0.9 }, 1.6)
        .call(() => setStep(2), undefined, 2.6)
        .from('.sa-neta', { yPercent: -150, rotation: -7, opacity: 0, transformOrigin: '50% 50%', duration: 0.9 }, 2.6)
        .to('.sa-rice, .sa-neta', { yPercent: 1.5, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 3.6)

      // A montagem se repete a cada 5 segundos (início a início).
      tl.repeat(-1).repeatDelay(Math.max(0, LOOP_S - tl.duration()))

      // Toca enquanto a seção está na tela e pausa quando ela sai, para não gastar processamento à toa.
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 65%',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      })

      return () => {
        st.kill()
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="exp" id="experiencia" ref={root}>
      <div className="exp-copy">
        <Reveal>
          <p className="eyebrow">01 / A experiência</p>
        </Reveal>
        <Headline
          className="h2"
          lines={['O melhor pedido?', <em key="b">Deixar com o chef.</em>]}
        />
        <Reveal delay={0.2}>
          <p className="lead">
            Omakase quer dizer “eu confio em você”. Você se acomoda no balcão,
            vê o corte acontecer e prova uma sequência de sabores escolhida
            pelos ingredientes do dia.
          </p>
        </Reveal>

        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.n} className={i === step ? 'is-active' : undefined}>
              <span className="steps-n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="sa-wrap">
        <SushiPhoto />
      </div>
    </section>
  )
}
