import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

const BodySchema = z.object({
  email: z.string().email().max(320),
  message: z.string().min(2).max(5000),
  honeypot: z.string().optional().default(""),
  human: z.boolean(),
  formStart: z.number().int().optional(), // client sends Date.now()
})

function getIP(req: Request) {
  // Useful for logs; real rate limiting should use a store.
  const fwd = req.headers.get("x-forwarded-for")
  return fwd?.split(",")[0]?.trim() || "unknown"
}

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}))
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      )
    }
    const { email, message, honeypot, human, formStart } = parsed.data

    // Spam guards (mirror your client)
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 }) // silently succeed
    }
    if (!human) {
      return NextResponse.json(
        { ok: false, error: "Please confirm you’re human." },
        { status: 400 }
      )
    }
    if (formStart && Date.now() - formStart < 1200) {
      // too fast; likely bot
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    // Construct email
    const to = process.env.CONTACT_TO
    const from = process.env.CONTACT_FROM
    if (!to || !from || !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Email service not configured" },
        { status: 500 }
      )
    }

    const ip = getIP(req)
    const subject = `mohanish.dev contact from ${email}`
    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
        <h2>Website contact</h2>
        <p><strong>From:</strong> ${escapeHtml(email)}</p>
        <pre style="white-space: pre-wrap; font: inherit; background:#f6f6f6; padding:12px; border-radius:8px;">${escapeHtml(
          message
        )}</pre>
        <hr />
        <small>IP: ${escapeHtml(ip)} • ${new Date().toISOString()}</small>
      </div>
    `

    const { error } = await resend.emails.send({
      to,
      from,
      subject,
      replyTo: email, // so you can just hit Reply
      html,
      headers: {
        "X-Website": "mohanish.com",
      },
    })

    if (error) {
      console.log(process.env.RESEND_API_KEY)
      console.error("Resend error:", error)
      return NextResponse.json(
        { ok: false, error: "Email provider error" },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    )
  }
}

// Tiny HTML escaper to keep your email safe
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
