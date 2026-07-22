import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: 'a2lcwcrm',
  dataset: 'production',
  apiVersion: '2026-04-15',
  token: process.env.SANITY_WRITE_TOKEN ?? (() => { throw new Error('Missing SANITY_WRITE_TOKEN env var. Run: node --env-file=.env.local scripts/<name>.mjs') })(),
  useCdn: false,
})

const BASE = '/Users/shrishaa/Developer/drive-download-20260529T103559Z-3-001/Construction'

const PROJECTS = [
  {
    title: 'Manjesh Residence',
    slug: 'manjesh-residence',
    category: 'residential',
    coverFile: 'MANJESH/IMG_2981.JPG',
    galleryFiles: [
      'MANJESH/IMG_2986.JPG',
      'MANJESH/IMG_2990.JPG',
      'MANJESH/IMG_2993.JPG',
      'MANJESH/IMG_2995.JPG',
      'MANJESH/IMG_3002.JPG',
      'MANJESH/IMG_3003.JPG',
      'MANJESH/IMG_3005.JPG',
      'MANJESH/IMG_3017.JPG',
      'MANJESH/IMG_3031.JPG',
      'MANJESH/IMG_7709.JPG',
      'MANJESH/IMG_7710.JPG',
      'MANJESH/IMG_7739.JPG',
      'MANJESH/IMG_7755.JPG',
      'MANJESH/IMG_7756.JPG',
      'MANJESH/IMG_7757.JPG',
      'MANJESH/11898878_856043721131235_455354729350062000_n.jpg',
    ],
    featured: true,
  },
  {
    title: 'Manjesh Views',
    slug: 'manjesh-views',
    category: 'residential',
    coverFile: 'Manjesh Views/manjesh.jpg',
    galleryFiles: [
      'Manjesh Views/6.jpg',
      'Manjesh Views/7.jpg',
      'Manjesh Views/68.jpg',
      'Manjesh Views/poorna vikas vidhyalaya bird_s views.jpg',
    ],
    featured: false,
  },
  {
    title: 'Ravishankar Residence',
    slug: 'ravishankar-residence',
    category: 'residential',
    coverFile: 'Ravishankar/20.jpg',
    galleryFiles: ['Ravishankar/69.jpg'],
    featured: false,
  },
  {
    title: 'Shantakumari Residence',
    slug: 'shantakumari-residence',
    category: 'residential',
    coverFile: 'Shantakumari/22.jpg',
    galleryFiles: ['Shantakumari/71.jpg'],
    featured: false,
  },
]

async function uploadImage(filePath) {
  const fullPath = path.join(BASE, filePath)
  console.log(`  Uploading: ${filePath}`)
  const fileBuffer = fs.readFileSync(fullPath)
  const ext = path.extname(filePath).toLowerCase().replace('.', '')
  const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
  const asset = await client.assets.upload('image', fileBuffer, {
    filename: path.basename(filePath),
    contentType: mimeType,
  })
  return asset
}

async function main() {
  for (const project of PROJECTS) {
    console.log(`\n📁 Creating project: ${project.title}`)

    // Upload cover image
    const coverAsset = await uploadImage(project.coverFile)
    console.log(`  ✅ Cover uploaded: ${coverAsset._id}`)

    // Upload gallery images
    const galleryAssets = []
    for (const file of project.galleryFiles) {
      const asset = await uploadImage(file)
      galleryAssets.push(asset)
    }
    console.log(`  ✅ Gallery uploaded: ${galleryAssets.length} images`)

    // Create Sanity document
    const doc = {
      _type: 'constructionProject',
      title: project.title,
      slug: { _type: 'slug', current: project.slug },
      category: project.category,
      featured: project.featured,
      coverImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: coverAsset._id },
        hotspot: { x: 0.5, y: 0.5, height: 1, width: 1 },
      },
      body: galleryAssets.map((asset, i) => ({
        _type: 'image',
        _key: `gallery-${i}`,
        asset: { _type: 'reference', _ref: asset._id },
        hotspot: { x: 0.5, y: 0.5, height: 1, width: 1 },
      })),
    }

    const created = await client.create(doc)
    console.log(`  ✅ Document created: ${created._id}`)

    // Publish it
    await client.patch(created._id).set({ _id: created._id }).commit()
    console.log(`  ✅ Published: ${project.title}`)
  }

  console.log('\n🎉 All construction projects uploaded successfully!')
}

main().catch(console.error)
