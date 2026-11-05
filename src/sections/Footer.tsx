import { MessageCircle } from 'lucide-react'
import { InstagramIcon } from '../components/icons'
import { INSTAGRAM_URL, WHATSAPP_DISPLAY, houses, waLink } from '../data/site'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src="/logo.jpg" alt="" width={56} height={56} />
        <div>
          <strong>SUSHI VAZ</strong>
          <span>Omakase · Edomaezushi</span>
        </div>
      </div>

      <ul className="footer-houses">
        {houses.map((h) => (
          <li key={h.id}>
            <strong>{h.name}</strong>
            <span>{h.address}</span>
            <span>{h.city}</span>
          </li>
        ))}
      </ul>

      <div className="footer-links">
        <a href={waLink()} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={18} /> {WHATSAPP_DISPLAY}
        </a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          <InstagramIcon width={18} height={18} /> @sushi_vaz
        </a>
      </div>

      <p className="footer-small">
        Não servimos salmão. · © {new Date().getFullYear()} Sushi Vaz
      </p>
    </footer>
  )
}
