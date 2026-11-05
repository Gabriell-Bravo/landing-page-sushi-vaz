import { MotionConfig } from 'motion/react'
import { useLenis } from './hooks/useLenis'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import Experience from './sections/Experience'
import Gallery from './sections/Gallery'
import Kaitai from './sections/Kaitai'
import Houses from './sections/Houses'
import Booking from './sections/Booking'
import Team from './sections/Team'
import Footer from './sections/Footer'

export default function App() {
  useLenis()

  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Gallery />
        <Kaitai />
        <Houses />
        <Booking />
        <Team />
      </main>
      <Footer />
    </MotionConfig>
  )
}
