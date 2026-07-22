import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// --- Per-IP rate limit (best-effort, in-memory per server instance) ---
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(t => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 10_000) hits.clear() // prevent unbounded growth
  return false
}

// --- Input hygiene ---
const LIMITS = { name: 100, phone: 30, email: 200, projectType: 60, budget: 60, message: 5000 } as const

/** Trim, cap length, and strip line breaks (single-line fields). */
function cleanLine(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[\r\n]+/g, ' ').trim().slice(0, max)
}

/** Trim and cap length, preserving line breaks (message body). */
function cleanText(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many messages sent. Please try again later, or call us directly.' },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: hidden field real users never fill. Pretend success for bots.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return NextResponse.json({ success: true })
  }

  const name        = cleanLine(body.name, LIMITS.name)
  const phone       = cleanLine(body.phone, LIMITS.phone)
  const email       = cleanLine(body.email, LIMITS.email)
  const projectType = cleanLine(body.projectType, LIMITS.projectType)
  const budget      = cleanLine(body.budget, LIMITS.budget)
  const message     = cleanText(body.message, LIMITS.message)

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required.' },
      { status: 400 }
    )
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // Lazy-initialize so missing key doesn't crash at module load / build time
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'not-configured')

  try {
    await resend.emails.send({
      from: 'Suvasthuk Website <noreply@suvasthuk.com>',
      to:   'suvasthuk@gmail.com',
      replyTo: email,
      subject: `New enquiry from ${name} — ${projectType || 'General'}`,
      html: `
        <h2>New website enquiry</h2>
        <table cellpadding="8">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone) || '—'}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><strong>Project type</strong></td><td>${escapeHtml(projectType) || '—'}</td></tr>
          <tr><td><strong>Budget</strong></td><td>${escapeHtml(budget) || '—'}</td></tr>
          <tr><td><strong>Message</strong></td><td>${escapeHtml(message).replace(/\n/g, '<br />')}</td></tr>
        </table>
      `,
    })

    // Confirmation copy to the enquirer — best-effort, never fails the request.
    try {
      await resend.emails.send({
        from: 'Suvasthuk Architects <noreply@suvasthuk.com>',
        to: email,
        replyTo: 'suvasthuk@gmail.com',
        subject: 'We’ve received your enquiry — Suvasthuk Architects',
        html: `
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thank you for reaching out to Suvasthuk Architects. We've received your message and
          will get back to you within one business day.</p>
          <p>For your records, here's what you sent us:</p>
          <table cellpadding="8">
            <tr><td><strong>Project type</strong></td><td>${escapeHtml(projectType) || '—'}</td></tr>
            <tr><td><strong>Budget</strong></td><td>${escapeHtml(budget) || '—'}</td></tr>
            <tr><td><strong>Message</strong></td><td>${escapeHtml(message).replace(/\n/g, '<br />')}</td></tr>
          </table>
          <p>If anything above doesn't look right, just reply to this email.</p>
          <p>— Suvasthuk Architects<br />080 – 41110467 · suvasthuk@gmail.com</p>
        `,
      })
    } catch (confirmErr) {
      console.error('Resend confirmation-email error:', confirmErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json(
      { error: 'Failed to send message. Please try calling us directly.' },
      { status: 500 }
    )
  }
}
