"use client"

import Link from "next/link"
import * as React from "react"

const ACCENT = "from-amber-400 via-orange-500 to-rose-500"

type Props = {
  href?: string
  children: React.ReactNode // include the arrow in the label if you want (e.g., "All posts →" or "← Back to home")
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  hideDot?: boolean // set true if you ever want to remove the tiny dot
}

export function CtaChip({
  href,
  children,
  className = "",
  onClick,
  hideDot,
}: Props) {
  const base = `group relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm
     border border-white/10 bg-black/30 backdrop-blur
     text-zinc-200 hover:text-white transition-colors focus:outline-none
     focus-visible:ring-2 focus-visible:ring-amber-400/40 cursor-pointer`

  const content = (
    <>
      {/* tiny gradient dot (same as before) */}
      {!hideDot && (
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${ACCENT} shrink-0`}
        />
      )}

      <span className="relative z-10">{children}</span>

      {/* sweeping gloss — identical feel to your All posts pill */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full overflow-hidden"
      >
        <span
          className="absolute -inset-1 -translate-x-full opacity-0
                     bg-gradient-to-r from-white/0 via-white/35 to-white/0
                     transition duration-700 will-change-transform
                     group-hover:translate-x-0 group-hover:opacity-100
                     group-focus-visible:translate-x-0 group-focus-visible:opacity-100
                     [mask-image:linear-gradient(90deg,transparent,black,transparent)]"
        />
      </span>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={`${base} ${className}`}>
      {content}
    </button>
  )
}
