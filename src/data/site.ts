export const WHATSAPP_NUMBER = '5521972859681'
export const WHATSAPP_DISPLAY = '(21) 97285-9681'
export const INSTAGRAM_URL = 'https://www.instagram.com/sushi_vaz/'

export const waLink = (
  message = 'Olá! Gostaria de consultar uma reserva no Sushi Vaz.',
) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

const mapsLink = (query: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`

export interface House {
  id: string
  name: string
  city: string
  address: string
  note: string
  photo: string
  photoAlt: string
  objectPosition: string
  maps: string
  whatsapp: string
}

export const houses: House[] = [
  {
    id: 'jardins',
    name: 'Jardins',
    city: 'São Paulo',
    address: 'R. Dr. Melo Alves, 343',
    note: 'A casa das tábuas fartas e de muitas noites de Kaitai.',
    photo: '/fotos/jardins.jpg',
    photoAlt: 'Equipe do Sushi Vaz Jardins atrás do balcão',
    objectPosition: '50% 55%',
    maps: mapsLink('Rua Dr. Melo Alves, 343, Jardins, São Paulo'),
    whatsapp: waLink('Olá! Gostaria de consultar uma reserva no Sushi Vaz Jardins.'),
  },
  {
    id: 'pinheiros',
    name: 'Pinheiros',
    city: 'São Paulo',
    address: 'Av. Rebouças, 3415',
    note: 'Um balcão para desacelerar e acompanhar cada etapa de perto.',
    photo: '/fotos/pinheiros.jpg',
    photoAlt: 'Chef montando pratos no balcão do Sushi Vaz Pinheiros',
    objectPosition: '50% 40%',
    maps: mapsLink('Avenida Rebouças, 3415, Pinheiros, São Paulo'),
    whatsapp: waLink('Olá! Gostaria de consultar uma reserva no Sushi Vaz Pinheiros.'),
  },
  {
    id: 'leblon',
    name: 'Leblon',
    city: 'Rio de Janeiro',
    address: 'R. Rita Ludolf, 87 · Loja A',
    note: 'Balcão pequeno, perto da praia, com poucos lugares e muita conversa.',
    photo: '/fotos/leblon.jpg',
    photoAlt: 'Chef segurando um bloco de atum no Sushi Vaz Leblon',
    objectPosition: '50% 45%',
    maps: mapsLink('Rua Rita Ludolf, 87, Leblon, Rio de Janeiro'),
    whatsapp: waLink('Olá! Gostaria de consultar uma reserva no Sushi Vaz Leblon.'),
  },
]

export interface GalleryItem {
  src: string
  alt: string
  title: string
  ratio: number
}

export const gallery: GalleryItem[] = [
  { src: '/fotos/nigiri-vieira.jpg', alt: 'Nigiri de vieira com ouriço, caviar e flor', title: 'Vieira, ouriço e caviar', ratio: 1 },
  { src: '/fotos/macarico.jpg', alt: 'Chef finalizando uma peça com maçarico', title: 'O fogo no balcão', ratio: 1 },
  { src: '/fotos/gunkan-uni.jpg', alt: 'Gunkan de ouriço com caviar e flores', title: 'Gunkan de ouriço', ratio: 0.75 },
  { src: '/fotos/sashimi-bluefin.jpg', alt: 'Prato de sashimi de bluefin com flores comestíveis', title: 'Sashimi de bluefin', ratio: 1.9 },
  { src: '/fotos/otoro.jpg', alt: 'Chef mostrando um corte de toro', title: 'O corte certo', ratio: 1 },
  { src: '/fotos/nigiri-atum.jpg', alt: 'Nigiri de atum', title: 'Nigiri de atum', ratio: 1 },
  { src: '/fotos/travessa.jpg', alt: 'Travessa de sushis e sashimis variados', title: 'A travessa', ratio: 0.86 },
]
