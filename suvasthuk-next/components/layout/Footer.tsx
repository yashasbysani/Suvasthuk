'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSiteMode } from '@/context/SiteModeContext'

export default function Footer() {
  const isConst = useSiteMode() === 'construction'
  const brandName = isConst ? 'Yashas Construction' : 'Suvasthuk Architects'

  return (
    <footer className="bg-charcoal pt-16 pb-8">
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand — spans 2 cols on md */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {isConst ? (
                <Image src="/images/Logo/yashas-logo.png" alt="Yashas Construction logo" width={180} height={61} className="h-8 w-auto" />
              ) : (
                <>
                  <Image src="/images/Logo/logo.jpg" alt="Suvasthuk Architects logo" width={28} height={28} className="rounded-sm object-cover" />
                  <span className="font-sans font-semibold text-[11px] tracking-[3px] uppercase text-sand">
                    {brandName}
                  </span>
                </>
              )}
            </div>
            <p className="font-sans text-[13px] leading-relaxed text-sand/30 max-w-xs">
              A collaborative design practice shaping the built landscape of Bangalore since 1993.
            </p>
            <div className="flex gap-5 mt-5">
              <a
                href="https://www.instagram.com/suvasthuk_architects/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[9px] tracking-[2px] uppercase text-sand/30 hover:text-gold transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Work links */}
          <nav aria-label="Footer navigation">
            <p className="font-sans text-[9px] tracking-[3px] uppercase text-sand/30 mb-5">Work</p>
            <ul className="space-y-3">
              {[
                { href: '/projects',  label: 'Projects'  },
                { href: '/services',  label: 'Services'  },
                { href: '/about',     label: 'About'     },
                { href: '/blog',      label: 'Blog'      },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="font-sans text-[13px] text-sand/50 hover:text-sand transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="font-sans text-[9px] tracking-[3px] uppercase text-sand/30 mb-5">Contact</p>
            <ul className="space-y-3">
              <li>
                <a href="mailto:suvasthuk@gmail.com" className="font-sans text-[13px] text-sand/50 hover:text-sand transition-colors">
                  suvasthuk@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919480444666" className="font-sans text-[13px] text-sand/50 hover:text-sand transition-colors">
                  +91 9480444666
                </a>
              </li>
              <li>
                <a
                  href="https://g.page/suvasthuk?share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[13px] text-sand/50 hover:text-sand transition-colors leading-relaxed block"
                >
                  Sahakar Nagar,<br />Bengaluru 560092
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sand/5 pt-6 flex flex-col md:flex-row justify-between gap-2">
          <p className="font-sans text-[10px] text-sand/20">
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="font-sans text-[10px] text-sand/20 hover:text-sand/50 transition-colors">
              Privacy Policy
            </Link>
            <p className="font-sans text-[10px] text-sand/20">Bengaluru, Karnataka, India</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
