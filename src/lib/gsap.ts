import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// A barra de endereço do celular muda a altura da tela o tempo todo.
// Sem isso, o ScrollTrigger recalcula e as animações de rolagem não disparam.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }
