import { createClient } from '@sanity/client'
import { createReadStream, readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'

const client = createClient({
  projectId: 'a2lcwcrm',
  dataset:   'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN ?? (() => { throw new Error('Missing SANITY_WRITE_TOKEN env var. Run: node --env-file=.env.local scripts/<name>.mjs') })(),
  useCdn: false,
})

const BASE = '/Users/shrishaa/Developer/drive-download-20260529T103559Z-3-001/Architecture'
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function getImages(dir) {
  try {
    return readdirSync(dir)
      .filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
      .map(f => join(dir, f))
      .sort()
  } catch { return [] }
}

async function uploadImage(filePath) {
  const stream = createReadStream(filePath)
  const asset  = await client.assets.upload('image', stream, {
    filename: basename(filePath),
  })
  console.log('  ✓ uploaded', basename(filePath))
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function projectExists(slug) {
  const doc = await client.fetch(`*[_type=="project" && slug.current==$slug][0]._id`, { slug })
  return !!doc
}

const PROJECTS = [
  {
    title:    'Muniraj Residence',
    slug:     'muniraj-residence',
    category: 'residential',
    folder:   'MUNIRAJ',
    featured: true,
  },
  {
    title:    'Manjesh Views',
    slug:     'manjesh-views',
    category: 'residential',
    folder:   'Manjesh Views',
    featured: true,
  },
  {
    title:    'Option 04',
    slug:     'option-04',
    category: 'residential',
    folder:   'OPTION 04',
    featured: false,
  },
  {
    title:    'Ravindran Residence',
    slug:     'ravindran-residence',
    category: 'residential',
    folder:   'Ravindran',
    featured: true,
  },
  {
    title:    'Sheshachalam Residence',
    slug:     'sheshachalam-residence',
    category: 'residential',
    folder:   'Sheshachalam',
    featured: false,
  },
  {
    title:    'Interior Projects',
    slug:     'interior-projects',
    category: 'interior',
    folder:   'interior',
    featured: false,
  },
]

async function run() {
  for (const p of PROJECTS) {
    console.log(`\n📁 Processing: ${p.title}`)

    const exists = await projectExists(p.slug)
    if (exists) {
      console.log(`  ⚠️  Already exists, skipping.`)
      continue
    }

    const images = getImages(join(BASE, p.folder))
    if (images.length === 0) {
      console.log(`  ⚠️  No images found, skipping.`)
      continue
    }

    console.log(`  Found ${images.length} images`)

    const uploaded = []
    for (const imgPath of images) {
      const img = await uploadImage(imgPath)
      uploaded.push(img)
    }

    const coverImage = uploaded[0]
    const gallery    = uploaded.slice(1)

    const doc = {
      _type:      'project',
      title:      p.title,
      slug:       { _type: 'slug', current: p.slug },
      category:   p.category,
      coverImage: { ...coverImage, options: { hotspot: true } },
      gallery,
      featured:   p.featured,
    }

    const created = await client.create(doc)
    console.log(`  ✅ Created: ${p.title} (${created._id}) with ${gallery.length} gallery images`)
  }

  console.log('\n🎉 Done!')
}

run().catch(console.error)
