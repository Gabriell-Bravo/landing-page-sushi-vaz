import { useMemo } from 'react'

/** Gerador pseudo-aleatório com semente fixa: o desenho fica igual a cada carregamento. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Grain {
  x: number
  y: number
  rx: number
  ry: number
  rot: number
  o: number
}

const RICE_PATH =
  'M106 202 C104 160 148 138 200 138 C252 138 296 160 294 202 C294 238 252 252 200 252 C148 252 106 238 106 202Z'

/** Contorno da fatia de peixe (atum e vieira) vista de cima. */
const NETA_TOP =
  'M80 176 C92 146 150 130 200 130 C250 130 308 146 320 176 C302 192 250 198 200 198 C150 198 98 192 80 176Z'

const NETA_SIDE =
  'M80 176 C98 192 150 198 200 198 C250 198 302 192 320 176 L318 188 C300 206 250 212 200 212 C150 212 100 206 82 188Z'

/**
 * Nigiri de atum desenhado em camadas, com sombras, brilho e textura.
 * A seção "Experiência" monta as camadas com GSAP, conforme a rolagem.
 */
export default function SushiAssembly() {
  const grains = useMemo<Grain[]>(() => {
    const rand = mulberry32(2026)
    const list: Grain[] = []
    for (let i = 0; i < 165; i++) {
      const r = Math.sqrt(rand())
      const a = rand() * Math.PI * 2
      list.push({
        x: 200 + r * 108 * Math.cos(a),
        y: 226 + r * 32 * Math.sin(a),
        rx: 7.6 + rand() * 3,
        ry: 3.9 + rand() * 1.5,
        rot: rand() * 180 - 90,
        o: 0.88 + rand() * 0.12,
      })
    }
    return list.sort((p, q) => p.y - q.y)
  }, [])

  return (
    <svg viewBox="0 0 400 320" className="sa" role="img" aria-label="Nigiri de atum sendo montado sobre um prato">
      <defs>
        {/* prato */}
        <radialGradient id="sa-plate-g" cx="45%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f1ece2" />
          <stop offset="1" stopColor="#d9d2c4" />
        </radialGradient>
        <radialGradient id="sa-well-g" cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#f6f2ea" />
          <stop offset="1" stopColor="#dcd5c7" />
        </radialGradient>
        <linearGradient id="sa-rim-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#bfb8aa" />
        </linearGradient>

        {/* arroz */}
        <radialGradient id="sa-grain-g" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#fcf7ec" />
          <stop offset="1" stopColor="#ece3ce" />
        </radialGradient>
        <linearGradient id="sa-rice-base-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf6ea" />
          <stop offset="1" stopColor="#e4d8be" />
        </linearGradient>
        <radialGradient id="sa-rice-shade-g" cx="50%" cy="38%" r="62%">
          <stop offset="0.55" stopColor="#4a3a1e" stopOpacity="0" />
          <stop offset="1" stopColor="#4a3a1e" stopOpacity="0.14" />
        </radialGradient>
        <clipPath id="sa-rice-clip">
          <path d={RICE_PATH} />
        </clipPath>
        <clipPath id="sa-top-clip">
          <ellipse cx="200" cy="164" rx="70" ry="12.5" />
        </clipPath>

        {/* atum */}
        <linearGradient id="sa-tuna-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ec6f60" />
          <stop offset="0.45" stopColor="#cf3a42" />
          <stop offset="1" stopColor="#a52030" />
        </linearGradient>
        <linearGradient id="sa-tuna-side-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7d1523" />
          <stop offset="0.5" stopColor="#ab2332" />
          <stop offset="1" stopColor="#7d1523" />
        </linearGradient>
        <radialGradient id="sa-tuna-glow-g" cx="40%" cy="30%" r="70%">
          <stop offset="0" stopColor="#ff9c8c" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff9c8c" stopOpacity="0" />
        </radialGradient>

        {/* vieira */}
        <linearGradient id="sa-scallop-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbeedb" />
          <stop offset="0.5" stopColor="#f0dcbf" />
          <stop offset="1" stopColor="#d6b996" />
        </linearGradient>
        <linearGradient id="sa-scallop-side-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bd9f7c" />
          <stop offset="0.5" stopColor="#dcc3a0" />
          <stop offset="1" stopColor="#bd9f7c" />
        </linearGradient>
        <radialGradient id="sa-scallop-glow-g" cx="38%" cy="28%" r="70%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* coberturas */}
        <radialGradient id="sa-uni-g" cx="38%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="0.55" stopColor="#f2a53b" />
          <stop offset="1" stopColor="#c7701e" />
        </radialGradient>
        <radialGradient id="sa-ikura-g" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ffc47f" />
          <stop offset="0.5" stopColor="#f0761f" />
          <stop offset="1" stopColor="#b53f11" />
        </radialGradient>
        <radialGradient id="sa-caviar-g" cx="38%" cy="32%" r="80%">
          <stop offset="0" stopColor="#6e6e78" />
          <stop offset="0.45" stopColor="#25252b" />
          <stop offset="1" stopColor="#0a0a0d" />
        </radialGradient>

        {/* nori e acompanhamentos */}
        <linearGradient id="sa-nori-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0d120e" />
          <stop offset="0.35" stopColor="#2a3a30" />
          <stop offset="0.7" stopColor="#141b16" />
          <stop offset="1" stopColor="#0b0f0c" />
        </linearGradient>
        <linearGradient id="sa-cyl-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a0e0b" />
          <stop offset="0.28" stopColor="#2f4236" />
          <stop offset="0.6" stopColor="#161e18" />
          <stop offset="1" stopColor="#090c0a" />
        </linearGradient>
        <radialGradient id="sa-wasabi-g" cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#d3e88a" />
          <stop offset="0.6" stopColor="#9cbf4d" />
          <stop offset="1" stopColor="#6c8f2f" />
        </radialGradient>
        <linearGradient id="sa-gari-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbd9d2" />
          <stop offset="1" stopColor="#eea79d" />
        </linearGradient>
        <linearGradient id="sa-leaf-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f8a3a" />
          <stop offset="1" stopColor="#25501f" />
        </linearGradient>

        <filter id="sa-blur-1" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        <filter id="sa-blur-3" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="sa-blur-8" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="8" />
        </filter>

        {/* arroz do nigiri, reaproveitado com <use> */}
        <g id="sa-rice-art">
          <ellipse cx="200" cy="248" rx="104" ry="15" fill="#2b1d0e" opacity="0.4" filter="url(#sa-blur-3)" />
          <path d={RICE_PATH} fill="url(#sa-rice-base-g)" />
          <g clipPath="url(#sa-rice-clip)">
            {grains.map((g, i) => (
              <ellipse
                key={i}
                cx={g.x}
                cy={g.y}
                rx={g.rx}
                ry={g.ry}
                fill="url(#sa-grain-g)"
                stroke="#a89870"
                strokeOpacity="0.3"
                strokeWidth="0.6"
                opacity={g.o}
                transform={`rotate(${g.rot} ${g.x} ${g.y})`}
              />
            ))}
          </g>
          <path d={RICE_PATH} fill="url(#sa-rice-shade-g)" />
        </g>
      </defs>

      <circle className="sa-sun" cx="200" cy="146" r="122" fill="#d4351c" />

      {/* Prato de cerâmica */}
      <g className="sa-plate">
        <ellipse cx="200" cy="282" rx="168" ry="18" fill="#171412" opacity="0.28" filter="url(#sa-blur-8)" />
        <ellipse cx="200" cy="254" rx="176" ry="44" fill="url(#sa-rim-g)" />
        <ellipse cx="200" cy="250" rx="176" ry="44" fill="url(#sa-plate-g)" />
        <ellipse cx="200" cy="252" rx="140" ry="30" fill="url(#sa-well-g)" />
        <ellipse cx="200" cy="250" rx="140" ry="30" fill="none" stroke="#bdb5a5" strokeWidth="1" opacity="0.55" />
        <path
          d="M46 238 C70 214 140 204 200 206"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.75"
          filter="url(#sa-blur-1)"
        />
      </g>

      {/* Acompanhamentos (wasabi, gengibre e folha) */}
      <g className="sa-garnish">
        <g>
          <ellipse cx="312" cy="262" rx="20" ry="6" fill="#1f2a10" opacity="0.35" filter="url(#sa-blur-3)" />
          <path
            d="M290 254 C288 238 308 230 320 238 C334 246 330 264 312 266 C300 268 291 264 290 254Z"
            fill="url(#sa-wasabi-g)"
          />
          <ellipse cx="306" cy="243" rx="7" ry="3" fill="#ffffff" opacity="0.5" filter="url(#sa-blur-1)" />
          <g fill="#5d7d28" opacity="0.5">
            <circle cx="314" cy="252" r="1" />
            <circle cx="304" cy="257" r="1" />
            <circle cx="320" cy="258" r="0.9" />
            <circle cx="298" cy="249" r="0.9" />
          </g>
        </g>
        <g>
          <ellipse cx="90" cy="262" rx="26" ry="6" fill="#4a2a20" opacity="0.25" filter="url(#sa-blur-3)" />
          <path
            d="M64 258 C66 242 90 238 102 248 C96 262 76 266 64 258Z"
            fill="url(#sa-gari-g)"
            stroke="#d98b80"
            strokeOpacity="0.6"
            strokeWidth="0.8"
          />
          <path
            d="M82 254 C86 240 110 238 120 250 C112 262 94 264 82 254Z"
            fill="url(#sa-gari-g)"
            stroke="#d98b80"
            strokeOpacity="0.6"
            strokeWidth="0.8"
          />
          <path
            d="M72 252 C80 246 94 246 100 252"
            fill="none"
            stroke="#fff3ef"
            strokeOpacity="0.7"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
        <g>
          <path
            d="M236 262 C232 246 252 232 272 236 C270 252 258 266 236 262Z"
            fill="url(#sa-leaf-g)"
            stroke="#18381a"
            strokeOpacity="0.5"
            strokeWidth="0.8"
          />
          <path d="M240 260 C250 250 260 242 270 238" fill="none" stroke="#9bc58a" strokeOpacity="0.7" strokeWidth="0.9" strokeLinecap="round" />
        </g>
      </g>

      {/* Peça 1 · nigiri de atum */}
      <g className="sa-p1">
        <use href="#sa-rice-art" className="sa-rice" />

        <g className="sa-neta">
          <path d={NETA_SIDE} fill="url(#sa-tuna-side-g)" />
          <path
            d="M82 188 C100 206 150 212 200 212 C250 212 300 206 318 188"
            fill="none"
            stroke="#ff8f84"
            strokeWidth="1"
            opacity="0.35"
            filter="url(#sa-blur-1)"
          />
          <path d={NETA_TOP} fill="url(#sa-tuna-g)" />
          <path d={NETA_TOP} fill="url(#sa-tuna-glow-g)" />
          <g fill="none" strokeLinecap="round" filter="url(#sa-blur-1)">
            <path d="M104 166 C140 151 200 147 262 153" stroke="#f9cfc5" strokeWidth="4.2" opacity="0.5" />
            <path d="M96 177 C150 162 230 162 304 172" stroke="#f9cfc5" strokeWidth="3.2" opacity="0.45" />
            <path d="M118 186 C160 177 232 177 290 184" stroke="#f9cfc5" strokeWidth="2.8" opacity="0.38" />
          </g>
          <g fill="none" strokeLinecap="round" stroke="#f7b3a7" opacity="0.42">
            <path d="M92 170 C140 155 214 151 290 159" strokeWidth="0.8" />
            <path d="M100 179 C150 167 226 167 298 177" strokeWidth="0.7" />
            <path d="M122 161 C160 151 214 148 258 152" strokeWidth="0.6" />
            <path d="M134 188 C168 184 214 184 252 188" strokeWidth="0.6" />
            <path d="M134 174 C168 167 214 167 252 172" strokeWidth="0.6" />
          </g>
          <ellipse cx="166" cy="146" rx="52" ry="6" transform="rotate(-6 166 146)" fill="#ffffff" opacity="0.36" filter="url(#sa-blur-3)" />
          <path
            d="M130 154 C156 145 190 141 222 142"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
            filter="url(#sa-blur-1)"
          />
          <path d={NETA_TOP} fill="none" stroke="#5c0f1b" strokeOpacity="0.4" strokeWidth="0.9" />
        </g>

        <g className="sa-nori">
          <path
            d="M187 133 Q200 128 213 133 L217 226 Q200 237 183 226Z"
            fill="#000000"
            opacity="0.35"
            transform="translate(3 3)"
            filter="url(#sa-blur-3)"
          />
          <path d="M187 133 Q200 128 213 133 L217 226 Q200 237 183 226Z" fill="url(#sa-nori-g)" />
          <g stroke="#ffffff" strokeOpacity="0.07" strokeWidth="0.8" fill="none">
            <path d="M190 134 L188 230" />
            <path d="M195 131 L194 234" />
            <path d="M200 130 L200 236" />
            <path d="M205 131 L206 234" />
            <path d="M210 134 L212 230" />
          </g>
          <path d="M191 136 L189 224" stroke="#7fa08a" strokeOpacity="0.28" strokeWidth="2.2" strokeLinecap="round" filter="url(#sa-blur-1)" />
        </g>
      </g>
    </svg>
  )
}
