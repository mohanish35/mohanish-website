// in your server component
import Link from "next/link"

export function AllPostsCTA() {
  return (
    <Link
      href="/blog"
      className="group relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm
                 border border-white/10 bg-black/30 backdrop-blur
                 text-zinc-200 hover:text-white transition-colors"
    >
      {/* inner content */}
      <span
        className="inline-grid place-items-center h-1.5 w-1.5 rounded-full 
                   bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
      />
      All posts →

      {/* soft outer halo on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-full opacity-0 blur-md
                   transition-opacity duration-300 group-hover:opacity-30
                   bg-gradient-to-r from-amber-400/40 via-orange-500/35 to-rose-500/40"
      />

      {/* elegant light sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span
          className="absolute -inset-0.5 -translate-x-full rounded-full opacity-0
                     bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.35),rgba(255,255,255,0))]
                     transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)]
                     group-hover:translate-x-0 group-hover:opacity-100
                     [mask-image:linear-gradient(90deg,transparent,black,transparent)]"
        />
      </span>

      {/* subtle gradient stroke (premium ring) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[1px] rounded-[999px] border border-transparent
                   [background:linear-gradient(90deg,rgba(255,255,255,.16),rgba(255,255,255,.06))_padding-box,
                               linear-gradient(120deg,#fbbf24,#fb923c,#f43f5e)_border-box]"
      />
    </Link>
  )
}