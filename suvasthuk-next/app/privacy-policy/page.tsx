import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Suvasthuk Architects collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://suvasthuk.com/privacy-policy' },
  robots: { index: true, follow: true },
}

const UPDATED = '11 July 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl text-brown-deep mb-4">{title}</h2>
      <div className="font-sans text-[15px] text-brown-mid leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-12">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">Legal</p>
          <h1 className="font-serif text-4xl md:text-5xl text-brown-deep leading-tight mb-3">
            Privacy Policy
          </h1>
          <p className="font-sans text-[13px] text-brown-light">Last updated: {UPDATED}</p>
        </div>

        <Section title="Who we are">
          <p>
            Suvasthuk Architects is an architecture and construction practice based at
            F6 17/2, 1st Floor, Kodigehalli Main Rd, Sahakar Nagar, Bengaluru 560092,
            Karnataka, India. This policy explains what personal information we collect
            through this website (suvasthuk.com), why we collect it, and how we handle it.
          </p>
        </Section>

        <Section title="What we collect">
          <p>
            The only personal information this website collects is what you choose to send
            us through the <Link href="/contact" className="underline hover:text-brown-deep">contact form</Link>:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your phone number (optional)</li>
            <li>Project type and approximate budget (optional)</li>
            <li>Your message</li>
          </ul>
          <p>
            We do not require you to create an account, and we do not collect any personal
            information when you simply browse the site.
          </p>
        </Section>

        <Section title="How we use it">
          <p>
            We use the information you submit solely to respond to your enquiry and to
            correspond with you about your project. We do not sell, rent, or share your
            information with third parties for marketing.
          </p>
        </Section>

        <Section title="Who processes it">
          <p>
            When you submit the contact form, your message is delivered to our email inbox
            via <strong>Resend</strong>, an email delivery service. Resend may process the
            message on servers located outside India. Our website is served by our hosting
            provider, which (like most hosting providers) keeps standard server logs that
            can include IP addresses for security purposes.
          </p>
        </Section>

        <Section title="Cookies & analytics">
          <p>
            This website does not currently set cookies or run analytics or advertising
            trackers. If that changes, we will update this policy and, where required,
            ask for your consent.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Enquiry emails are retained as ordinary business correspondence for as long as
            reasonably needed to serve your project and meet legal or accounting
            obligations, after which they may be deleted.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Under India&apos;s Digital Personal Data Protection Act, 2023, you may request
            access to, correction of, or deletion of the personal information you have
            shared with us. To exercise these rights — or to ask any question about this
            policy — write to{' '}
            <a href="mailto:suvasthuk@gmail.com" className="underline hover:text-brown-deep">
              suvasthuk@gmail.com
            </a>{' '}
            or call{' '}
            <a href="tel:+919480444666" className="underline hover:text-brown-deep">
              +91 94804 44666
            </a>.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we change how we handle personal information, we will update this page and
            revise the &ldquo;last updated&rdquo; date above.
          </p>
        </Section>
      </div>
    </main>
  )
}
