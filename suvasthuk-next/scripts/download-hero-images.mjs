import https from 'https'
import { createWriteStream } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../public/images/hero')

const IMAGES = [
  // 1. Dramatic modern luxury villa exterior at dusk
  { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&q=90&auto=format&fit=crop', file: 'hero-1.jpg' },
  // 2. Sleek contemporary house with large glass windows at night
  { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=2400&q=90&auto=format&fit=crop', file: 'hero-2.jpg' },
  // 3. Stunning modern white villa with pool
  { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=2400&q=90&auto=format&fit=crop', file: 'hero-3.jpg' },
  // 4. Dramatic minimalist interior with high ceilings
  { url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=2400&q=90&auto=format&fit=crop', file: 'hero-4.jpg' },
  // 5. Modern architectural building exterior
  { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2400&q=90&auto=format&fit=crop', file: 'hero-5.jpg' },
  // 6. Luxury interior living room with warm lighting
  { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2400&q=90&auto=format&fit=crop', file: 'hero-6.jpg' },
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    function get(u) {
      https.get(u, res => {
        if (res.statusCode === 301 || res.statusCode === 302) { get(res.headers.location); return }
        res.pipe(file)
        file.on('finish', () => file.close(resolve))
      }).on('error', reject)
    }
    get(url)
  })
}

for (const img of IMAGES) {
  const dest = path.join(OUT, img.file)
  process.stdout.write(`Downloading ${img.file}...`)
  await download(img.url, dest)
  console.log(' ✅')
}
console.log('All hero images downloaded!')
