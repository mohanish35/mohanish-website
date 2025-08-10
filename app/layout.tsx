// app/layout.tsx
import "./globals.css" // <- this is critical (Tailwind + your base CSS)
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mohanish Mankar",
  description: "Senior Software Engineer — portfolio & blog",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-zinc-950">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
