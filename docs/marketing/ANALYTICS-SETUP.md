# ANALYTICS-SETUP.md — Tracking, Hosting & KPI Dashboard
Last updated: 2026-07-19 · Written in plain terms — no assumed technical background

---

## 1. Hosting: deploy the new site first

**Current state (confirmed this session): the new Next.js build is not deployed anywhere.** suvasthuk.com's DNS points to GitHub Pages, serving an abandoned 2020 template. This is Week 1, item #0 in ROADMAP-90-DAY.md — everything else in this document assumes it's done.

### Why Vercel
The site is Next.js 14 App Router with server-side rendering (schema, sitemap, and metadata all render server-side). Vercel is built by the makers of Next.js and deploys this exact stack with zero configuration — free "Hobby" tier is enough to start, upgrading only if traffic grows significantly.

### Deployment steps (developer, ~1 hour)
1. Push the `suvasthuk-next` app to a GitHub repository (if not already).
2. Create a Vercel account, "Import Project," connect the repo.
3. Set the 4 environment variables in Vercel's project settings (same values as local `.env.local`):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `RESEND_API_KEY` (secret)
   - `SANITY_WRITE_TOKEN` (secret)
4. Deploy — Vercel builds and gives you a `.vercel.app` preview URL. Verify the site loads correctly there first.
5. In Vercel's "Domains" settings, add `suvasthuk.com` and `www.suvasthuk.com`.
6. Update DNS at your domain registrar: point the apex (`@`) record and `www` per Vercel's provided instructions (usually an A record + CNAME). This is the step that actually cuts over from the old GitHub Pages template.
7. **This also fixes the audit's Critical TLS finding** — Vercel auto-issues a matching SSL certificate for both `suvasthuk.com` and `www.suvasthuk.com`, resolving the current certificate mismatch on `www`.
8. DNS propagation takes anywhere from minutes to 48 hours. Verify with `https://suvasthuk.com` in an incognito browser window once it settles.

**GA4 and Search Console work identically regardless of host** — they attach via a script tag and a DNS/HTML verification, not through the hosting platform. Nothing in this section changes if you later move hosts.

## 2. Google Analytics 4 (GA4) — see who visits, from where, and what they do

### Setup (via Google Tag Manager — recommended over pasting GA4 code directly, since it lets you add more tracking later without a developer)
1. Create a free **Google Tag Manager (GTM)** account at tagmanager.google.com — gives you one small snippet to add to the site once.
2. Create a free **GA4 property** at analytics.google.com for suvasthuk.com.
3. Inside GTM, add a "GA4 Configuration" tag with your GA4 Measurement ID, firing on all pages.
4. Developer adds the GTM snippet to `app/layout.tsx` once (two small code blocks, in `<head>` and right after `<body>`) — a 15-minute one-time task.

### Conversion events to track (set up in GTM, no further code needed per-event)
| Event | Trigger | Why it matters |
|---|---|---|
| `contact_form_submit` | Successful POST to `/api/contact` | Primary lead conversion |
| `whatsapp_click` | Click on the floating WhatsApp button | Primary conversion channel for Indian clients |
| `phone_click` | Click on any `tel:` link | Secondary conversion signal |
| `gbp_click` | Click on the Google Business Profile link (footer/contact) | Local-intent signal |

### What to check weekly (5 minutes, in GA4's default reports)
- **Traffic sources** report — organic search vs. direct vs. social vs. referral.
- **Pages and screens** — top pages by views; watch which blog posts and service pages pull traffic.
- **Conversions** — the 4 events above, trended over time.
- Demographics/Tech → **Geographic** and **device** breakdowns confirm your visitors are actually in Bengaluru/Karnataka and mostly mobile (expected for this market).

## 3. Google Search Console (GSC) — see what people search to find you

1. Verify suvasthuk.com in GSC (search.google.com/search-console) — easiest method: DNS verification (add one TXT record at your registrar) or via the HTML tag method if DNS access is awkward.
2. Submit the sitemap: `https://suvasthuk.com/sitemap.xml` (already exists and works — confirmed in the SEO audit, 59 URLs).
3. **What to check weekly:**
   - **Performance** tab — actual search queries bringing people to the site, your average position for each, click-through rate. This is the only place you'll see real ranking data for free.
   - **Coverage/Indexing** tab — confirms Google has indexed your pages and flags any errors (404s, blocked pages).
   - **Core Web Vitals** report — real-user performance data once traffic accumulates.

## 4. Optional privacy-friendly alternative

**Plausible** or **Matomo** — lightweight, cookie-consent-free dashboards, useful as a simpler *secondary* view (not a GA4/GSC replacement — those stay as the free, Google-ecosystem-integrated defaults since GBP, Search, and Ads all connect to them). Consider Plausible (~$9/month, hosted) only if the GA4 interface feels overwhelming and you want a one-page daily-glance dashboard.

## 5. Before choosing/confirming hosting — developer checklist

Ask whoever manages the deploy to confirm, post-launch:
- SSL is active on both `suvasthuk.com` and `www.suvasthuk.com` (auto-handled by Vercel — verify anyway).
- Lighthouse/PageSpeed mobile score is reasonable (the audit's PageSpeed check hit a daily API quota — re-run once live).
- Core Web Vitals pass in GSC after ~4 weeks of real traffic data accumulates.

## 6. Monthly KPI dashboard — the numbers that tell you if the site is working

| # | KPI | Where to find it | What "good" looks like |
|---|---|---|---|
| 1 | Total sessions | GA4 → Reports → Acquisition | Steady month-over-month growth |
| 2 | Organic search sessions | GA4 → Acquisition → Traffic acquisition, filter "Organic Search" | Should grow faster than total sessions as SEO compounds |
| 3 | GBP profile views/actions (calls, directions, website clicks) | Google Business Profile dashboard → Performance | Directly reflects local search visibility |
| 4 | Contact form submissions | GA4 → Events → `contact_form_submit` | The core lead metric |
| 5 | WhatsApp/call clicks | GA4 → Events → `whatsapp_click` + `phone_click` | Often exceeds form submissions in this market — track both |
| 6 | Top-performing blog posts by traffic | GA4 → Reports → Pages and screens, filter `/blog/` | Confirms which of the 10 posts (+ future cadence) is earning its keep |
| 7 | Bounce rate / engagement on project pages | GA4 → Pages and screens → `/projects/[slug]` | Watch this improve as thin project pages get real content (ROADMAP) |
| 8 | Keyword ranking movement, top 10 target terms | GSC → Performance, filter by query | The direct measure of whether the SEO work is landing — check trend, not single-week noise |

Review this list on the same day each month; screenshot or export it somewhere so you can see trend, not just snapshot.

---

*Companion: ROADMAP-90-DAY.md Week 1 (deployment) · CONTENT-MASTER.md Block 9 (contact/WhatsApp details for event tracking)*
