import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a2lcwcrm',
  dataset:   'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN ?? (() => { throw new Error('Missing SANITY_WRITE_TOKEN env var. Run: node --env-file=.env.local scripts/<name>.mjs') })(),
  useCdn: false,
})

function block(text, style = 'normal') {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style,
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
    markDefs: [],
  }
}

function h2(text) { return block(text, 'h2') }
function h3(text) { return block(text, 'h3') }
function p(text)  { return block(text, 'normal') }

const POSTS = [
  {
    title: 'How to Choose the Right Architect in Bangalore',
    slug: 'how-to-choose-the-right-architect-in-bangalore',
    category: 'architecture',
    excerpt: 'What to look for, what to ask, and how to avoid costly mistakes when hiring an architect.',
    author: 'Suvasthuk Architects',
    publishedAt: '2025-01-15',
    readTime: 7,
    tags: ['architect', 'hiring', 'bangalore', 'tips'],
    body: [
      p('Hiring an architect is one of the most important decisions you will make for your home or commercial project. Get it right and you get a building that works beautifully for decades. Get it wrong and you spend years fixing problems that should never have existed. Here is what thirty years of practice in Bangalore has taught us about what to look for — and what to avoid.'),
      h2('1. Look for Relevant Experience, Not Just a Long Portfolio'),
      p('An architect who has designed forty luxury apartments may not be the right choice for your 30×40 residential plot in a BDA layout. Ask specifically: have they done projects of your type, scale, and budget? Ask to see two or three completed projects that are similar to yours — not renders, but built and occupied buildings.'),
      p('In Bangalore, local knowledge matters enormously. BBMP bye-laws, BDA regulations, soil conditions in different zones (rock in Indiranagar, soft soil in Whitefield), typical contractor rates — these are things that take years to learn and directly affect your project.'),
      h2('2. Understand How They Charge'),
      p('Architect fees in India are typically calculated as a percentage of construction cost (usually 5–10% for residential projects), a fixed lump sum, or on a per-square-foot basis. Each method has trade-offs. Percentage-based fees align the architect\'s interests with yours — if costs go up, they earn more, which can be a problem. Fixed fees give you cost certainty but may limit revisions. Clarify upfront what the fee covers: concept design only, or all the way through working drawings, approvals, and site supervision?'),
      h2('3. Ask About Their Approval Process Experience'),
      p('BBMP plan sanctions, BDA approvals, fire NOC, BWSSB connections — navigating Bangalore\'s approval process is a skill in itself. Ask your architect how many BBMP sanctions they have handled in the last two years. Ask if they have in-house expertise or outsource this. An architect who is vague about the approval process is a red flag.'),
      h2('4. Check How They Handle Site Supervision'),
      p('The best design in the world is only as good as its execution. Ask how often the architect will visit the site once construction begins. Once a month is not enough for a complex project. Find out who specifically will be on site — the principal architect or a junior associate? Will they review bar bending schedules, check concrete pours, inspect waterproofing?'),
      h2('5. Have a Honest Conversation About Budget'),
      p('A good architect will tell you early if your budget is not realistic for what you want to build. If an architect agrees with everything you say without pushing back, be cautious. Design involves trade-offs, and an architect who helps you make smart trade-offs is worth far more than one who tells you what you want to hear.'),
      p('For context: in Bangalore, mid-range residential construction currently costs ₹1,800–2,500 per sq ft. Premium finishes push this to ₹3,000–3,500. These numbers need to be in the conversation from day one.'),
      h2('6. Trust, But Verify'),
      p('Ask for references from two or three past clients and actually call them. Ask: did the project finish on time? Were there cost overruns? Would you hire this architect again? The answers will tell you more than any portfolio.'),
      p('Suvasthuk Architects has been practising in Bangalore since 1993. We welcome any questions about our process, past projects, or fee structure. The right architect relationship is built on transparency from the very first conversation.'),
    ],
  },
  {
    title: 'Construction Costs in Bangalore 2025: A Complete Breakdown',
    slug: 'construction-costs-bangalore-2025',
    category: 'construction',
    excerpt: 'Up-to-date costs for residential construction in Bangalore — from foundation to finishing, by budget tier.',
    author: 'Suvasthuk Architects',
    publishedAt: '2025-02-10',
    readTime: 8,
    tags: ['construction', 'cost', 'bangalore', '2025', 'budget'],
    body: [
      p('Construction costs in Bangalore have risen significantly over the past three years, driven by higher labour costs, material price inflation, and increased regulatory compliance requirements. Here is a current, honest breakdown of what residential construction costs in 2025 — across three tiers.'),
      h2('The Three Tiers of Construction in Bangalore'),
      h3('Economy (₹1,400–1,800 per sq ft)'),
      p('At this level you get functional, code-compliant construction using standard materials: AAC blocks or red bricks, standard sand-finish plastering, Kajaria or equivalent tiles, basic electrical fittings, and CPVC plumbing. This tier is common for rental properties, second plots being developed for investment, and budget first homes. Expect fewer design customisations and limited material choices.'),
      h3('Mid-Range (₹1,800–2,500 per sq ft)'),
      p('This is where most owner-occupied homes in Bangalore land today. You get better-quality tiles (₹60–120 per sq ft range), teak or hardwood main door, modular kitchen with decent fittings, branded sanitaryware (Hindware, Cera), and reasonable finish quality throughout. At this budget, 3D visualisation and design-driven spaces are achievable without compromising on build quality.'),
      h3('Premium (₹2,500–4,000+ per sq ft)'),
      p('Premium construction in Bangalore means Italian marble or large-format vitrified tiles, imported sanitaryware (Kohler, Duravit, Grohe), full home automation, aluminium or UPVC windows with double glazing, and detailed architectural elements — coffered ceilings, feature walls, custom joinery. This segment has grown significantly in areas like Whitefield, Sarjapur Road, and North Bangalore.'),
      h2('What Drives Costs Up in 2025'),
      p('Labour costs have risen 20–30% since 2022, driven by migration of skilled workers to other states and the general rise in living costs in Bangalore. Steel prices remain volatile, fluctuating between ₹55–70 per kg depending on market conditions. Sand availability and quality varies sharply by season and location in the city.'),
      p('In central areas like Koramangala, Indiranagar, and Jayanagar, expect to add 15–20% to any estimate compared to outer ring road localities, primarily due to logistics, site constraints, and higher sub-contractor rates.'),
      h2('What Is NOT Included in Per Sq Ft Rates'),
      p('Most per-square-foot quotes exclude: BBMP approval fees (₹50,000–3,00,000 depending on plot size and building height), structural design fees, architect fees, borewell and water connection, compound wall and gate, landscaping, and interior design/furniture. Always ask your contractor for a complete scope — the base rate is rarely the full picture.'),
      h2('How to Get an Accurate Estimate'),
      p('The only way to get a reliable estimate is with a detailed Bill of Quantities (BOQ) prepared after architectural drawings are complete. A BOQ breaks down every item — concrete grade, steel quantity, tile area, paint quality — so you are comparing like with like when you get contractor quotes. Suvasthuk prepares detailed BOQs for all our construction projects. Contact us to understand what your specific project might cost.'),
    ],
  },
  {
    title: 'Vastu Shastra for Modern Homes: What Actually Works',
    slug: 'vastu-shastra-modern-homes',
    category: 'architecture',
    excerpt: 'A practical look at Vastu principles — which ones align with good design, and how to apply them without compromising your layout.',
    author: 'Suvasthuk Architects',
    publishedAt: '2025-03-05',
    readTime: 6,
    tags: ['vastu', 'architecture', 'design', 'home'],
    body: [
      p('Vastu Shastra is one of those subjects that generates strong opinions on all sides. Some dismiss it entirely as superstition. Others treat every rule as inviolable. At Suvasthuk, our position after thirty years of practice is more nuanced: many Vastu principles align remarkably well with good architectural design. Others are difficult to apply to urban plots without significant compromise. Here is an honest look at what works and what to approach pragmatically.'),
      h2('The Principles That Align with Good Design'),
      h3('North and East Openings'),
      p('Vastu recommends maximising openings on the north and east sides of a building. Architecturally, this is excellent guidance: the north receives diffuse, shadow-free natural light throughout the day, ideal for living spaces; the east catches the gentle morning sun, ideal for bedrooms and kitchens. This principle costs nothing to follow and improves the building significantly.'),
      h3('Kitchen in the Southeast'),
      p('The southeast is associated with Agni (fire) in Vastu, making it the preferred zone for the kitchen. In practical terms, a southeast kitchen gets good cross-ventilation from the prevailing southwest breezes and morning light from the east — both genuinely useful. The cook facing east (towards morning light) while working is comfortable and well-lit. This is one of the strongest alignments between Vastu logic and architectural logic.'),
      h3('Master Bedroom in the Southwest'),
      p('The southwest is considered the heaviest, most stable zone in Vastu — suitable for the senior occupant\'s bedroom. Architecturally, southwest rooms are naturally warmer (afternoon sun) and more private (typically away from entry and service areas). There is a practical rationale here.'),
      h2('Where Vastu and Modern Plots Create Tensions'),
      p('Many urban plots in Bangalore — particularly 20×30 and 30×40 BDA layouts — face south or southwest. Strict Vastu would suggest the main entrance should face north or east, which on a south-facing plot requires creative planning. In our experience, the solution is usually achievable: setting the entrance slightly east of centre, using the stairwell or service block as a buffer on the southwest, and ensuring primary living spaces still open north or east. It requires more design thought but is rarely impossible.'),
      p('The same applies to apartment buildings, where individual units have predetermined orientations. Here, internal arrangement — which room goes where within the unit — can still follow Vastu logic even if the building orientation cannot.'),
      h2('Our Approach'),
      p('At Suvasthuk, we offer Vastu consultation as an integrated part of architectural design, not as a separate overlay imposed after design is complete. The difference matters: when Vastu principles inform the design from the beginning, they improve the building. When applied as afterthoughts, they lead to awkward compromises.'),
      p('We do not apply Vastu as a rigid checklist. We explain the reasoning behind each principle, present the practical implications for your specific plot, and help you make informed decisions. Some clients want full Vastu compliance; others want a pragmatic application of the most impactful principles. Both are valid — and achievable.'),
    ],
  },
  {
    title: 'Interior Design Trends in Bangalore 2025',
    slug: 'interior-design-trends-bangalore-2025',
    category: 'interior',
    excerpt: 'From Japandi aesthetics to biophilic design — what Bangalore homeowners are choosing for their interiors this year.',
    author: 'Suvasthuk Architects',
    publishedAt: '2025-04-01',
    readTime: 5,
    tags: ['interior design', 'trends', 'bangalore', '2025'],
    body: [
      p('Interior design preferences in Bangalore have shifted meaningfully over the past two years. The pandemic-era emphasis on comfortable, functional home offices has settled into permanent space-planning norms. At the same time, there is a growing appetite for interiors that feel distinct — not just from a catalogue — and that hold up well over time. Here is what we are seeing in residential projects across the city.'),
      h2('1. Warm Minimalism Replacing Cold Minimalism'),
      p('The all-white, grey-and-glass aesthetic that dominated the 2010s is giving way to warmer, more textured palettes. Terracotta, warm ochre, deep sage green, and muted dusty pinks are appearing on accent walls and furniture. Natural materials — rattan, jute, unpolished stone, warm wood — are replacing high-gloss laminates. The look is still clean and uncluttered, but it feels human rather than clinical.'),
      h2('2. Biophilic Design as Standard, Not Specialty'),
      p('Bringing nature indoors has moved from a niche design philosophy to a mainstream expectation. Large indoor plants (fiddle leaf figs, bird of paradise, monstera) are now planned into floor plans from the beginning, with specific lighting and ventilation provisions. Green walls and courtyard gardens are increasingly requested even in apartments. In Bangalore\'s climate — genuinely pleasant for most of the year — indoor-outdoor blurring through large sliding doors and connected balconies is particularly effective.'),
      h2('3. Multifunctional Rooms Over Dedicated Rooms'),
      p('The dedicated home office room is giving way to a more flexible approach: a built-in desk alcove in the master bedroom, a study nook in a landing, a guest bedroom that doubles as an office. This reflects the reality of hybrid work schedules and is also a more efficient use of Bangalore\'s expensive floor area. Modular furniture systems that fold, extend, or reconfigure are popular with younger homeowners.'),
      h2('4. Locally Made, Artisan-Quality Materials'),
      p('There is a clear shift towards locally sourced and handcrafted materials among premium clients. Athangudi tiles from Tamil Nadu, Kutch embroidery cushions, handmade terracotta pots, Channapatna lacquerware, and Bidriware inlays are being specified instead of their mass-produced equivalents. This trend is partly aesthetic (these materials have genuine character), partly a response to supply chain uncertainty during the pandemic, and partly a growing appreciation for Indian craft traditions.'),
      h2('5. Lighting as Architecture'),
      p('Lighting design has come a long way in Bangalore\'s residential market. Clients now understand the difference between ambient, task, and accent lighting — and expect all three to be designed into their homes, not added as an afterthought. Recessed coves, warm LED strips, picture lights, and pendants are specified alongside the architectural drawings, not after. Smart lighting systems with app or voice control are increasingly standard in mid-to-premium projects.'),
      p('Whatever direction your interior takes, the best results come when interior design decisions are made in conversation with architectural decisions — materials, light, proportion, and space work together when they are designed together. This is the approach we take at Suvasthuk with every project we handle from brief to handover.'),
    ],
  },
  {
    title: 'BBMP Plan Approval in Bangalore: A Complete Guide for 2025',
    slug: 'bbmp-plan-approval-bangalore-guide-2025',
    category: 'construction',
    excerpt: 'Step-by-step walkthrough of the BBMP building plan sanction process — documents, timeline, fees, and common pitfalls.',
    author: 'Suvasthuk Architects',
    publishedAt: '2025-04-20',
    readTime: 9,
    tags: ['BBMP', 'plan approval', 'bangalore', 'regulations'],
    body: [
      p('Building plan approval from BBMP (Bruhat Bengaluru Mahanagara Palike) is mandatory before starting any construction in Bangalore city limits. The process has been significantly digitised in recent years, but it still requires careful preparation and local knowledge. Here is a practical, step-by-step guide based on our experience handling hundreds of sanctions across Bangalore.'),
      h2('Step 1: Confirm Your Property is in BBMP Jurisdiction'),
      p('BBMP covers the core city. Properties in BDA-approved layouts, BMRDA jurisdiction, or gram panchayat limits have different approval authorities. Your khata (property tax document) will indicate which body your property falls under — look for "BBMP" or the ward name. A-Khata properties are eligible for BBMP sanctions; B-Khata properties require regularisation before proceeding.'),
      h2('Step 2: Understand the Applicable Bye-Laws'),
      p('BBMP follows the Revised Master Plan 2031 and Unified Development Control Regulations (UDCR). The key parameters you need to know for your plot: Floor Area Ratio (FAR) — how much built-up area is permitted relative to plot area; setbacks — minimum distances from plot boundaries; maximum building height; and coverage (percentage of plot that can be covered by building). Your architect should calculate these before design begins, not after.'),
      h2('Step 3: Prepare Required Documents'),
      p('The core documents for BBMP plan sanction are: Khata certificate and Khata extract (not older than 3 months), sale deed or title deed, up-to-date property tax paid receipt, BBMP-format site plan prepared by a licensed surveyor, architectural drawings signed by a registered architect (plans, elevations, sections), structural stability certificate from a licensed structural engineer, soil test report, and NOC from BWSSB (water board) if the building is above 5 floors. For buildings above 15 metres in height, a fire NOC is also required.'),
      h2('Step 4: Online Submission via OBPAS'),
      p('BBMP\'s Online Building Plan Approval System (OBPAS) handles all new applications. Your architect logs in with their licensed professional credentials, uploads all documents in the specified format, and submits the application. The system performs automated bye-law checks and assigns a file number. Keep this number — it is used for all follow-up.'),
      h2('Step 5: Scrutiny and Site Inspection'),
      p('After submission, a BBMP junior engineer typically conducts a site inspection within 5–7 working days. They verify the site dimensions match the plan, check for any encroachments, and confirm the plot boundary. It is advisable to have a representative present during inspection. Any discrepancies noted at this stage will need to be resolved before approval proceeds.'),
      h2('Step 6: Approval and Commencement Certificate'),
      p('Under the Sakala scheme, BBMP must either approve or formally reject a plan within 30 working days. Silence beyond this period is treated as deemed approval. Once approved, you receive a sanctioned plan and a Commencement Certificate — this is what allows you to begin foundation work. Keep physical and digital copies of both documents safely.'),
      h2('Timeline and Fees'),
      p('Realistic timeline: 6–10 weeks from submission to approval for straightforward residential plots. Complex cases (corner plots, road-widening affected plots, properties with title disputes) can take 3–6 months. Approval fees are calculated on built-up area and range from approximately ₹30–80 per sq ft of built area depending on the zone and building type.'),
      h2('Common Pitfalls to Avoid'),
      p('The most frequent delays we see: submitting incomplete documents (always prepare a checklist and double-check), B-Khata properties attempting to sanction without prior regularisation, designs that violate setback requirements (often discovered only at inspection), and discrepancies between the site dimensions in the sale deed and actual site measurements. Engaging an architect with current BBMP experience — someone who knows which formats are currently accepted and which officer handles which zone — can save months.'),
      p('Suvasthuk has managed BBMP sanctions continuously since 1993. If you need guidance on your specific situation, we are happy to review your documents and advise.'),
    ],
  },
  {
    title: 'Sustainable Architecture in Bangalore: Building for the Long Term',
    slug: 'sustainable-architecture-bangalore',
    category: 'architecture',
    excerpt: 'Practical strategies for building greener, cooler, and more efficient homes in Bangalore\'s unique climate.',
    author: 'Suvasthuk Architects',
    publishedAt: '2025-05-10',
    readTime: 6,
    tags: ['sustainable', 'green building', 'architecture', 'bangalore', 'climate'],
    body: [
      p('Bangalore\'s climate is genuinely exceptional — mild temperatures for most of the year, low humidity, and enough rainfall to support serious water harvesting. Yet most buildings in the city are designed as if they were in Chennai or Delhi, relying on air conditioning and mechanical systems to compensate for poor passive design. There is an enormous opportunity to build much better. Here is what sustainable design means practically for a Bangalore home.'),
      h2('Orientation and Natural Ventilation First'),
      p('The single most effective sustainable design decision costs nothing: orient the building correctly. In Bangalore, the primary breeze direction is from the southwest (monsoon) and northeast (winter). Long building facades facing north and south maximise diffuse daylight and minimise direct solar heat gain. Cross-ventilation — positioning windows on opposite or adjacent walls — eliminates the need for mechanical cooling in Bangalore\'s climate for a large part of the year. This is free, passive, and permanent.'),
      p('Yet many plots in BDA and BBMP layouts present challenges: 20-foot-wide plots with long sides facing east-west, or south-facing plots with limited north exposure. Good architects design around these constraints — narrow air shafts, staggered openings, screened verandahs — to maximise ventilation even on difficult plots.'),
      h2('Rainwater Harvesting: Mandatory and Worthwhile'),
      p('BBMP makes rainwater harvesting mandatory for plots above 2,400 sq ft. But even for smaller plots, it makes practical sense in Bangalore. The city receives 900–980mm of rain annually, concentrated in two monsoon seasons. A 1,500 sq ft roof can harvest approximately 90,000 litres of water per year — enough to significantly reduce dependence on tanker water, which costs ₹500–1,500 per 6,000-litre load. Sump sizing, filter design, and first-flush diverters are simple, low-cost interventions that should be standard in every new home.'),
      h2('Thermal Mass and Roof Design'),
      p('Bangalore\'s warm afternoons (25–32°C in summer) are best managed through thermal mass — thick walls and heavy roofs that absorb heat during the day and release it at night when temperatures drop. Traditional Bangalore construction used thick lime-plastered brick walls for this reason. Modern construction can achieve similar performance with AAC blocks (better insulation than solid brick), inverted roof systems with insulation, or a simple brick bat coba waterproofing system which adds thermal mass and keeps roofs 3–5°C cooler.'),
      h2('Solar Energy: The Economics Have Changed'),
      p('Rooftop solar is now genuinely cost-effective for Bangalore homes. A typical 5kW system costs ₹3–4 lakhs installed and generates 550–650 units per month in Bangalore\'s solar conditions. With BESCOM\'s net metering policy, excess generation is credited to your bill. Payback period is typically 5–7 years, with a 25-year panel life. For new construction, provision for solar panels (structural loading, conduit runs, inverter space) adds negligible cost and avoids expensive retrofitting later.'),
      h2('Materials: Reduce, Reuse, Choose Wisely'),
      p('Fly ash bricks use industrial waste and have a significantly lower carbon footprint than fired clay bricks. Locally sourced materials — Cuddapah stone flooring, Mangalore roof tiles, Indian teakwood — involve less transport energy than imported alternatives. Lime plaster, which is vapour-permeable and allows walls to breathe, is making a comeback in premium projects. These are not exotic choices — they are appropriate materials for Bangalore\'s context that have been used here for centuries.'),
      p('At Suvasthuk, sustainability is not an add-on feature — it is how good architecture has always been practised. Every building we design starts with orientation, ventilation, and passive performance before any mechanical systems are considered. If you are planning a new home in Bangalore and want to explore what a genuinely sustainable design might look like for your specific plot, get in touch.'),
    ],
  },
]

async function run() {
  for (const post of POSTS) {
    const exists = await client.fetch('*[_type=="blogPost" && slug.current==$slug][0]._id', { slug: post.slug })
    if (exists) { console.log(`⚠️  "${post.title}" already exists, skipping.`); continue }

    await client.create({
      _type: 'blogPost',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      category: post.category,
      excerpt: post.excerpt,
      author: post.author,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      tags: post.tags,
      body: post.body,
      seoTitle: `${post.title} | Suvasthuk Architects`,
      seoDescription: post.excerpt,
    })
    console.log(`✅ Created: "${post.title}"`)
  }
  console.log('\n🎉 All blog posts uploaded!')
}

run().catch(console.error)
