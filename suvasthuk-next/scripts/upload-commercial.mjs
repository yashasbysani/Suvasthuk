import { createClient } from '@sanity/client'
import { createReadStream, readdirSync } from 'fs'
import { join, extname, basename } from 'path'

const client = createClient({
  projectId: 'a2lcwcrm',
  dataset:   'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN ?? (() => { throw new Error('Missing SANITY_WRITE_TOKEN env var. Run: node --env-file=.env.local scripts/<name>.mjs') })(),
  useCdn: false,
})

const BASE = '/Users/shrishaa/Documents/commercial buildings'
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

const PROJECT = {
  title:    'Commercial Buildings',
  slug:     'commercial-buildings',
  category: 'commercial',
  featured: true,
  // Filename to use as the cover (falls back to first image if not found)
  cover:    'JPNAGAR COMMERCIAL.jpg',
}

function getImages(dir) {
  return readdirSync(dir)
    .filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
    .map(f => join(dir, f))
    .sort()
}

async function uploadImage(filePath) {
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: basename(filePath),
  })
  console.log('  ✓ uploaded', basename(filePath))
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function run() {
  console.log(`\n📁 Processing: ${PROJECT.title}`)

  const existing = await client.fetch(
    `*[_type=="project" && slug.current==$slug][0]._id`,
    { slug: PROJECT.slug }
  )
  if (existing) {
    console.log(`  ⚠️  Project "${PROJECT.slug}" already exists (${existing}), skipping.`)
    return
  }

  const images = getImages(BASE)
  if (images.length === 0) {
    console.log('  ⚠️  No images found, aborting.')
    return
  }
  console.log(`  Found ${images.length} images`)

  // Order so the chosen cover comes first
  images.sort((a, b) => {
    if (basename(a) === PROJECT.cover) return -1
    if (basename(b) === PROJECT.cover) return 1
    return 0
  })

  const uploaded = []
  for (const imgPath of images) {
    uploaded.push(await uploadImage(imgPath))
  }

  const doc = {
    _type:      'project',
    title:      PROJECT.title,
    slug:       { _type: 'slug', current: PROJECT.slug },
    category:   PROJECT.category,
    coverImage: { ...uploaded[0], options: { hotspot: true } },
    gallery:    uploaded.slice(1),
    featured:   PROJECT.featured,
  }

  const created = await client.create(doc)
  console.log(`  ✅ Created: ${PROJECT.title} (${created._id}) — cover + ${doc.gallery.length} gallery images`)
  console.log('\n🎉 Done!')
}

run().catch(err => { console.error(err); process.exit(1) })
