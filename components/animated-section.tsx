
"use client"

import { motion, type Variants } from "framer-motion"
import type { PropsWithChildren } from "react"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export function FadeInSection({
  children,
  className,
  once = true,
}: PropsWithChildren<{ className?: string; once?: boolean }>) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({
  children,
  delay = 0.06,
  className = "",
}: PropsWithChildren<{ delay?: number; className?: string }>) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function Item({ children }: PropsWithChildren) {
  return <motion.div variants={fadeUp}>{children}</motion.div>
}

export function HoverLift({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <div className={className}>{children}</div>
}
