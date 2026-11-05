/**
 * Nigiri montado com fotos reais de cada parte (prato, arroz e atum).
 * As camadas usam as mesmas classes (sa-*) que a seção "Experiência" anima com GSAP.
 */
export default function SushiPhoto() {
  return (
    <div className="sp" role="img" aria-label="Nigiri de atum sendo montado: prato, folha decorativa, arroz e fatia de atum">
      <div className="sp-sun sa-sun" />

      <img className="sp-plate sa-plate" src="/nigiri/prato.webp" width={863} height={459} alt="" draggable={false} />

      <img className="sp-leaf sa-leaf" src="/nigiri/folha.webp" width={779} height={913} alt="" draggable={false} />

      <div className="sp-shadow sa-plate" />

      <img className="sp-rice sa-rice" src="/nigiri/arroz.webp" width={786} height={482} alt="" draggable={false} />

      <img className="sp-neta sa-neta" src="/nigiri/atum.webp" width={952} height={446} alt="" draggable={false} />
    </div>
  )
}
