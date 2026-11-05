import { motion } from 'motion/react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { houses } from '../data/site'
import { Headline, Reveal } from '../components/Reveal'
import Waves from '../animations/Waves'

export default function Houses() {
  return (
    <section className="houses" id="casas">
      <Waves className="houses-waves" background="#171412" color="#f4eee3" />

      <div className="houses-head">
        <Reveal>
          <p className="eyebrow">04 / As casas</p>
        </Reveal>
        <Headline className="h2" lines={['Escolha a', <em key="b">sua casa.</em>]} />
        <Reveal delay={0.2}>
          <p className="lead">
            Duas casas em São Paulo e uma no Rio. O balcão muda de endereço,
            o cuidado com cada peça continua o mesmo.
          </p>
        </Reveal>
      </div>

      <div className="houses-grid">
        {houses.map((h, i) => (
          <motion.article
            className="house"
            key={h.id}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.95, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
          >
            <div className="house-photo">
              <img
                src={h.photo}
                alt={h.photoAlt}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: h.objectPosition }}
              />
              <span className="house-city">{h.city}</span>
            </div>
            <div className="house-body">
              <h3>{h.name}</h3>
              <p className="house-address">
                <MapPin size={15} /> {h.address}
              </p>
              <p className="house-note">{h.note}</p>
              <div className="house-actions">
                <a className="btn btn--small" href={h.whatsapp} target="_blank" rel="noopener noreferrer">
                  Reservar <ArrowUpRight size={14} />
                </a>
                <a className="link" href={h.maps} target="_blank" rel="noopener noreferrer">
                  Como chegar
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
