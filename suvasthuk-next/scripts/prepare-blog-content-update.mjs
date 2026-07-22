// Converts docs/marketing/blog-posts/*.md into Sanity portable-text bodies and
// writes a local preview (scripts/tmp-blog-preview/<slug>.json) for review.
//
// This script is READ-ONLY against Sanity (it only fetches existing doc _ids
// so the preview can show what would be patched) and NEVER calls .patch()/.create().
// Actually applying the update is a separate, explicit step — see apply-blog-content-update.mjs.
//
// Usage: node --env-file=.env.local scripts/prepare-blog-content-update.mjs

import { createClient } from '@sanity/client'
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.join(__dirname, '..', '..', 'docs', 'marketing', 'blog-posts')
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'blog')
const OUT_DIR = path.join(__dirname, 'tmp-blog-preview')

const client = createClient({
  projectId: 'a2lcwcrm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN, // read-only usage here, but same token works for fetch
  useCdn: false,
})

// ---------------------------------------------------------------------------
// Image mapping: one ordered array of image descriptors per slug, matching the
// order [IMAGE INSTRUCTION: ...] blocks appear in that post's markdown.
// `null` = not yet generated (blocked on image-gen credits at prep time) — the
// script skips inserting an image block for that slot and logs a warning.
// ---------------------------------------------------------------------------
const REUSE_NOTE = 'reused elsewhere — limited real-photo inventory (see summary)'

// Cover images render full-bleed (hero banner + /blog thumbnail) and get
// crop-to-fill treatment — fine for photos, bad for diagrams whose content
// runs edge-to-edge. Override the default "first mapped image" pick for any
// post whose first slot is a diagram, in favor of a real/photoreal image
// from later in the same post's own set (or, if none exists, elsewhere).
const COVER_OVERRIDE = {
  'bbmp-plan-approval-bangalore-guide-2025': { file: 'real-construction-site-progress.jpg', alt: 'BBMP-approved construction underway at a Suvasthuk Architects site in Bengaluru' },
  'vastu-shastra-modern-homes': { file: 'real-residential-interior-living-dining.jpg', alt: 'Naturally lit, cross-ventilated home interior in Bengaluru by Suvasthuk Architects' },
  '30x40-house-construction-bangalore': { file: 'real-residential-sheshachalum-elevation.jpg', alt: 'G+2 home on a 30x40 plot in Bengaluru by Suvasthuk Architects' },
}

const IMAGE_MAP = {
  'construction-costs-bangalore-2025': [
    { file: 'real-residential-chandrappa-elevation.jpg', alt: 'Completed residential project by Suvasthuk Architects, Bengaluru — front elevation' },
    { file: 'real-institutional-completed-interior.jpg', alt: 'Interior finishing detail — false ceiling and joinery, Suvasthuk Architects project, Bengaluru', note: 'best available finishing-stage interior; not a residential site' },
    { file: 'real-residential-sheshachalum-elevation.jpg', alt: 'G+2 residential home on a compact urban plot, Suvasthuk Architects, Bengaluru' },
    { file: 'real-construction-site-progress.jpg', alt: 'RCC structure under construction at a Suvasthuk Architects project site, Bengaluru' },
  ],
  'how-to-choose-the-right-architect-in-bangalore': [
    { file: 'real-commercial-ravindran-elevation.jpg', alt: 'Portfolio project — completed building elevation by Suvasthuk Architects, Bengaluru' },
    { file: 'real-construction-site-progress.jpg', alt: 'Design and construction team coordinating on-site, Suvasthuk Architects, Bengaluru', note: REUSE_NOTE },
    { file: 'real-residential-sheshachalum-elevation.jpg', alt: 'Residential project designed and built by Suvasthuk Architects, Bengaluru', note: REUSE_NOTE },
  ],
  'bbmp-plan-approval-bangalore-guide-2025': [
    { file: 'bbmp-approval-flowchart.png', alt: 'Illustrative diagram: the BBMP plan approval flow — submission, scrutiny, site inspection, approval, commencement certificate', caption: 'Illustrative: the BBMP approval flow' },
    { file: 'bbmp-far-diagram.png', alt: 'Illustrative diagram: how Floor Area Ratio caps total built-up area on a plot', caption: 'Illustrative: how FAR caps the total built area' },
    { file: 'bbmp-setback-diagram.png', alt: 'Illustrative diagram: front, rear and side setbacks framing the buildable footprint on a plot', caption: 'Illustrative diagram: how setbacks frame the buildable footprint' },
  ],
  'vastu-shastra-modern-homes': [
    { file: 'vastu-30x40-zoning.png', alt: 'Illustrative diagram: vastu zoning on a compact 30x40 plot', caption: 'Illustrative: vastu zoning on a compact 30x40 plot' },
    { file: 'real-residential-interior-living-dining.jpg', alt: 'Naturally lit, cross-ventilated home interior in Bengaluru by Suvasthuk Architects' },
    { file: 'vastu-nine-square-grid.png', alt: 'Illustrative diagram: the nine-square logic with an open center (brahmasthan)', caption: 'Illustrative diagram: the nine-square logic with an open center (brahmasthan)' },
  ],
  'sustainable-architecture-bangalore': [
    { file: 'jali-facade-photoreal.jpg', alt: 'Climate-responsive facade with brick jali shading, Bengaluru — Suvasthuk Architects' },
    { file: 'rainwater-harvesting-diagram.png', alt: 'Illustrative diagram: rooftop rainwater harvesting system for an urban Indian house', caption: 'Illustrative: rooftop rainwater harvesting' },
    { file: 'real-residential-sheshachalum-elevation.jpg', alt: 'Climate-responsive residential design with shaded overhangs, Bengaluru — Suvasthuk Architects', note: REUSE_NOTE },
  ],
  'interior-design-trends-bangalore-2025': [
    { file: 'warm-minimalist-bedroom.jpg', alt: 'Illustrative visualization of the 2026 earthy-minimal bedroom direction', caption: 'Illustrative visualization of the 2026 earthy-minimal direction' },
    { file: 'restrained-living-room-ceiling.jpg', alt: 'Illustrative: a restrained flush ceiling reads more premium than an over-worked false ceiling', caption: 'Illustrative: restraint reads more premium than an over-worked false ceiling' },
    { file: 'real-residential-interior-living-dining.jpg', alt: 'Interior living space by Suvasthuk Architects, Bengaluru', note: REUSE_NOTE },
  ],
  'design-build-vs-traditional-contractor-bangalore': [
    { file: 'real-construction-site-progress.jpg', alt: 'One team coordinating design and construction on-site in Bengaluru — Suvasthuk Architects', note: REUSE_NOTE },
    { file: 'real-commercial-paramount-facade.jpg', alt: 'From render to finished building — a Suvasthuk design-build project in Bengaluru', note: 'no matching render+built pair available; single completed-project photo per the instruction\'s own fallback' },
    { file: 'real-institutional-poorna-vikas-exterior.jpg', alt: 'From drawing to delivered building — a Suvasthuk design-build project in Bengaluru', note: 'no matching render+built pair available; single completed-project photo per the instruction\'s own fallback' },
  ],
  '30x40-house-construction-bangalore': [
    { file: '30x40-floor-plan-diagram.png', alt: 'Illustrative diagram: an efficient 30x40 floor plan', caption: 'Illustrative: an efficient 30x40 floor plan' },
    { file: 'real-residential-sheshachalum-elevation.jpg', alt: 'G+2 home on a 30x40 plot in Bengaluru by Suvasthuk Architects', note: REUSE_NOTE },
    { file: 'real-residential-chandrappa-elevation.jpg', alt: '30x40 residential house design in Bengaluru by Suvasthuk Architects', note: REUSE_NOTE },
  ],
  'commercial-building-design-construction-bangalore': [
    { file: 'real-commercial-paramount-facade.jpg', alt: 'Completed commercial building facade in Bengaluru by Suvasthuk Architects', note: REUSE_NOTE },
    { file: 'commercial-build-timeline.png', alt: 'Illustrative diagram: a typical commercial build timeline', caption: 'Illustrative: a typical commercial build timeline' },
    { file: 'real-commercial-ravindran-elevation.jpg', alt: 'Commercial building design and construction in Bengaluru by Suvasthuk Architects', note: REUSE_NOTE },
  ],
  'school-institutional-building-design-karnataka': [
    { file: 'real-institutional-biology-lab.jpg', alt: 'Institutional interior designed by Suvasthuk Architects, Bengaluru' },
    { file: 'real-construction-site-progress.jpg', alt: 'Institutional construction in progress at a Suvasthuk Architects site, Bengaluru', note: 'genuine match — this is the actual Poorna Vikas Vidyalaya site under construction' },
    { file: 'real-institutional-completed-interior.jpg', alt: 'Poorna Vikas Vidyalaya — completed institutional interior, Suvasthuk Architects', note: REUSE_NOTE },
  ],
}

// ---------------------------------------------------------------------------
// Markdown -> Portable Text
// ---------------------------------------------------------------------------
function key() {
  return Math.random().toString(36).slice(2)
}

function parseInline(text) {
  // Returns spans for a plain-text line containing **bold**, *italic* and
  // [text](url) markdown, plus the markDefs any link spans reference.
  const markDefs = []
  const spans = []
  let rest = text
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/
  while (rest.length) {
    const m = rest.match(re)
    if (!m) {
      spans.push({ _type: 'span', _key: key(), text: rest, marks: [] })
      break
    }
    if (m.index > 0) {
      spans.push({ _type: 'span', _key: key(), text: rest.slice(0, m.index), marks: [] })
    }
    if (m[1] !== undefined) {
      const markKey = key()
      markDefs.push({ _type: 'link', _key: markKey, href: m[2] })
      spans.push({ _type: 'span', _key: key(), text: m[1], marks: [markKey] })
    } else if (m[3] !== undefined) {
      spans.push({ _type: 'span', _key: key(), text: m[3], marks: ['strong'] })
    } else if (m[4] !== undefined) {
      spans.push({ _type: 'span', _key: key(), text: m[4], marks: ['em'] })
    }
    rest = rest.slice(m.index + m[0].length)
  }
  return { spans, markDefs }
}

function block(text, style = 'normal', listItem) {
  const { spans, markDefs } = parseInline(text)
  return {
    _type: 'block',
    _key: key(),
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    markDefs,
    children: spans,
  }
}

function parseFrontmatter(raw) {
  const fenceStart = raw.indexOf('```')
  const fenceEnd = raw.indexOf('```', fenceStart + 3)
  const fm = raw.slice(fenceStart + 3, fenceEnd).trim()
  const fields = {}
  for (const line of fm.split('\n')) {
    const m = line.match(/^([a-zA-Z]+):\s+(.*)$/)
    if (!m) continue
    let [, k, v] = m
    if (k === 'slug') v = v.replace(/\s*\((REWRITE|NEW)[^)]*\)\s*$/, '').trim()
    if (k === 'tags') v = v.split(',').map(t => t.trim()).filter(Boolean)
    fields[k] = v
  }
  const bodyMd = raw.slice(fenceEnd + 3).replace(/^\s*---\s*\n/, '')
  return { fields, bodyMd }
}

function parseBody(bodyMd, images) {
  const blocks = []
  let imgIdx = 0
  const chunks = bodyMd.split(/\n\s*\n/).map(c => c.trim()).filter(Boolean)

  for (const chunk of chunks) {
    if (chunk === '---') continue
    if (chunk.startsWith('[IMAGE INSTRUCTION')) {
      const img = images[imgIdx]
      imgIdx++
      if (!img) continue // pending / not yet generated — skip this slot
      blocks.push({
        _type: 'image',
        _key: key(),
        asset: { _type: 'reference', _ref: `PENDING_UPLOAD:${img.file}` },
        alt: img.alt,
        ...(img.caption ? { caption: img.caption } : {}),
      })
      continue
    }
    if (chunk.startsWith('## ')) {
      blocks.push(block(chunk.slice(3).trim(), 'h2'))
      continue
    }
    if (chunk.startsWith('### ')) {
      blocks.push(block(chunk.slice(4).trim(), 'h3'))
      continue
    }
    const lines = chunk.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.every(l => l.startsWith('- '))) {
      for (const l of lines) blocks.push(block(l.slice(2).trim(), 'normal', 'bullet'))
      continue
    }
    if (lines.every(l => /^\d+\.\s/.test(l))) {
      for (const l of lines) blocks.push(block(l.replace(/^\d+\.\s/, ''), 'normal', 'number'))
      continue
    }
    // Markdown table (schema has no table block type — flatten each data row
    // into a bullet: "<first column> — <header>: <value>, ...").
    if (
      lines.length >= 2 &&
      lines.every(l => l.startsWith('|') && l.endsWith('|')) &&
      /^\|[\s:|-]+\|$/.test(lines[1])
    ) {
      const parseCells = l => l.slice(1, -1).split('|').map(c => c.trim())
      const header = parseCells(lines[0])
      for (const row of lines.slice(2).map(parseCells)) {
        const rest = row.slice(1).map((c, i) => `${header[i + 1]}: ${c}`).join(', ')
        blocks.push(block(`${row[0]} — ${rest}`, 'normal', 'bullet'))
      }
      continue
    }
    // plain paragraph (join wrapped lines with a space)
    blocks.push(block(lines.join(' '), 'normal'))
  }

  return { blocks, imagesUsed: imgIdx }
}

// ---------------------------------------------------------------------------
async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })
  const files = readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).sort()

  const summary = []

  for (const file of files) {
    const raw = readFileSync(path.join(POSTS_DIR, file), 'utf8')
    const { fields, bodyMd } = parseFrontmatter(raw)
    const images = IMAGE_MAP[fields.slug]
    if (!images) {
      summary.push({ file, slug: fields.slug, error: 'No entry in IMAGE_MAP for this slug' })
      continue
    }
    const { blocks } = parseBody(bodyMd, images)
    const missing = images.filter(i => i === null).length
    const coverImage = COVER_OVERRIDE[fields.slug] ?? images.find(i => i !== null) ?? null
    const wordCount = bodyMd.replace(/\[IMAGE INSTRUCTION[^\]]*\]/g, ' ').split(/\s+/).filter(Boolean).length
    const readTime = Math.max(1, Math.round(wordCount / 200))

    let existingId = null
    try {
      existingId = await client.fetch('*[_type=="blogPost" && slug.current==$slug][0]._id', { slug: fields.slug })
    } catch {
      existingId = 'UNKNOWN (fetch failed — check SANITY_WRITE_TOKEN)'
    }

    const preview = {
      sourceFile: file,
      sanityAction: existingId ? 'PATCH existing document' : 'CREATE new document',
      existingId,
      slug: fields.slug,
      title: fields.title,
      seoTitle: fields.seoTitle,
      seoDescription: fields.seoDescription,
      category: fields.category,
      author: fields.author,
      excerpt: fields.excerpt,
      tags: fields.tags,
      readTime,
      coverImage,
      imagesExpected: images.length,
      imagesInserted: images.length - missing,
      imagesPending: missing,
      body: blocks,
    }

    writeFileSync(
      path.join(OUT_DIR, `${fields.slug}.json`),
      JSON.stringify(preview, null, 2),
    )

    summary.push({
      file,
      slug: fields.slug,
      action: preview.sanityAction,
      blocks: blocks.length,
      imagesInserted: preview.imagesInserted,
      imagesPending: missing,
    })
  }

  console.log('\nPrepared previews written to scripts/tmp-blog-preview/*.json (not pushed to Sanity):\n')
  console.table(summary)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
