import { createClient } from '@sanity/client'
import { createReadStream, readdirSync } from 'fs'
import { join, extname, basename } from 'path'
import { readdir } from 'fs/promises'
import { resolve } from 'path'

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
  const asset  = await client.assets.upload('image', stream, { filename: basename(filePath) })
  console.log('    ✓', basename(filePath))
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function projectExists(slug) {
  const doc = await client.fetch(`*[_type=="project" && slug.current==$slug][0]._id`, { slug })
  return !!doc
}

async function createProject({ title, slug, category, images, featured = false }) {
  const exists = await projectExists(slug)
  if (exists) { console.log(`  ⚠️  "${title}" already exists, skipping.`); return }
  if (images.length === 0) { console.log(`  ⚠️  "${title}" has no images, skipping.`); return }

  console.log(`\n📁 ${title} — ${images.length} images`)
  const uploaded = []
  for (const img of images) uploaded.push(await uploadImage(img))

  await client.create({
    _type:      'project',
    title,
    slug:       { _type: 'slug', current: slug },
    category,
    coverImage: { ...uploaded[0], options: { hotspot: true } },
    gallery:    uploaded.slice(1),
    featured,
  })
  console.log(`  ✅ Created "${title}"`)
}

// ── 1. collected renders ────────────────────────────────────────────────────
async function uploadCollectedRenders() {
  await createProject({
    title:    'Collected Renders',
    slug:     'collected-renders',
    category: 'residential',
    images:   getImages(join(BASE, 'collected renders')),
    featured: false,
  })
}

// ── 2. SUVASTHUK VIEWS ──────────────────────────────────────────────────────
async function uploadSuvasthukViews() {
  await createProject({
    title:    'Suvasthuk Views',
    slug:     'suvasthuk-views',
    category: 'residential',
    images:   getImages(join(BASE, 'SUVASTHUK  VIEWS')),
    featured: false,
  })
}

// ── 3. perspectives subfolders ──────────────────────────────────────────────
const PERSPECTIVES_MAP = [
  { folder: 'COMMERCIAL',       title: 'Commercial Perspectives',    slug: 'commercial-perspectives',    category: 'commercial' },
  { folder: 'COMMERCIAL 1',     title: 'Commercial Projects',        slug: 'commercial-projects',         category: 'commercial' },
  { folder: 'INSTITUITIONS 3]', title: 'Institutional Projects',     slug: 'institutional-projects',      category: 'institutional' },
  { folder: 'INTERIOR',         title: 'Interior Perspectives',      slug: 'interior-perspectives',       category: 'interior' },
  { folder: 'NH-4',             title: 'NH-4 Projects',              slug: 'nh-4-projects',               category: 'commercial' },
  { folder: 'PRIVATE BUNGALOWS',title: 'Private Bungalows',         slug: 'private-bungalows',           category: 'residential' },
  { folder: 'RESIDENCES 2',     title: 'Residences',                 slug: 'residences',                  category: 'residential' },
  { folder: 'RESIDENTIAL',      title: 'Residential Perspectives',   slug: 'residential-perspectives',    category: 'residential' },
  { folder: 'TOWN PLANNING',    title: 'Town Planning',              slug: 'town-planning',               category: 'institutional' },
  { folder: 'apts',             title: 'Apartment Designs',          slug: 'apartment-designs',           category: 'residential' },
  { folder: 'commercials',      title: 'Commercial Designs',         slug: 'commercial-designs',          category: 'commercial' },
  { folder: 'govindsai',        title: 'Govindsai Project',          slug: 'govindsai-project',           category: 'residential' },
  { folder: 'houses',           title: 'House Designs',              slug: 'house-designs',               category: 'residential' },
  { folder: 'judicial layout',  title: 'Judicial Layout',            slug: 'judicial-layout',             category: 'institutional' },
  { folder: 'mr.majesh',        title: 'Mr. Manjesh Residence',      slug: 'mr-manjesh-residence',        category: 'residential' },
  { folder: 'pavagada',         title: 'Pavagada Project',           slug: 'pavagada-project',            category: 'residential' },
  { folder: 'youtopia',         title: 'Youtopia',                   slug: 'youtopia',                    category: 'commercial' },
  // skip: website (96 stock imgs), word (51 doc exports)
]

async function uploadPerspectives() {
  const perspBase = join(BASE, 'perspectives')
  for (const p of PERSPECTIVES_MAP) {
    const images = getImages(join(perspBase, p.folder))
    await createProject({ ...p, images })
  }
}

async function run() {
  await uploadCollectedRenders()
  await uploadSuvasthukViews()
  await uploadPerspectives()
  console.log('\n🎉 All done!')
}

run().catch(console.error)
