import { createClient } from '@sanity/client'
import { createWriteStream, createReadStream, existsSync, mkdirSync } from 'fs'
import { unlink } from 'fs/promises'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TMP = path.join(__dirname, 'tmp-blog-images')
if (!existsSync(TMP)) mkdirSync(TMP)

const client = createClient({
  projectId: 'a2lcwcrm',
  dataset:   'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN ?? (() => { throw new Error('Missing SANITY_WRITE_TOKEN env var. Run: node --env-file=.env.local scripts/<name>.mjs') })(),
  useCdn: false,
})

// High-quality Unsplash images matched to each blog post
const BLOG_IMAGES = [
  {
    slug: 'sustainable-architecture-bangalore',
    label: 'Sustainable Architecture',
    // Green modern home with large windows and natural surroundings
    url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=85&auto=format&fit=crop',
    filename: 'sustainable-architecture.jpg',
  },
  {
    slug: 'bbmp-plan-approval-bangalore-guide-2025',
    label: 'BBMP Plan Approval',
    // Architectural blueprints and drawings on a table
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=85&auto=format&fit=crop',
    filename: 'bbmp-blueprints.jpg',
  },
  {
    slug: 'interior-design-trends-bangalore-2025',
    label: 'Interior Design Trends',
    // Beautiful modern living room interior
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85&auto=format&fit=crop',
    filename: 'interior-design.jpg',
  },
  {
    slug: 'how-to-choose-the-right-architect-in-bangalore',
    label: 'How to Choose an Architect',
    // Architect reviewing plans at a desk
    url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=85&auto=format&fit=crop',
    filename: 'choose-architect.jpg',
  },
  {
    slug: 'construction-costs-bangalore-2025',
    label: 'Construction Costs',
    // Construction site with workers and structure
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=85&auto=format&fit=crop',
    filename: 'construction-costs.jpg',
  },
  {
    slug: 'vastu-shastra-modern-homes',
    label: 'Vastu Shastra',
    // Calm, well-lit traditional-modern home interior with warm tones
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=85&auto=format&fit=crop',
    filename: 'vastu-shastra.jpg',
  },
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    function get(url) {
      https.get(url, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          get(res.headers.location)
          return
        }
        res.pipe(file)
        file.on('finish', () => file.close(resolve))
      }).on('error', reject)
    }
    get(url)
  })
}

async function uploadImageToSanity(filepath, filename) {
  const stream = createReadStream(filepath)
  const asset = await client.assets.upload('image', stream, {
    filename,
    contentType: 'image/jpeg',
  })
  return asset._id
}

async function main() {
  // Fetch all blog posts to get their _id
  const posts = await client.fetch('*[_type=="blogPost"]{_id, "slug": slug.current, title}')
  const postMap = Object.fromEntries(posts.map(p => [p.slug, p]))

  for (const item of BLOG_IMAGES) {
    const post = postMap[item.slug]
    if (!post) {
      console.log(`⚠️  No post found for slug: ${item.slug}`)
      continue
    }

    console.log(`⬇️  Downloading image for "${item.label}"...`)
    const tmpPath = path.join(TMP, item.filename)

    try {
      await download(item.url, tmpPath)
      console.log(`☁️  Uploading to Sanity...`)
      const assetId = await uploadImageToSanity(tmpPath, item.filename)

      await client.patch(post._id).set({
        coverImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
        },
      }).commit()

      console.log(`✅ "${item.label}" — image attached\n`)
      await unlink(tmpPath).catch(() => {})
    } catch (err) {
      console.error(`❌ Failed for "${item.label}":`, err.message)
    }
  }

  console.log('🎉 All blog images uploaded!')
}

main()
