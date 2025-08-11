// components/shine.tsx
"use client"
import { motion, useReducedMotion } from "framer-motion"
import { SHINE_GRADIENT, SHINE_MASK, SHINE_DURATION, EASE } from "@/lib/tokens"

export function Shine() {
  const reduce = useReducedMotion()
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]"
    >
      <motion.span
        className="absolute -inset-1 rounded-[22px] will-change-transform"
        style={{
          backgroundImage: SHINE_GRADIENT,
          WebkitMaskImage: SHINE_MASK as any,
          maskImage: SHINE_MASK as any,
          opacity: 0,
          transform: "translateX(-100%)",
        }}
        whileHover={
          reduce
            ? undefined
            : {
                opacity: 0.28,
                x: "0%",
                transition: { duration: SHINE_DURATION, ease: EASE },
              }
        }
      />
    </span>
  )
}
