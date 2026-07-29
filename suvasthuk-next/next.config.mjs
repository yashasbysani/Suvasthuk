/** @type {import('next').NextConfig} */
// Next.js dev tooling (webpack HMR + React Refresh) evaluates code at runtime and opens a
// hot-reload websocket, so 'unsafe-eval' and ws:/wss: are needed in development ONLY.
// Production keeps the stricter policy.
const isDev = process.env.NODE_ENV !== 'production'

const contentSecurityPolicy = [
  "default-src 'self'",
  "img-src 'self' data: https://cdn.sanity.io",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `connect-src 'self' https://*.sanity.io${isDev ? ' ws: wss:' : ''}`,
  "font-src 'self' data:",
].join('; ')

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
]

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/services/construction',
        destination: '/construction',
        permanent: true,
      },
      // Legacy GitHub Pages ("Mosaic" Bootstrap template) URLs — pre-migration, Google
      // still has some of these indexed (confirmed via GSC URL Inspection).
      { source: '/index.html',    destination: '/',         permanent: true },
      { source: '/about.html',    destination: '/about',    permanent: true },
      { source: '/services.html', destination: '/services', permanent: true },
      { source: '/contact.html',  destination: '/contact',  permanent: true },
      { source: '/blog.html',     destination: '/blog',     permanent: true },
      { source: '/projects.html', destination: '/projects', permanent: true },
      { source: '/team.html',     destination: '/about',    permanent: true },
    ]
  },
}

export default nextConfig;
