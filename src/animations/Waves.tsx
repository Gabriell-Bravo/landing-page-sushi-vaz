import { useEffect, useId, useRef } from 'react'
import { gsap } from '../lib/gsap'

interface WavesProps {
  /** Cor de fundo da seção, usada para "esconder" a sobreposição das escamas. */
  background: string
  color?: string
  className?: string
}

/** Faixa de ondas japonesas (seigaiha) que desliza com a rolagem. */
export default function Waves({ background, color = '#171412', className }: WavesProps) {
  const id = useId().replace(/:/g, '')
  const root = useRef<SVGSVGElement>(null)
  const layer = useRef<SVGGElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || !layer.current) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(layer.current, {
        x: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
    })
    return () => mm.revert()
  }, [])

  const ring = (cx: number, cy: number) => (
    <g key={`${cx}-${cy}`}>
      {[20, 15, 10, 5].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill={background} stroke={color} strokeWidth="1.1" />
      ))}
    </g>
  )

  return (
    <svg ref={root} className={className} viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id={id} width="40" height="20" patternUnits="userSpaceOnUse">
          {ring(20, 10)}
          {ring(0, 20)}
          {ring(40, 20)}
          {ring(20, 30)}
        </pattern>
      </defs>
      <g ref={layer}>
        <rect x="-120" y="0" width="1440" height="90" fill={`url(#${id})`} />
      </g>
    </svg>
  )
}
