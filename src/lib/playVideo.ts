/**
 * Safari e o Chrome do celular bloqueiam autoplay se a propriedade `muted`
 * não estiver ligada de verdade. O atributo do React nem sempre faz isso.
 * Também troca para o MP4 se o WebM (com fundo transparente) não tocar.
 */
export function bindMutedAutoplay(video: HTMLVideoElement | null, fallbackSrc?: string) {
  if (!video) return () => {}

  video.muted = true
  video.defaultMuted = true
  video.playsInline = true

  let stopped = false

  const attempt = () => {
    if (stopped || video.ended) return
    const pending = video.play()
    if (!pending) return
    pending
      .then(() => {
        video.removeEventListener('loadeddata', attempt)
        video.removeEventListener('canplay', attempt)
        window.removeEventListener('pointerdown', onGesture)
      })
      .catch(() => {})
  }

  const onError = () => {
    if (!fallbackSrc || video.currentSrc.includes(fallbackSrc)) return
    video.src = fallbackSrc
    video.load()
    attempt()
  }

  const onGesture = () => attempt()

  attempt()
  video.addEventListener('loadeddata', attempt)
  video.addEventListener('canplay', attempt)
  video.addEventListener('error', onError)
  window.addEventListener('pointerdown', onGesture)

  return () => {
    stopped = true
    video.removeEventListener('loadeddata', attempt)
    video.removeEventListener('canplay', attempt)
    video.removeEventListener('error', onError)
    window.removeEventListener('pointerdown', onGesture)
  }
}

/**
 * iPhone e Safari não desenham WebM com transparência: o chef some ou fica num retângulo preto.
 * Nesses aparelhos usamos o MP4 com o fundo creme do site.
 */
export function chefVideoSrc() {
  const ua = navigator.userAgent
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const safari = /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Android/.test(ua)
  return iOS || safari ? '/chef.mp4' : '/chef.webm'
}
