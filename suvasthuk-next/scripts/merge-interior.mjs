import { createClient } from '@sanity/client'
import { createReadStream, readdirSync } from 'fs'
import { join, extname, basename } from 'path'
import { createHash, randomBytes } from 'crypto'
import { readFileSync } from 'fs'

const client = createClient({
  projectId: 'a2lcwcrm',
  dataset:   'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN ?? (() => { throw new Error('Missing SANITY_WRITE_TOKEN env var. Run: node --env-file=.env.local scripts/<name>.mjs') })(),
  useCdn: false,
})

const BASE = '/Users/shrishaa/Documents/interior'
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const TARGET_SLUG = 'interior-projects'
const EXTRA_SOURCE_SLUGS = ['interior-perspectives']

function key() {
  return randomBytes(6).toString('hex')
}

function getUniqueLocalImages(dir) {
  const files = readdirSync(dir)
    .filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
    .map(f => join(dir, f))
    .sort()

  const byHash = new Map()
  for (const filePath of files) {
    const hash = createHash('md5').update(readFileSync(filePath)).digest('hex')
    if (byHash.has(hash)) {
      console.log(`  ↷ skip local duplicate: ${basename(filePath)} (same as ${basename(byHash.get(hash))})`)
      continue
    }
    byHash.set(hash, filePath)
  }
  return [...byHash.values()]
}

async function uploadImage(filePath) {
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: basename(filePath),
  })
  console.log('  ✓ uploaded', basename(filePath))
  return { _type: 'image', _key: key(), asset: { _type: 'reference', _ref: asset._id } }
}

async function run() {
  const target = await client.fetch(
    `*[_type=="project" && slug.current==$slug][0]{_id, title, gallery, coverImage}`,
    { slug: TARGET_SLUG }
  )
  if (!target) throw new Error(`Target "${TARGET_SLUG}" not found`)

  const seen = new Set([
    target.coverImage?.asset?._ref,
    ...(target.gallery ?? []).map(g => g.asset._ref),
  ])

  const additions = []

  // 1. Upload new local images (deduped within the folder)
  const localImages = getUniqueLocalImages(BASE)
  console.log(`  Found ${localImages.length} unique local images to upload`)
  for (const imgPath of localImages) {
    additions.push(await uploadImage(imgPath))
  }

  // 2. Fold in other existing interior project(s)
  const sourceIds = []
  for (const slug of EXTRA_SOURCE_SLUGS) {
    const doc = await client.fetch(
      `*[_type=="project" && slug.current==$slug][0]{_id, title, gallery, coverImage}`,
      { slug }
    )
    if (!doc) {
      console.log(`  ⚠️  Source "${slug}" not found, skipping.`)
      continue
    }
    sourceIds.push(doc._id)

    const candidates = [
      ...(doc.coverImage ? [doc.coverImage] : []),
      ...(doc.gallery ?? []),
    ]
    let addedFromSource = 0
    for (const img of candidates) {
      const ref = img.asset._ref
      if (seen.has(ref)) {
        console.log(`  ↷ skip duplicate asset from "${doc.title}"`)
        continue
      }
      seen.add(ref)
      additions.push({ _type: 'image', _key: key(), asset: { _type: 'reference', _ref: ref } })
      addedFromSource++
    }
    console.log(`  + queued ${addedFromSource} images from "${doc.title}"`)
  }

  if (additions.length === 0) {
    console.log('  Nothing to merge.')
    return
  }

  const tx = client.transaction()
  tx.patch(target._id, p => p.setIfMissing({ gallery: [] }).append('gallery', additions))
  for (const id of sourceIds) tx.delete(id)

  await tx.commit()
  console.log(`\n✅ Merged ${additions.length} new images into "${TARGET_SLUG}" and deleted ${sourceIds.length} source project(s).`)
}

run().catch(err => { console.error(err); process.exit(1) })
