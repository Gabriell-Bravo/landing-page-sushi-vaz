import { motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import { Headline, Reveal } from '../components/Reveal'
import { WHATSAPP_DISPLAY, waLink } from '../data/site'

const steps = [
  'Toque em “Reservar” na casa que você escolheu. O WhatsApp abre com a mensagem pronta.',
  'Confirme com a equipe a casa, a data, o horário e quantas pessoas vão.',
  'Depois de conferir os detalhes, faça o pagamento do sinal de R$ 100 por pessoa, via Pix, seguindo as orientações do atendimento.',
]

export default function Booking() {
  return (
    <section className="booking" id="reservas">
      <div className="booking-head">
        <Reveal>
          <p className="eyebrow">05 / Reservas</p>
        </Reveal>
        <Headline className="h2" lines={['Seu lugar no', <em key="b">balcão.</em>]} />
        <Reveal delay={0.2}>
          <motion.a
            className="btn btn--red"
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle size={16} /> {WHATSAPP_DISPLAY}
          </motion.a>
        </Reveal>
      </div>

      <div className="booking-body">
        <ol className="booking-steps">
          {steps.map((text, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <li>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <p>{text}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.2}>
          <aside className="booking-note">
            <strong>Bom saber</strong>
            <p>
              A reserva só é confirmada depois do pagamento do sinal. Consultar
              um horário ainda não garante o lugar. As experiências têm horários
              programados e lugares limitados: chegue pontualmente, porque
              incluir pessoas ou alterar a reserva na chegada depende da
              disponibilidade. Valores, horários e restrições alimentares, fale
              com a equipe.
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}
