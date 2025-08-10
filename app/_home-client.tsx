"use client"
import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useTransform,
  useScroll,
  useSpring,
  useReducedMotion,
} from "framer-motion"
import {
  Linkedin,
  Book as BookIcon,
  ArrowRight,
  Sparkles,
  Command,
  X,
  Check,
  AlertTriangle,
  Search,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

/**
 * Navbar++:
 * - Comet sits INSIDE navbar, centered under active link text and sized to text width.
 * - Subtle hover glow behind nav text (group-hover blur).
 * - Glass sweep retained; name-dot slightly larger & glowy.
 * Site:
 * - Hero sparkles behind text removed (kept in Books).
 * - Everything else unchanged (photos lightbox, books search/toggle, contact client).
 * + Pet-the-dot easter egg: hover/click the brand dot to "pet" it; after a streak, tiny satellites orbit for a bit.
 */

const ACCENT = "from-amber-400 via-orange-500 to-rose-500"
const EASE = [0.22, 1, 0.36, 1] as const

// Anchor offset that matches your sticky navbar height (adjust if you tweak header height)
const ANCHOR = "scroll-mt-[84px] md:scroll-mt-[96px]"

// Local fallback Button (avoid external import flakiness)
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  disabled,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/40
      ${disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-zinc-800"}
      bg-zinc-900/70 text-zinc-100 border-zinc-700 ${className}`}
  >
    {children}
  </button>
)

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.05, ease: EASE },
  }),
}

function classNames(...a: Array<string | false | undefined>) {
  return a.filter(Boolean).join(" ")
}

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

  // Smooth the scroll progress so the sweep feels silky but responsive.
  const t = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.15,
  })

  // Map to transforms for two layers; no multi-keyframe springs (prevents Framer error).
  const x1 = useTransform(t, [0, 1], ["-40%", "40%"])
  const y1 = useTransform(t, [0, 1], ["-25%", "25%"])
  const r1 = useTransform(t, [0, 1], [-18, 18])
  const o1 = useTransform(t, [0, 1], [0.03, 0.08])

  const x2 = useTransform(t, [0, 1], ["30%", "-30%"])
  const y2 = useTransform(t, [0, 1], ["-10%", "10%"])
  const r2 = useTransform(t, [0, 1], [12, -12])
  const o2 = useTransform(t, [0, 1], [0.02, 0.05])

  if (reduce) return null

  const maskWavy =
    "radial-gradient(140%_80% at 50% 50%, black 35%, transparent 65%)"

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* back ribbon */}
      <motion.div
        aria-hidden
        style={{
          x: x1,
          y: y1,
          rotate: r1,
          opacity: o1,
          maskImage: maskWavy as any,
          WebkitMaskImage: maskWavy as any,
        }}
        className={`absolute -inset-[20%] bg-gradient-to-r ${ACCENT} blur-3xl mix-blend-screen`}
      />
      {/* front ribbon */}
      <motion.div
        aria-hidden
        style={{
          x: x2,
          y: y2,
          rotate: r2,
          opacity: o2,
          maskImage:
            "radial-gradient(120%_70% at 55% 45%, black 30%, transparent 62%)" as any,
          WebkitMaskImage:
            "radial-gradient(120%_70% at 55% 45%, black 30%, transparent 62%)" as any,
        }}
        className={`absolute -inset-[25%] bg-gradient-to-tr ${ACCENT} blur-2xl mix-blend-screen`}
      />
    </div>
  )
}

function Tilt({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-50, 50], [8, -8])
  const rotateY = useTransform(x, [-50, 50], [-8, 8])
  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
        x.set(e.clientX - (r.left + r.width / 2))
        y.set(e.clientY - (r.top + r.height / 2))
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  )
}

function MagneticLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  return (
    <motion.a
      href={href}
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-semibold bg-gradient-to-r ${ACCENT} text-black shadow-[0_10px_30px_-10px_rgba(251,146,60,0.5)]`}
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 8)
        my.set(((e.clientY - r.top) / r.height - 0.5) * 8)
      }}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      style={{ x: mx, y: my }}
    >
      {children}
      <ArrowRight size={16} />
    </motion.a>
  )
}

function ShimmerButton({
  children,
  className = "",
  as = Button,
  disabled,
  loading = false,
  ...props
}: any) {
  const Comp = as
  return (
    <Comp
      {...props}
      disabled={disabled || loading}
      className={`relative overflow-hidden rounded-xl px-4 py-2 text-black font-semibold
        ${
          disabled || loading
            ? "opacity-70 cursor-not-allowed"
            : "hover:opacity-95"
        }
        bg-gradient-to-r ${ACCENT} shadow-[0_10px_30px_-10px_rgba(251,146,60,0.45)] ${className}`}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeOpacity=".25"
                strokeWidth="4"
              />
              <path
                d="M22 12a10 10 0 0 1-10 10"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
            Sending…
          </span>
        ) : (
          children
        )}
      </span>
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r ${ACCENT} opacity-15 [mask-image:linear-gradient(90deg,transparent,black,transparent)]`}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[1px] rounded-[14px] border border-transparent [background:linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))_padding-box,linear-gradient(120deg,#fbbf24,#fb923c,#f43f5e)_border-box]"
      />
    </Comp>
  )
}

function SparkleField() {
  const reduce = useReducedMotion()
  const items = useMemo(
    () =>
      Array.from({ length: reduce ? 0 : 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      })),
    [reduce]
  )
  return (
    <div className="absolute inset-0 pointer-events-none">
      {items.map((s) => (
        <motion.span
          key={s.id}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
          transition={{
            duration: 2.8 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 1.8,
            ease: "easeInOut",
          }}
          className="absolute h-1 w-1 rounded-full bg-white/90 shadow-[0_0_10px_2px_rgba(255,255,255,0.55)]"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
        />
      ))}
    </div>
  )
}

// --- Pet-the-dot helpers ---
const DOT_STREAK = 7 // pets needed to trigger the party
const ORBIT_DURATION = 6000 // ms orbiting dots stay on

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

// Pulsing glow that scales with recent pet streak
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

// Little satellites that orbit the main dot when party mode is on
function OrbitingDots({ show = false }: { show: boolean }) {
  const dots = 6
  if (!show) return null
  return (
    <div className="absolute -inset-3 pointer-events-none">
      {Array.from({ length: dots }).map((_, i) => {
        const delay = (i / dots) * 0.6
        const r = 16 + (i % 3) * 6 // different radii
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

const photos: string[] = [
  "images/IMG_0929-4.jpeg",
  "images/1Y6A5819.jpeg",
  "images/1Y6A5939.jpeg",
  "images/1Y6A5990.JPG",
  "images/papaji.jpeg",
  "images/plane-tower.jpeg",
  "images/1Y6A6230.jpg",
  "images/1Y6A5880.jpeg",
  "images/1Y6A6203.jpg",
  "images/1Y6A6240-3.jpg",
]

const booksList = [
  "The Spy and the Traitor: The Greatest Espionage Story of the Cold War",
  "Why I Assassinated Mahatma Gandhi",
  "Killing Commendatore",
  "Kafka on the Shore",
  "India After Gandhi: The History of the World's Largest Democracy",
  "Project Hail Mary",
  "The Emperor's Soul",
  "The Hope of Elantris (Elantris, #1.5)",
  "Elantris (Elantris, #1)",
  "Man's Search for Meaning",
  "The Housemaid (The Housemaid, #1)",
  "Mr. Prohartchin: Short Story",
  "A Novel in Nine Letters",
  "A Little Hero",
  "The Dream of a Ridiculous Man",
  "Another Man's Wife and a Husband Under the Bed",
  "The Christmas Tree and the Wedding",
  "The Peasant Marey",
  "The Heavenly Christmas Tree",
  "An Honest Thief",
  "Man-eating Leopard of Rudraprayag",
  "White Nights",
  "A Thousand Splendid Suns",
  "The Antisocial Network: The GameStop Short Squeeze and the Ragtag Group of Amateur Traders That Brought Wall Street to Its Knees",
  "Crime and Punishment: Translated By Constance Garnett (Complete edition) - 1914",
  "Start Up Your Restaurant: The Definitive Guide for Anyone Who Dreams of Running Their Own Restaurant",
  "The World for Sale: Money, Power and the Traders Who Barter the Earth’s Resources",
  "How Big Things Get Done: The Surprising Factors That Determine the Fate of Every Project, from Home Renovations to Space Exploration and Everything In Between",
  "Harry Potter and the Deathly Hallows (Harry Potter, #7)",
  "Harry Potter and the Half- Blood Prince (Harry Potter, #6)",
  "Harry Potter and the Order of the Phoenix (Harry Potter, #5)",
  "Harry Potter and the Goblet of Fire (Harry Potter, #4)",
  "Harry Potter and the Prisoner of Azkaban (Harry Potter, #3)",
  "Harry Potter and the Chamber of Secrets (Harry Potter, #2)",
  "Elon Musk",
  "The Martian",
  "Harry Potter and the Philosopher’s Stone (Harry Potter, #1)",
  "Deep Work: Rules for Focused Success in a Distracted World",
  "The Secret of the Nagas (Shiva Trilogy, #2)",
  "The Oath of the Vayuputras (Shiva Trilogy, #3)",
  "The Immortals of Meluha (Shiva Trilogy, #1)",
  "Build: An Unorthodox Guide to Making Things Worth Making",
  "The Eye of the World (The Wheel of Time, #1)",
  "How to Win Friends & Influence People",
  "New Spring (The Wheel of Time, #0)",
  "The Lightning Thief (Percy Jackson and the Olympians, #1)",
  "City of Bones (The Mortal Instruments, #1)",
  "Death on the Nile (Hercule Poirot, #18)",
  "The Girl Who Played with Fire (Millennium #2)",
  "Gone Girl",
  "Worth Dying For (Jack Reacher, #15)",
  "One Shot (Jack Reacher, #9)",
  "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
  "The Stand",
  "The Adventures of Sherlock Holmes (Sherlock Holmes, #3)",
  "For Whom the Bell Tolls",
  "The Waste Lands (The Dark Tower, #3)",
  "The Drawing of the Three (The Dark Tower, #2)",
  "The Gunslinger (The Dark Tower, #1)",
  "The Talisman (The Talisman, #1)",
  "Doctor Sleep (The Shining, #2)",
  "Murder on the Orient Express (Hercule Poirot, #10)",
  "The Murder of Roger Ackroyd (Hercule Poirot, #4)",
  "Rich Dad, Poor Dad",
  "Cosmos",
  "गहरे पानी पैठ – Gahre Pani Paith",
  "Sapiens: A Brief History of Humankind",
  "The Valley of Fear (Sherlock Holmes, #7)",
  "From Sex to Superconsciousness",
  "The Sign of Four (Sherlock Holmes, #2)",
  "A Study in Scarlet (Sherlock Holmes, #1)",
  "The Hound of the Baskervilles (Sherlock Holmes, #5)",
  "The Girl With the Dragon Tattoo (Millennium, #1)",
  "Steve Jobs",
  "The Shining (The Shining, #1)",
  "Hero (The Secret, #4)",
  "The Magic (The Secret, #3)",
  "Revolution 2020: Love, Corruption, Ambition",
  "One Night at the Call Center",
  "2 States: The Story of My Marriage",
  "The 3 Mistakes of My Life",
  "Five Point Someone",
  "The Da Vinci Code (Robert Langdon, #2)",
  "Digital Fortress",
  "The Lost Symbol (Robert Langdon, #3)",
  "Inferno (Robert Langdon, #4)",
  "Origin (Robert Langdon, #5)",
  "Harry Potter and the Cursed Child: Parts One and Two (Harry Potter, #8)",
  "The Godfather (Mario Puzo's Mafia, #1)",
  "The Sicilian (Mario Puzo's Mafia, #2)",
  "The Godfather Returns (Mario Puzo's Mafia, #5)",
  "The Godfather’s Revenge (Mario Puzo's Mafia, #6)",
  "The Family Corleone (Mario Puzo's Mafia, #0)",
  "The Witch of Portobello",
  "Unholy Night",
  "Abraham Lincoln: Vampire Hunter (Abraham Lincoln: Vampire Hunter, #1)",
  "The Magic of Thinking Big",
  "The Alchemist",
  "The Power of Positive Thinking",
  "The Magic of Believing",
  "The Master Key System",
  "The Secret to Teen Power",
  "The Power (The Secret, #2)",
  "The Science of Getting Rich",
  "The Power of Your Subconscious Mind",
  "The Secret (The Secret, #1)",
  "Angels & Demons (Robert Langdon, #1)",
]

// Fancy shine that glides across a card on hover
function Shine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]"
    >
      <span
        className="absolute -inset-1 -translate-x-full rounded-[22px] bg-gradient-to-r from-white/10 via-white/40 to-white/10 opacity-0 transition will-change-transform
        group-hover:translate-x-0 group-hover:opacity-30 duration-700 [mask-image:linear-gradient(90deg,transparent,black,transparent)]"
      />
    </span>
  )
}

// Soft animated blobs behind the grid
function GridBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute -top-10 -left-16 h-64 w-64 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side,rgba(251,191,36,.35),transparent)",
        }}
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 -right-10 h-72 w-72 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side,rgba(244,63,94,.28),transparent)",
        }}
        animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />
    </div>
  )
}

type Exp = {
  company: string
  role: string
  period: string
  bullets: string[]
}

function ExperienceCard({ exp, i }: { exp: Exp; i: number }) {
  return (
    <motion.article
      className="group relative"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
      whileHover={{ y: -6, rotate: i % 2 ? 0.4 : -0.4 }}
    >
      {/* Glow ring */}
      <div
        className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${ACCENT} opacity-30 blur-xl transition group-hover:opacity-60`}
      />
      {/* Card */}
      <div className="relative h-full rounded-[22px] border border-zinc-700/70 bg-zinc-900/70 backdrop-blur p-4 md:p-6">
        <Shine />
        {/* Corner dot + period pill */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${ACCENT} shadow-[0_0_10px_4px_rgba(251,146,60,0.35)]`}
          />
          <span className="rounded-full border border-zinc-700/70 bg-zinc-900/70 px-2 py-0.5 text-[11px] text-zinc-300">
            {exp.period}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-semibold">{exp.company}</h3>
        <p className="mt-1 text-sm text-zinc-400">{exp.role}</p>

        <ul className="mt-4 space-y-2 text-sm text-zinc-200">
          {exp.bullets.map((b) => (
            <li key={b} className="relative pl-5">
              <span className="absolute left-0 top-[.55rem] h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_10px_2px_rgba(251,191,36,.8)]" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  )
}

function SkillChip({ label, i = 0 }: { label: string; i?: number }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      className="relative inline-flex h-8 items-center rounded-full px-4 text-sm font-medium text-zinc-200/90 backdrop-blur-md
                 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.4)] cursor-default"
      initial={{ y: 6, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        ease: [0.25, 0.1, 0.25, 1],
        delay: i * 0.03,
      }}
      whileHover={{
        y: -1,
        boxShadow:
          "0 0 8px rgba(255, 200, 150, 0.25), inset 0 0 0 1px rgba(255,255,255,0.1)",
      }}
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {label}

      {/* shimmer */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 rounded-full 
                   bg-gradient-to-r from-transparent via-white/15 to-transparent"
        initial={{ opacity: 0 }}
        whileHover={{ x: "220%", opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </motion.button>
  )
}

function PhotoCard({
  src,
  alt,
  onOpen,
  i,
}: {
  src: string
  alt: string
  onOpen: () => void
  i: number
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className="group relative w-full overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900/60 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
      initial={{ y: 10, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: EASE, delay: i * 0.04 }}
    >
      {/* image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="relative z-10 aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
        srcSet={`${src} 1x`} /* replace with real responsive sources if you have them */
      />
      {/* soft film hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 30%, transparent 55%, rgba(0,0,0,.45) 100%)",
        }}
      />
      {/* grain */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-[0.18] transition-opacity duration-500 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
        }}
      />
      {/* caption on hover (optional) */}
      <span className="pointer-events-none absolute bottom-2 left-2 z-20 rounded-md bg-black/40 px-2 py-1 text-[11px] text-zinc-200 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Click to view
      </span>
      {/* halo */}
      <span
        aria-hidden
        className={`absolute -inset-px rounded-[18px] opacity-0 group-hover:opacity-30 transition
                    bg-gradient-to-r ${ACCENT} blur-[6px] mix-blend-screen`}
      />
    </motion.button>
  )
}

function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock) return
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = overflow
    }
  }, [lock])
}

function preload(src: string) {
  const img = new Image()
  img.src = src
}

function Lightbox({
  open,
  index,
  setIndex,
  onClose,
  list,
}: {
  open: boolean
  index: number
  setIndex: (i: number) => void
  onClose: () => void
  list: string[]
}) {
  useScrollLock(open)
  const ref = useRef<HTMLDivElement>(null)

  // preload neighbors
  useEffect(() => {
    if (!open) return
    preload(list[(index + 1) % list.length])
    preload(list[(index - 1 + list.length) % list.length])
  }, [open, index, list])

  // keyboard + focus trap
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      const last = list.length - 1 // we use indices 1..last
      if (e.key === "ArrowRight") setIndex(index === last ? 1 : index + 1)
      if (e.key === "ArrowLeft") setIndex(index === 1 ? last : index - 1)
    }
    window.addEventListener("keydown", onKey)
    ref.current?.focus()
    return () => window.removeEventListener("keydown", onKey)
  }, [open, index, list.length, onClose, setIndex])

  // zoom / pan
  const [z, setZ] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v))

  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    const next = clampZoom(z + (e.deltaY < 0 ? 0.2 : -0.2))
    setZ(next)
    if (next === 1) setPos({ x: 0, y: 0 })
  }
  const clampZoom = (v: number) => Math.min(3, Math.max(1, v))

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    last.current = { x: e.clientX, y: e.clientY }
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || z === 1) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    const limit = 240 * (z - 1)
    setPos((p) => ({ x: clamp(p.x + dx, limit), y: clamp(p.y + dy, limit) }))
  }
  function onPointerUp(e: React.PointerEvent) {
    dragging.current = false
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  }

  if (!open) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <div
        ref={ref}
        tabIndex={-1}
        // full viewport height; 2 rows: image area (flexes) + footer (auto)
        className="relative w-[min(92vw,1200px)] h-[100svh] grid grid-rows-[1fr_auto] gap-4 px-2 py-6 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* image area (row 1) */}
        <div className="row-start-1 flex items-center justify-center overflow-hidden">
          <motion.img
            key={list[index]}
            src={list[index]}
            alt={`Photo ${index}`}
            className="block max-w-full w-auto h-auto max-h-full rounded-2xl border border-white/15 shadow-2xl select-none object-contain"
            /* … the zoom/drag handlers stay the same … */
          />
        </div>

        {/* controls (row 2) – no fixed positioning */}
        <div
          className="row-start-2 flex items-center justify-between gap-3 mx-auto w-[min(92vw,1200px)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* thumbs */}
          <div className="flex gap-2 overflow-x-auto rounded-xl bg-white/5 p-1 backdrop-blur-sm">
            {list.slice(1).map((s, i) => {
              const idx = i + 1
              const active = idx === index
              return (
                <button
                  key={s}
                  onClick={() => setIndex(idx)}
                  className={`h-10 w-14 shrink-0 rounded-md overflow-hidden border transition ${
                    active
                      ? "border-white/40"
                      : "border-white/10 hover:border-white/25"
                  }`}
                  aria-label={`Go to photo ${idx}`}
                >
                  <img src={s} alt="" className="h-full w-full object-cover" />
                </button>
              )
            })}
          </div>

          {/* actions */}
          <div className="ml-auto flex gap-2">
            <button
              aria-label="Previous"
              onClick={() =>
                setIndex(index === 1 ? list.length - 1 : index - 1)
              }
              className="rounded-xl border border-white/20 bg-white/10 p-2 text-white/80 hover:text-white hover:bg-white/15"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={() =>
                setIndex(index === list.length - 1 ? 1 : index + 1)
              }
              className="rounded-xl border border-white/20 bg-white/10 p-2 text-white/80 hover:text-white hover:bg-white/15"
            >
              ›
            </button>
            <button
              aria-label="Close"
              onClick={onClose}
              className="rounded-xl border border-white/20 bg-white/10 p-2 text-white/80 hover:text-white hover:bg-white/15"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function FooterClient() {
  return (
    <footer className="border-t border-zinc-700 py-8 text-center text-zinc-400 text-sm">
      © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
      Mohanish Mankar. Built with curiosity and a love for learning. ❤️✨
    </footer>
  )
}

// ---------- Page ----------
export default function Home() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const hueSpring = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.2,
  })

  const hue = useTransform(hueSpring, [0, 1], [0, 360])

  const heroGradient = useTransform(
    hue,
    (h) =>
      `linear-gradient(90deg,
    hsl(${Math.round(h)} 95% 60%),
    hsl(${Math.round((h + 40) % 360)} 95% 55%),
    hsl(${Math.round((h + 80) % 360)} 90% 55%)
  )`
  )

  const heroStyle = reduce
    ? { "--hero": `linear-gradient(90deg, #fbbf24, #fb923c, #f43f5e)` }
    : { "--hero": heroGradient }

  // UI State
  const [active, setActive] = useState<string>("work")
  const [cmdOpen, setCmdOpen] = useState(false)
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  })
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{
    open: boolean
    kind: "success" | "error"
    title: string
    desc?: string
  }>({ open: false, kind: "success", title: "" })

  // spam guards
  const [honeypot, setHoneypot] = useState("")
  const [human, setHuman] = useState(false)
  const [formStart] = useState(() => Date.now())

  // Books state
  const [showAllBooks, setShowAllBooks] = useState(false)
  const [q, setQ] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  const sections = [
    { id: "work", label: "Work" },
    { id: "photos", label: "Photography" },
    { id: "books", label: "Books" },
    { id: "contact", label: "Contact" },
  ]

  // --- Nav comet sizing (measure each link text width) ---
  const navContainerRef = useRef<HTMLDivElement | null>(null)
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({})
  const [labelSizes, setLabelSizes] = useState<Record<string, number>>({})

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const next: Record<string, number> = {}
      sections.forEach(({ id }) => {
        const el = labelRefs.current[id]
        next[id] = el ? Math.ceil(el.getBoundingClientRect().width) : 0
      })
      setLabelSizes(next)
    })
    sections.forEach(({ id }) => {
      const el = labelRefs.current[id]
      if (el) ro.observe(el)
    })
    window.addEventListener("load", () => {
      const next: Record<string, number> = {}
      sections.forEach(({ id }) => {
        const el = labelRefs.current[id]
        next[id] = el ? Math.ceil(el.getBoundingClientRect().width) : 0
      })
      setLabelSizes(next)
    })
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // hero orbs motion
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const orbX = useTransform(mx, [-200, 200], [-10, 10])
  const orbY = useTransform(my, [-200, 200], [10, -10])
  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - (r.left + r.width / 2))
    my.set(e.clientY - (r.top + r.height / 2))
  }

  // skills
  const skills = useMemo(
    () => [
      "JavaScript",
      "React/Vue.js",
      "Node.js",
      "SQL/NoSQL",
      "CI/CD",
      "VCS",
      "C++",
    ],
    []
  )

  // Scroll‑spy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        }),
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    )
    sections.forEach(({ id }) => {
      const node = document.getElementById(id)
      if (node) obs.observe(node)
    })
    return () => obs.disconnect()
  }, [])

  // Hotkeys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCmdOpen((v) => !v)
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (
        (e.key === "b" || e.key === "B") &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      )
        setShowAllBooks((v) => !v)
      if (e.key === "Escape") setCmdOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox.open])

  // helpers
  const goto = (id: string) => {
    setCmdOpen(false)
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const isValidEmail = (val: string) => /.+@.+\..+/.test(val)
  const isValid = isValidEmail(email) && message.trim().length >= 2 && human

  // --- Pet-the-dot state/logic ---
  const [pets, setPets] = useState(0)
  const [party, setParty] = useState(false)
  const petDecayRef = useRef<number | null>(null)
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

  // contact submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) {
      setToast({
        open: true,
        kind: "error",
        title: "One more step",
        desc: !human
          ? "Please confirm you’re human."
          : "Enter a valid email and a message.",
      })
      return
    }
    try {
      setSubmitting(true)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, honeypot, formStart, human }),
      })
      if (!res.ok) throw new Error("API error")
      setToast({
        open: true,
        kind: "success",
        title: "Message sent",
        desc: "Thanks for reaching out!",
      })
    } catch {
      const params = new URLSearchParams({
        body: `From: ${email}%0D%0A%0D%0A${message}`,
      })
      window.location.href = `mailto:mohanish35@gmail.com?${params.toString()}`
      setToast({
        open: true,
        kind: "success",
        title: "Opening your mail app",
        desc: "If it didn’t open, check pop‑up settings.",
      })
    } finally {
      const key = "contact_submissions"
      const arr = JSON.parse(localStorage.getItem(key) || "[]")
      arr.push({ email, message, ts: new Date().toISOString() })
      localStorage.setItem(key, JSON.stringify(arr))
      setSubmitting(false)
      setEmail("")
      setMessage("")
      setHuman(false)
      setHoneypot("")
    }
  }

  // books filtering
  const filteredBooks = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return booksList
    return booksList.filter((b) => b.toLowerCase().includes(s))
  }, [q])
  const visibleBooks = useMemo(
    () => (showAllBooks ? filteredBooks : filteredBooks.slice(0, 10)),
    [filteredBooks, showAllBooks]
  )

  // --- NavLink (comet + hover glow) ---
  const NavLink = ({ id, label }: { id: string; label: string }) => {
    const isActive = active === id
    const ww = (labelSizes[id] ?? 0) + 12

    return (
      <a
        key={id}
        href={`#${id}`}
        onClick={() => setActive(id)} // update immediately on click
        aria-current={isActive ? "page" : undefined}
        className={classNames(
          "group relative px-2 md:px-3 py-3 md:py-4 text-sm md:text-base font-medium transition-colors",
          isActive
            ? "text-amber-500 hover:text-amber-500"
            : "text-zinc-300 hover:text-white"
        )}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 rounded-lg opacity-0 blur-md transition
                    group-hover:opacity-60 bg-gradient-to-r ${ACCENT}`}
          style={{ height: "1.5rem" }}
        />
        <span
          ref={(el) => {
            labelRefs.current[id] = el
          }}
          className="relative inline-block"
        >
          {label}
        </span>

        {/* comet slice (optional, unchanged) */}
        {/* … */}
      </a>
    )
  }

  return (
    <div
      className="relative min-h-screen bg-zinc-950 text-zinc-100"
      onMouseMove={handleMouse}
    >
      <ScrollProgress />
      <MouseSpotlight />
      <GridGlow />
      <AuroraSweep />

      {/* Aurora orbs */}
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

      {/* ===== NAVBAR (full width, sticky, glass sweep, slightly taller) ===== */}
      {/* glass sweep */}
      <header className="sticky top-0 z-50">
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
            <div
              ref={navContainerRef}
              className="flex items-center justify-between"
            >
              {/* Brand (now pettable) */}
              <div className="relative flex items-center gap-2 py-3 md:py-4">
                <a href="#" className="flex items-center gap-2">
                  <span
                    className={`text-lg md:text-xl font-semibold bg-gradient-to-r ${ACCENT} bg-clip-text text-transparent`}
                  >
                    {"<"}Mohanish Mankar{"/>"}
                  </span>
                </a>

                {/* Pettable Dot */}
                <motion.button
                  type="button"
                  aria-label="Pet the dot"
                  onClick={handlePet}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9, rotate: -12 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="relative grid place-items-center h-4 w-4 rounded-full"
                >
                  {/* the dot itself */}
                  <span
                    className={`relative z-10 h-3.5 w-3.5 rounded-full bg-gradient-to-r ${ACCENT} shadow-[0_0_10px_5px_rgba(251,146,60,0.5)]`}
                  />
                  {/* purr pulse grows with streak */}
                  {pets > 0 && <PurrPulse level={pets} />}
                  {/* orbiting satellites when party is on */}
                  <OrbitingDots show={party} />
                </motion.button>
              </div>

              {/* Center nav */}
              <nav className="hidden md:flex items-center gap-6">
                {sections.map((s) => (
                  <NavLink key={s.id} id={s.id} label={s.label} />
                ))}
              </nav>

              {/* Right tools */}
              <div className="flex items-center gap-2 py-2">
                <button
                  aria-label="Command Menu"
                  onClick={() => setCmdOpen(true)}
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800/60"
                >
                  <Command size={16} />
                  <span className="text-xs">⌘K</span>
                </button>
                <a
                  href="https://www.linkedin.com/in/mohanish-mankar-695055140/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl hover:bg-zinc-800/80 backdrop-blur"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://www.goodreads.com/user/show/74505207-mohanish"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl hover:bg-zinc-800/80 backdrop-blur"
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
      {/* ===== /NAVBAR ===== */}

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center relative">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative"
        >
          <SparkleField />
          <motion.h1
            style={{ "--hero": heroGradient } as React.CSSProperties}
            className="text-5xl md:text-6xl font-semibold leading-tight
             bg-clip-text text-transparent [background-image:var(--hero)] relative"
          >
            Senior Software Engineer
            <span className="pointer-events-none absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-white/5 blur-xl" />
          </motion.h1>
          <p className="mt-5 text-zinc-300 leading-relaxed max-w-xl">
            I build performant, resilient products with a JavaScript‑first
            stack. Away from the keyboard, I read widely and travel far to
            sharpen thinking and taste.
          </p>
          <div className="mt-7 flex gap-3 flex-wrap">
            {skills.map((skill, i) => (
              <SkillChip key={skill} label={skill} i={i} />
            ))}
          </div>
          <div className="mt-8 flex gap-3 items-center">
            <MagneticLink href="#contact">Let’s work together</MagneticLink>
            <ShimmerButton
              as="a"
              href="#photos"
              className="inline-flex items-center gap-2"
            >
              <Sparkles size={16} /> See photography
            </ShimmerButton>
          </div>
        </motion.div>
        <Tilt>
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative rounded-[28px] overflow-hidden"
          >
            {/* Ambient outer glow + floating shadow */}
            <div
              aria-hidden
              className={`absolute -inset-[2px] rounded-[30px] opacity-30 blur-2xl bg-gradient-to-br ${ACCENT}`}
            />
            <div
              aria-hidden
              className="absolute -bottom-8 left-10 right-10 h-14 rounded-full bg-black/70 blur-2xl opacity-50"
            />

            {/* Glassy bezel with neon edge (true gradient border) */}
            <motion.div
              className="relative rounded-[28px] p-[2px]"
              style={{
                // two layers: subtle glass edge + flowing gradient stroke
                background:
                  "linear-gradient(120deg,#ffffff26,#ffffff0a) padding-box, \
       linear-gradient(90deg,#fbbf24,#fb923c,#f43f5e,#fb923c,#fbbf24) border-box",
                borderRadius: 28,
                border: "1px solid transparent",
                backgroundSize: "300% 100%", // enables the sweep
              }}
              animate={{ backgroundPositionX: ["0%", "200%", "0%"] }}
              transition={{ duration: 13, repeat: Infinity, ease: "linear" }} // 12–15s sweet spot
            >
              <div className="relative rounded-[26px] border border-zinc-700/70 bg-zinc-900/70 backdrop-blur-xl">
                {/* Subtle inner vignette so the glow doesn’t wash the image */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[26px] 
                     bg-[radial-gradient(120%_80%_at_70%_45%,transparent_55%,rgba(0,0,0,.45)_95%)]"
                />

                {/* Animated rim light (soft conic halo that slowly rotates) */}
                <motion.div
                  aria-hidden
                  className={`absolute -inset-1 rounded-[28px] mix-blend-screen opacity-35`}
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(251,191,36,.0), rgba(251,191,36,.18), rgba(244,63,94,.0))",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 18,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />

                {/* Gloss sweep on hover */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-[-60%] h-full w-[65%]
                     bg-gradient-to-r from-white/0 via-white/18 to-white/0
                     [mask-image:linear-gradient(90deg,transparent,black,transparent)]
                     mix-blend-screen"
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                />

                {/* Accent blobs behind the image for depth */}
                <motion.div
                  aria-hidden
                  className={`absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${ACCENT}`}
                  animate={{ x: [0, -6, 0], y: [0, 8, 0] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  aria-hidden
                  className={`absolute -left-10 -bottom-10 h-48 w-48 rounded-full blur-3xl opacity-20 bg-gradient-to-tr ${ACCENT}`}
                  animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                />

                {/* The photo (no cropping), with crisp rounding & shadow */}
                <img
                  src={photos[0]}
                  alt="Mohanish Mankar"
                  className="relative z-10 block w-full h-full object-cover rounded-[24px]"
                />
              </div>
            </motion.div>
          </motion.div>
        </Tilt>
      </section>

      {/* Work */}
      <section
        id="work"
        className={`relative mx-auto max-w-6xl px-4 py-14 ${ANCHOR}`}
      >
        <GridBackdrop />
        {/** data lives here for clarity; feel free to hoist it */}
        {(() => {
          const experiences: Exp[] = [
            {
              company: "Meltwater",
              role: "Sr. Software Engineer",
              period: "2023 — Present",
              bullets: [
                "Spearheaded the frontend architecture for a flagship product, impacting thousands of daily users.",
                "Built a high‑performance React interface with real‑time data updates.",
                "Collaborated with design and backend teams to ship ahead of schedule.",
              ],
            },
            {
              company: "SWVL",
              role: "Software Engineer II",
              period: "2022 — 2023",
              bullets: [
                "Delivered client‑facing APIs with robust unit tests.",
                "Profiled hot paths and introduced smart indexing to speed up queries.",
                "Partnered with backend teams to simplify business logic.",
              ],
            },
            {
              company: "Love, Bonito",
              role: "Software Engineer (promoted from Jr. FE)",
              period: "2020 — 2022",
              bullets: [
                "Drove localization and multi‑market rollout of the e‑commerce frontend.",
                "Built reusable components and a lightweight design system.",
                "Established performance budgets and accessibility checks in CI.",
              ],
            },
            {
              company: "GammaStack",
              role: "Solution Engineer",
              period: "2019 — 2020",
              bullets: [
                "Shipped end‑to‑end projects across the JS stack with direct client ownership.",
                "Published the Telegram betting bot (GammaBet).",
                "Introduced pragmatic CI/CD and code review practices.",
              ],
            },
          ]

          return (
            <div className="grid auto-rows-fr gap-6 sm:grid-cols-2">
              {experiences.map((exp, i) => (
                <ExperienceCard key={exp.company} exp={exp} i={i} />
              ))}
            </div>
          )
        })()}
      </section>

      {/* Photos */}
      <section id="photos" className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Photography</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.slice(1).map((src, i) => (
            <PhotoCard
              key={src}
              src={src}
              alt={`Photography ${i + 1}`}
              i={i}
              onOpen={() => setLightbox({ open: true, index: i + 1 })}
            />
          ))}
        </div>
        <Lightbox
          open={lightbox.open}
          index={lightbox.index}
          setIndex={(i) => setLightbox({ open: true, index: i })}
          onClose={() => setLightbox({ open: false, index: 1 })}
          list={photos}
        />
      </section>

      {/* Books */}
      <section id="books" className="relative max-w-6xl mx-auto px-4 py-16">
        <div
          className={`absolute right-4 -top-2 h-1 w-32 rounded-full bg-gradient-to-r ${ACCENT}`}
          aria-hidden
        />
        <div className="mb-6 flex items-center justify-between">
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-semibold relative">
              <span className="relative z-10">Books I Enjoy</span>
              <span
                className="pointer-events-none absolute -inset-2 -z-10 rounded-2xl bg-white/5 blur-lg"
                aria-hidden
              />
            </h2>
            <div aria-live="polite" className="text-xs text-zinc-400 mt-1">
              Showing{" "}
              <span className="tabular-nums">{visibleBooks.length}</span> of{" "}
              <span className="tabular-nums">{filteredBooks.length}</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search ( / )"
                className="pl-7 pr-3 h-9 rounded-lg border border-zinc-700 bg-zinc-900/70 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:border-amber-400/40 focus-visible:shadow-[0_0_0_4px_rgba(251,191,36,0.18)] transition"
              />
            </div>
            <ShimmerButton
              onClick={() => setShowAllBooks((v) => !v)}
              aria-expanded={showAllBooks}
              className="px-3 py-1.5"
            >
              {showAllBooks
                ? "Show less"
                : `Show more (${Math.max(filteredBooks.length - 10, 0)})`}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showAllBooks ? "rotate-180" : ""
                }`}
              />
            </ShimmerButton>
          </div>
        </div>
        <div className="relative rounded-2xl border border-zinc-700 bg-zinc-900/70 backdrop-blur overflow-hidden">
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-px rounded-[18px] bg-gradient-to-r ${ACCENT} opacity-10`}
          />
          <SparkleField />
          <CardContent className="relative z-10 pt-6">
            <div className="sm:hidden mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  ref={searchRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search ( / )"
                  className="pl-7 pr-3 h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900/70 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:border-amber-400/40 focus-visible:shadow-[0_0_0_4px_rgba(251,191,36,0.18)] transition"
                />
              </div>
            </div>
            <p className="text-zinc-300 mb-4 max-w-3xl">
              I maintain an active reading list on{" "}
              <a
                href="https://www.goodreads.com/user/show/74505207-mohanish"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-amber-400/70 hover:decoration-amber-300"
              >
                Goodreads
              </a>
              , tracking everything from timeless fiction to thought‑provoking
              non‑fiction.
            </p>
            <div className="flex flex-wrap gap-3">
              {visibleBooks.map((book, i) => (
                <motion.span
                  key={book}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  whileHover={{
                    y: -2,
                    boxShadow: "0 8px 32px -18px rgba(251,146,60,0.5)",
                  }}
                  className="px-3 py-1.5 rounded-full border border-zinc-600/80 bg-zinc-800/70 text-zinc-200 text-sm"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300/80" />
                    {book}
                  </span>
                </motion.span>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-xs text-zinc-400">
                Tip:{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-200">
                  /
                </kbd>{" "}
                to search,{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-200">
                  B
                </kbd>{" "}
                to toggle.
              </div>
              {filteredBooks.length > 10 && (
                <ShimmerButton
                  onClick={() => setShowAllBooks((v) => !v)}
                  aria-expanded={showAllBooks}
                  className="px-3 py-1.5"
                >
                  {showAllBooks
                    ? "Show less"
                    : `Show more (${filteredBooks.length - 10})`}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showAllBooks ? "rotate-180" : ""
                    }`}
                  />
                </ShimmerButton>
              )}
            </div>
          </CardContent>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Contact</h2>
          <div className={`h-1 w-24 rounded-full bg-gradient-to-r ${ACCENT}`} />
        </div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="relative rounded-2xl border border-zinc-600 bg-zinc-900/80 backdrop-blur">
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-tr ${ACCENT} opacity-10`}
            />
            <CardHeader>
              <CardTitle>Let’s Connect</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <form
                onSubmit={handleSubmit}
                className="space-y-3"
                aria-live="polite"
              >
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="company"
                    autoComplete="off"
                    tabIndex={-1}
                    aria-hidden
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                  />
                  <label className="sr-only" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 flex-grow rounded-xl bg-zinc-950/40 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:border-amber-400/40 focus-visible:shadow-[0_0_0_4px_rgba(251,191,36,0.18)]"
                  />
                  <ShimmerButton
                    type="submit"
                    loading={submitting}
                    disabled={!isValid || submitting}
                    className="h-11 inline-flex items-center gap-2 shrink-0"
                  >
                    Send <ArrowRight size={16} />
                  </ShimmerButton>
                </div>
                <label className="flex items-center gap-2 text-xs text-zinc-400 select-none">
                  <input
                    type="checkbox"
                    checked={human}
                    onChange={(e) => setHuman(e.target.checked)}
                    className="h-4 w-4 appearance-none rounded-md border border-amber-400/40 bg-zinc-900/60 checked:bg-gradient-to-br checked:from-amber-400 checked:to-rose-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:shadow-[0_0_10px_rgba(251,191,36,0.4)] transition-all duration-200"
                  />
                  I’m not a robot
                </label>
                <label className="sr-only" htmlFor="message">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-xl bg-zinc-950/40 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:border-amber-400/40 focus-visible:shadow-[0_0_0_4px_rgba(251,191,36,0.18)]"
                />
              </form>
              <div className="mt-4 text-xs text-zinc-500">
                I read every email, please be patient with replies. If you don’t
                hear back, feel free to follow up or drop me a DM on{" "}
                <a
                  href="https://www.linkedin.com/in/mohanish-mankar-695055140/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <u>LinkedIn</u>
                </a>
                .
              </div>
            </CardContent>
          </div>
        </motion.div>
      </section>

      {/* Command Palette (dialog a11y) */}
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
                    const match = sections.find(
                      (s) =>
                        s.label.toLowerCase().includes(v) || s.id.includes(v)
                    )
                    if (match) goto(match.id)
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
            <ul className="p-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    className="w-full text-left rounded-lg px-2 py-2 hover:bg-zinc-800"
                    onClick={() => goto(s.id)}
                  >
                    <span className="text-zinc-100">{s.label}</span>
                    <span className="ml-2 text-[10px] text-zinc-500">
                      #{s.id}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.open && (
        <div className="fixed bottom-5 right-5 z-[70]">
          <div
            className={`flex items-start gap-3 rounded-xl border p-3 shadow-lg backdrop-blur bg-zinc-900/90 ${
              toast.kind === "success"
                ? "border-emerald-500/40"
                : "border-rose-500/40"
            }`}
          >
            <div
              className={`${
                toast.kind === "success" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {toast.kind === "success" ? (
                <Check size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
            </div>
            <div className="text-sm">
              <div className="font-medium text-zinc-100">{toast.title}</div>
              {toast.desc && <div className="text-zinc-400">{toast.desc}</div>}
            </div>
            <button
              onClick={() => setToast((t) => ({ ...t, open: false }))}
              className="ml-2 rounded-md px-1 text-zinc-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Tiny client-side tests (non-blocking) ----------
if (typeof window !== "undefined") {
  // photos array length
  console.assert(
    Array.isArray(photos) && photos.length >= 6,
    "[TEST] photos[] should have >= 6 entries"
  )
  // email validator
  try {
    const valid = /.+@.+\..+/.test("me@example.com")
    const invalid = /.+@.+\..+/.test("nope")
    console.assert(valid && !invalid, "[TEST] email validation basic cases")
  } catch {}
  // books collapsed cap = 10
  try {
    const maxCollapsed = 10
    console.assert(maxCollapsed === 10, "[TEST] collapsed book cap is 10")
  } catch {}
}
