// app/(wherever)/_latest-posts.client.tsx
"use client"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { Shine } from "@/components/Shine"
import { ACCENT, SHADOW_BASE, SHADOW_HOVER, EASE } from "@/lib/tokens"

export type PostMeta = {
  slug: string
  title: string
  date: string
  cover?: string
  excerpt?: string
  readingMinutes?: number
}

export function LatestCard({ p }: { p: PostMeta }) {
  const reduce = useReducedMotion()
  return (
    <motion.article
      className="group relative will-change-transform"
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: EASE }}
      whileHover={reduce ? undefined : { y: -6, rotate: -0.4 }}
    >
      {/* same glow ring */}
      <div
        className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${ACCENT} opacity-30 blur-xl transition group-hover:opacity-60`}
      />

      {/* card surface */}
      <motion.div
        className="relative rounded-[22px] border border-zinc-700/70 bg-zinc-900/70 backdrop-blur p-4 md:p-6"
        style={{ boxShadow: SHADOW_BASE }}
        whileHover={
          reduce
            ? undefined
            : {
                boxShadow: SHADOW_HOVER,
                transition: { duration: 0.35, ease: EASE },
              }
        }
      >
        {/* identical shine sweep */}
        <Shine />

        {/* date pill – matches career period pill */}
        <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${ACCENT} shadow-[0_0_10px_4px_rgba(251,146,60,0.35)]`}
          />
          <span className="rounded-full border border-zinc-700/70 bg-zinc-900/70 px-2 py-0.5 text-[11px] text-zinc-300">
            {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
              new Date(p.date)
            )}
          </span>
        </div>

        {/* cover */}
        {p.cover && (
          <div className="relative mb-4 overflow-hidden rounded-lg">
            <img
              src={p.cover}
              alt=""
              className="h-44 w-full object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-[1.005]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_100%)]"
            />
          </div>
        )}

        {/* text */}
        <h3 className="text-xl md:text-2xl font-semibold text-zinc-100">
          {p.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          {p.readingMinutes ? `${p.readingMinutes} min read` : " "}
        </p>
        {p.excerpt && (
          <p className="mt-2 text-sm text-zinc-200/95 line-clamp-3">
            {p.excerpt}
          </p>
        )}

        {/* CTA chip – same glass/stroke vibe */}
        <div className="mt-4">
          <Link
            href={`/blog/${p.slug}`}
            className="relative inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-medium
                       border border-amber-400/30 bg-amber-400/10 text-amber-300
                       transition-colors hover:text-amber-200 hover:border-amber-300/40"
          >
            Read →
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-[1px] rounded-[14px] border border-transparent
                         [background:linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))_padding-box,
                                      linear-gradient(120deg,#fbbf24,#fb923c,#f43f5e)_border-box]"
            />
          </Link>
        </div>
      </motion.div>
    </motion.article>
  )
}
