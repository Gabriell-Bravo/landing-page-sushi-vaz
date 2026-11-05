import type { ReactNode } from 'react'
import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

/** Entrada suave (fade + subida) quando o bloco aparece na tela. */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

interface HeadlineProps {
  lines: ReactNode[]
  as?: 'h1' | 'h2'
  className?: string
  delay?: number
}

/** Título em que cada linha sobe de dentro de uma máscara. */
export function Headline({ lines, as: Tag = 'h2', className, delay = 0 }: HeadlineProps) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span className="mask" key={i}>
          <motion.span
            className="mask-inner"
            initial={{ y: '112%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.05, delay: delay + i * 0.12, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
