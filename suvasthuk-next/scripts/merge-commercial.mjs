import { createClient } from '@sanity/client'
import { randomBytes } from 'crypto'

const client = createClient({
  projectId: 'a2lcwcrm',
  dataset:   'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN ?? (() => { throw new Error('Missing SANITY_WRITE_TOKEN env var. Run: node --env-file=.env.local scripts/<name>.mjs') })(),
  useCdn: false,
})

const TARGET_SLUG = 'commercial-buildings'
const SOURCE_SLUGS = ['commercial-projects', 'commercial-designs']

function key() {
  return randomBytes(6).toString('hex')
}

async function run() {
  const target = await client.fetch(
    `*[_type=="project" && slug.current==$slug][0]{_id, gallery, coverImage}`,
    { slug: TARGET_SLUG }
  )
  if (!target) throw new Error(`Target "${TARGET_SLUG}" not found`)

  const seen = new Set([
    target.coverImage?.asset?._ref,
    ...(target.gallery ?? []).map(g => g.asset._ref),
  ])

  const additions = []
  const sourceIds = []

  for (const slug of SOURCE_SLUGS) {
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

    for (const img of candidates) {
      const ref = img.asset._ref
      if (seen.has(ref)) {
        console.log(`  ↷ skip duplicate asset from "${doc.title}"`)
        continue
      }
      seen.add(ref)
      additions.push({
        _type: 'image',
        _key: key(),
        asset: { _type: 'reference', _ref: ref },
      })
    }
    console.log(`  + queued ${candidates.length} images from "${doc.title}"`)
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
