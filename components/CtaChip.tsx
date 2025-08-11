// components/CtaChip.tsx
"use client"

import Link from "next/link"
import { type ReactNode } from "react"

const ACCENT = "from-amber-400 via-orange-500 to-rose-500"

type Props = {
  href: string
  label: string
  prefix?: ReactNode // e.g. <ArrowLeft size={16} />
  suffix?: ReactNode // e.g. "→" or an icon
  className?: string
}

export default function CtaChip({
  href,
  label,
  prefix,
  suffix,
  className = "",
}: Props) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm
                  border border-white/10 bg-black/30 backdrop-blur
                  text-zinc-200 hover:text-white transition-colors ${className}`}
    >
      {/* leading dot to match All posts exactly */}
      <span
        className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${ACCENT}`}
        aria-hidden
      />

      {/* optional prefix (icon) */}
      {prefix ? (
        <span className="opacity-80 group-hover:opacity-100">{prefix}</span>
      ) : null}

      {label}

      {/* optional suffix */}
      {suffix ? (
        <span className="opacity-90 group-hover:opacity-100">{suffix}</span>
      ) : null}

      {/* gradient border (identical) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[1px] rounded-full border border-transparent
                   [background:linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))_padding-box,
                                linear-gradient(120deg,#fbbf24,#fb923c,#f43f5e)_border-box]"
      />
      {/* sweep (identical) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span
          className="absolute -inset-1 -translate-x-full rounded-full
                     bg-gradient-to-r from-white/10 via-white/40 to-white/10
                     opacity-0 transition duration-700 will-change-transform
                     group-hover:translate-x-0 group-hover:opacity-30
                     [mask-image:linear-gradient(90deg,transparent,black,transparent)]"
        />
      </span>
    </Link>
  )
}
