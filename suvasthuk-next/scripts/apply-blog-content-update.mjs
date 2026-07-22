// Applies the previews built by prepare-blog-content-update.mjs to Sanity:
// uploads each referenced local image once (deduped) and PATCHes/CREATEs the
// corresponding blogPost document's body + metadata.
//
// This is the ONE script in this pair that writes to production Sanity.
// It is intentionally not run automatically — review scripts/tmp-blog-preview/*.json
// first, then run explicitly:
//
//   node --env-file=.env.local scripts/apply-blog-content-update.mjs          (dry run, default)
//   node --env-file=.env.local scripts/apply-blog-content-update.mjs --apply  (writes to Sanity)

import { createClient } from '@sanity/client'
import { createReadStream, readFileSync, readdirSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PREVIEW_DIR = path.join(__dirname, 'tmp-blog-preview')
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'blog')
const APPLY = process.argv.includes('--apply')

const client = createClient({
  projectId: 'a2lcwcrm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN ?? (() => { throw new Error('Missing SANITY_WRITE_TOKEN env var. Run: node --env-file=.env.local scripts/<name>.mjs') })(),
  useCdn: false,
})

const assetIdCache = new Map() // filename -> Sanity asset _id, deduped across posts

async function uploadImageOnce(filename) {
  if (assetIdCache.has(filename)) return assetIdCache.get(filename)
  const filepath = path.join(IMAGES_DIR, filename)
  if (!existsSync(filepath)) throw new Error(`Local image not found: ${filepath}`)
  console.log(`  uploading ${filename}...`)
  const asset = await client.assets.upload('image', createReadStream(filepath), { filename })
  assetIdCache.set(filename, asset._id)
  return asset._id
}

async function resolveImageRefs(body) {
  for (const b of body) {
    if (b._type === 'image' && typeof b.asset?._ref === 'string' && b.asset._ref.startsWith('PENDING_UPLOAD:')) {
      const filename = b.asset._ref.slice('PENDING_UPLOAD:'.length)
      b.asset._ref = await uploadImageOnce(filename)
    }
  }
  return body
}

async function main() {
  if (!existsSync(PREVIEW_DIR)) {
    console.error('No previews found. Run prepare-blog-content-update.mjs first.')
    process.exit(1)
  }
  const files = readdirSync(PREVIEW_DIR).filter(f => f.endsWith('.json')).sort()
  console.log(APPLY ? 'APPLY MODE — this will write to production Sanity.\n' : 'DRY RUN — pass --apply to actually write to Sanity.\n')

  for (const file of files) {
    const preview = JSON.parse(readFileSync(path.join(PREVIEW_DIR, file), 'utf8'))
    console.log(`${preview.slug} — ${preview.sanityAction}`)

    if (!APPLY) continue

    const body = await resolveImageRefs(preview.body)
    const doc = {
      _type: 'blogPost',
      title: preview.title,
      slug: { _type: 'slug', current: preview.slug },
      category: preview.category,
      excerpt: preview.excerpt,
      author: preview.author,
      tags: preview.tags,
      readTime: preview.readTime,
      body,
      seoTitle: preview.seoTitle,
      seoDescription: preview.seoDescription,
    }
    if (preview.coverImage) {
      const assetId = await uploadImageOnce(preview.coverImage.file)
      doc.coverImage = { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }

    if (preview.existingId && preview.existingId !== 'UNKNOWN (fetch failed — check SANITY_WRITE_TOKEN)') {
      await client.patch(preview.existingId).set(doc).commit()
      console.log(`  patched ${preview.existingId}`)
    } else {
      const created = await client.create({ ...doc, publishedAt: new Date().toISOString() })
      console.log(`  created ${created._id}`)
    }
  }

  console.log(APPLY ? '\nDone.' : '\nDry run complete — nothing was written. Re-run with --apply to write to Sanity.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
