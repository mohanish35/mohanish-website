// components/SiteChrome.tsx
"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  motion,
  useMotionValue,
  useTransform,
  useScroll,
  useSpring,
  useReducedMotion,
} from "framer-motion"
import { Command, Linkedin, Book as BookIcon, X } from "lucide-react"

/* ---------------------- Design constants ---------------------- */
const ACCENT = "from-amber-400 via-orange-500 to-rose-500"
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ---------------------- Utilities ---------------------- */
const cx = (...a: Array<string | false | undefined>) =>
  a.filter(Boolean).join(" ")

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  })
  return (
    <motion.div
      style={{ scaleX }}
      className={`fixed left-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r ${ACCENT}`}
    />
  )
}

function MouseSpotlight() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [x, y])
  return (
    <motion.div
      aria-hidden
      style={{ left: x, top: y }}
      className="pointer-events-none fixed z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-2xl mix-blend-soft-light"
    />
  )
}

function GridGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.08]"
      style={{
        backgroundImage:
          "radial-gradient(1px_1px_at_20px_20px,rgba(255,255,255,0.6)_1px,transparent_1px)",
        backgroundSize: "24px_24px",
      }}
    />
  )
}

function AuroraSweep() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const t = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.15,
  })

  const x1 = useTransform(t, [0, 1], ["-40%", "40%"])
  const y1 = useTransform(t, [0, 1], ["-25%", "25%"])
  const r1 = useTransform(t, [0, 1], [-18, 18])
  const o1 = useTransform(t, [0, 1], [0.03, 0.08])

  const x2 = useTransform(t, [0, 1], ["30%", "-30%"])
  const y2 = useTransform(t, [0, 1], ["-10%", "10%"])
  const r2 = useTransform(t, [0, 1], [12, -12])
  const o2 = useTransform(t, [0, 1], [0.02, 0.05])

  if (reduce) return null

  const mask1 =
    "radial-gradient(140%_80% at 50% 50%, black 35%, transparent 65%)"
  const mask2 =
    "radial-gradient(120%_70% at 55% 45%, black 30%, transparent 62%)"

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        aria-hidden
        style={{
          x: x1,
          y: y1,
          rotate: r1,
          opacity: o1,
          maskImage: mask1 as any,
          WebkitMaskImage: mask1 as any,
        }}
        className={`absolute -inset-[20%] bg-gradient-to-r ${ACCENT} blur-3xl mix-blend-screen`}
      />
      <motion.div
        aria-hidden
        style={{
          x: x2,
          y: y2,
          rotate: r2,
          opacity: o2,
          maskImage: mask2 as any,
          WebkitMaskImage: mask2 as any,
        }}
        className={`absolute -inset-[25%] bg-gradient-to-tr ${ACCENT} blur-2xl mix-blend-screen`}
      />
    </div>
  )
}

/* ---------------------- Pet‑the‑dot bits ---------------------- */
const DOT_STREAK = 7
const ORBIT_DURATION = 6000
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n))
function PurrPulse({ level }: { level: number }) {
  const intensity = clamp(level, 0, DOT_STREAK)
  return (
    <motion.span
      aria-hidden
      animate={{
        opacity: [0.35, 0.6, 0.35],
        scale: [1, 1.1 + intensity * 0.02, 1],
      }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute -inset-2 rounded-full blur-xl bg-gradient-to-r ${ACCENT} pointer-events-none`}
    />
  )
}
function OrbitingDots({ show = false }: { show: boolean }) {
  if (!show) return null
  const dots = 6
  return (
    <div className="absolute -inset-3 pointer-events-none">
      {Array.from({ length: dots }).map((_, i) => {
        const delay = (i / dots) * 0.6
        const r = 16 + (i % 3) * 6
        return (
          <motion.span
            key={i}
            aria-hidden
            className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r ${ACCENT} shadow-[0_0_10px_2px_rgba(251,146,60,0.45)]`}
            style={{ x: r, y: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2.4 + i * 0.2,
              repeat: Infinity,
              ease: "linear",
              delay,
            }}
          />
        )
      })}
    </div>
  )
}

/* ---------------------- Navbar (shared) ---------------------- */
function SiteNavbar() {
  const pathname = usePathname()
  const onHome = pathname === "/" || pathname === "/home"
  const onBlog = pathname?.startsWith("/blog")

  const [cmdOpen, setCmdOpen] = useState(false)
  const [pets, setPets] = useState(0)
  const [party, setParty] = useState(false)
  const petDecayRef = useRef<number | null>(null)

  const NAV: {
    id: "work" | "photos" | "books" | "contact" | "blog"
    label: string
  }[] = useMemo(
    () => [
      { id: "work", label: "Work" },
      { id: "photos", label: "Photography" },
      { id: "books", label: "Books" },
      { id: "contact", label: "Contact" },
      { id: "blog", label: "Blog" }, // always visible in navbar
    ],
    []
  )

  const hrefFor = (id: string) =>
    id === "blog" ? "/blog" : onHome ? `#${id}` : `/#${id}`

  // Cmd+K (toggle)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCmdOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // pet logic
  function handlePet() {
    setPets((p) => {
      const n = p + 1
      if (n >= DOT_STREAK && !party) {
        setParty(true)
        setTimeout(() => setParty(false), ORBIT_DURATION)
      }
      return n
    })
    try {
      ;(navigator as any)?.vibrate?.(10)
    } catch {}
    if (petDecayRef.current) window.clearTimeout(petDecayRef.current)
    petDecayRef.current = window.setTimeout(() => setPets(0), 1200)
  }

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* sweep */}
        <motion.div
          aria-hidden
          initial={{ x: "-40%" }}
          animate={{ x: "140%" }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/15
                     [mask-image:linear-gradient(90deg,transparent,white,transparent)]"
        />
        <div className="relative w-full border-b border-zinc-700/60 bg-zinc-900/70 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between">
              {/* Brand + pet dot */}
              <div className="relative flex items-center gap-2 py-3 md:py-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span
                    className={`text-lg md:text-xl font-semibold bg-gradient-to-r ${ACCENT} bg-clip-text text-transparent`}
                  >
                    {"<"}Mohanish Mankar{"/>"}
                  </span>
                </Link>
                <motion.button
                  type="button"
                  aria-label="Pet the dot"
                  onClick={handlePet}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9, rotate: -12 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="relative grid place-items-center h-4 w-4 rounded-full cursor-pointer"
                >
                  <span
                    className={`relative z-10 h-3.5 w-3.5 rounded-full bg-gradient-to-r ${ACCENT}
                                shadow-[0_0_10px_5px_rgba(251,146,60,0.5)]`}
                  />
                  {pets > 0 && <PurrPulse level={pets} />}
                  <OrbitingDots show={party} />
                </motion.button>
              </div>

              {/* Center nav */}
              <nav className="hidden md:flex items-center gap-6">
                {NAV.map((s) => {
                  const isActive =
                    (s.id === "blog" && onBlog) || (onHome && false) // home sections highlight via scroll on home; here we don't force
                  return (
                    <Link
                      key={s.id}
                      href={hrefFor(s.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={cx(
                        "group relative px-3 py-4 text-sm md:text-base font-medium transition cursor-pointer",
                        isActive
                          ? "text-amber-500"
                          : "text-zinc-300 hover:text-white"
                      )}
                    >
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 rounded-lg opacity-0 blur-md transition
                                    group-hover:opacity-60 bg-gradient-to-r ${ACCENT}`}
                        style={{ height: "1.5rem" }}
                      />
                      {s.label}
                    </Link>
                  )
                })}
              </nav>

              {/* Right tools */}
              <div className="flex items-center gap-2 py-2">
                <button
                  aria-label="Command Menu (⌘K)"
                  onClick={() => setCmdOpen(true)}
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800/60 cursor-pointer"
                >
                  <Command size={16} />
                  <span className="text-xs">⌘K</span>
                </button>
                <a
                  href="https://www.linkedin.com/in/mohanish-mankar-695055140/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl hover:bg-zinc-800/80 backdrop-blur cursor-pointer"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://www.goodreads.com/user/show/74505207-mohanish"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl hover:bg-zinc-800/80 backdrop-blur cursor-pointer"
                  aria-label="Goodreads"
                >
                  <BookIcon size={18} />
                </a>
              </div>
            </div>
          </div>
          <div className={`h-[2px] w-full bg-gradient-to-r ${ACCENT}`} />
        </div>
      </header>

      {/* Command Palette (show all except Blog when on /blog) */}
      {cmdOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cmd-title"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCmdOpen(false)}
          />
          <div className="relative w-full max-w-xl rounded-2xl border border-zinc-700 bg-zinc-900/95 backdrop-blur p-2 shadow-2xl">
            <h2 id="cmd-title" className="sr-only">
              Command Palette
            </h2>

            <div className="flex items-center gap-2 border-b border-zinc-700/60 p-2">
              <Command size={16} className="text-zinc-400" />
              <input
                autoFocus
                placeholder="Jump to…"
                className="w-full bg-transparent outline-none text-sm text-zinc-100 placeholder:text-zinc-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = (e.currentTarget as HTMLInputElement).value
                      .trim()
                      .toLowerCase()
                    const opts = NAV.filter((n) => !(onBlog && n.id === "blog"))
                    const match = opts.find(
                      (o) =>
                        o.label.toLowerCase().includes(v) ||
                        o.id.toLowerCase().includes(v)
                    )
                    if (match)
                      window.location.href =
                        match.id === "blog" ? "/blog" : `/#${match.id}`
                    setCmdOpen(false)
                  }
                }}
              />
              <button
                className="rounded-lg p-1 hover:bg-zinc-800"
                onClick={() => setCmdOpen(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Options list (clickable) */}
            <ul className="p-2 text-sm">
              {NAV.filter((n) => !(onBlog && n.id === "blog")).map((o) => (
                <li key={o.id}>
                  <button
                    className="w-full text-left rounded-lg px-2 py-2 hover:bg-zinc-800"
                    onClick={() => {
                      window.location.href =
                        o.id === "blog" ? "/blog" : `/#${o.id}`
                      setCmdOpen(false)
                    }}
                  >
                    <span className="text-zinc-100">{o.label}</span>
                    <span className="ml-2 text-[10px] text-zinc-500">
                      {o.id === "blog" ? "/blog" : `/#${o.id}`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

/* ---------------------- Footer (shared) ---------------------- */
function Footer() {
  return (
    <footer className="border-t border-zinc-700 py-8 text-center text-zinc-400 text-sm">
      © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
      Mohanish Mankar. Built with curiosity and a love for learning. ❤️✨
    </footer>
  )
}

/* ---------------------- SiteChrome wrapper ---------------------- */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode
}) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const orbX = useTransform(mx, [-200, 200], [-10, 10])
  const orbY = useTransform(my, [-200, 200], [10, -10])

  return (
    <div
      className="relative min-h-screen bg-zinc-950 text-zinc-100"
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
        mx.set(e.clientX - (r.left + r.width / 2))
        my.set(e.clientY - (r.top + r.height / 2))
      }}
    >
      <ScrollProgress />
      <MouseSpotlight />
      <GridGlow />
      <AuroraSweep />

      {/* orbs */}
      <motion.div
        aria-hidden
        style={{ x: orbX, y: orbY }}
        className={`pointer-events-none fixed -top-24 -right-24 h-80 w-80 rounded-full blur-3xl bg-gradient-to-br ${ACCENT} opacity-25`}
      />
      <motion.div
        aria-hidden
        style={{
          x: useTransform(orbX, (v) => -v / 2),
          y: useTransform(orbY, (v) => v / 2),
        }}
        className={`pointer-events-none fixed bottom-0 -left-24 h-96 w-96 rounded-full blur-3xl bg-gradient-to-tr ${ACCENT} opacity-15`}
      />

      <SiteNavbar />

      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

      <Footer />
    </div>
  )
}
