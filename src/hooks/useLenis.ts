import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

/**
 * Rolagem suave (Lenis) sincronizada com o ScrollTrigger do GSAP.
 * Desligada quando o visitante prefere menos movimento.
 */
export function useLenis() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)

    // No celular a rolagem é nativa. Sem este aviso, o GSAP não vê o scroll
    // e a montagem do sushi, o sol e o parallax ficam parados.
    const onScroll = () => ScrollTrigger.update()
    window.addEventListener('scroll', onScroll, { passive: true })

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | undefined
    let tick: ((time: number) => void) | undefined

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true, syncTouch: false })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    return () => {
      window.removeEventListener('load', refresh)
      window.removeEventListener('scroll', onScroll)
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
    }
  }, [])
}
