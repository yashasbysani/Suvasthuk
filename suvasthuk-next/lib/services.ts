export interface ServiceData {
  name: string
  slug: string
  tagline: string
  icon: string   // lucide-react icon name
  description: string
  process: { step: string; detail: string }[]
  faq: { q: string; a: string }[]
}

export const SERVICES: ServiceData[] = [
  {
    name: 'Architectural Design',
    slug: 'architectural-design',
    icon: 'PenTool',
    tagline: 'From concept sketch to permit-ready drawings.',
    description: `Architectural design is the heart of everything we do at Suvasthuk. Since 1993, we have translated hundreds of client briefs into built reality across Bangalore. Our process starts with deep listening — understanding how you live, work, and move through space. We then develop concepts that balance aesthetics, function, Vastu principles where required, and the practical constraints of your site and budget. Every design is resolved at both the macro level (massing, orientation, natural light) and the micro level (material choices, joinery, thresholds). We produce complete drawing sets: floor plans, elevations, sections, and 3D visualisations, through to construction and working drawings.`,
    process: [
      { step: 'Brief & Site Analysis', detail: 'We meet, listen, and visit your site to understand orientation, neighbours, and context.' },
      { step: 'Concept Design',        detail: 'Sketches, mood boards, and a 3D massing study — your first look at the building.' },
      { step: 'Design Development',    detail: 'Detailed floor plans, elevations, sections, and material palette finalised.' },
      { step: 'Construction Drawings', detail: 'Complete working drawings ready for contractor tendering and BBMP submission.' },
    ],
    faq: [
      { q: 'How long does architectural design take?', a: 'A typical residential project takes 4–8 weeks from brief to permit-ready drawings, depending on scope and revision cycles.' },
      { q: 'Do you handle BBMP approvals?', a: 'Yes — we prepare sanction plan drawings to BBMP specifications and guide you through the approval process.' },
      { q: 'Can I make changes mid-design?', a: 'Absolutely. We build revision rounds into every stage so the design evolves with your thinking.' },
    ],
  },
  {
    name: 'Interior Design',
    slug: 'interior-design',
    icon: 'Sofa',
    tagline: 'Spaces that feel as good as they look.',
    description: `Interior design at Suvasthuk is not about decoration — it is about making space feel right. We design interiors for homes, offices, retail spaces, and hospitality projects across Bangalore. Our approach ties every interior decision back to how the space will be used: furniture layouts that make rooms feel generous, lighting layers that shift a room from work to rest, material choices that age beautifully and are practical to maintain. We work across styles — contemporary, traditional, Indo-modern fusion — always anchored by your brief and budget. Our services cover space planning, furniture selection and custom design, lighting design, material and finish specification, and site supervision.`,
    process: [
      { step: 'Space Planning',       detail: 'Optimise furniture layout, traffic flow, and functional zones before choosing finishes.' },
      { step: 'Concept & Palette',    detail: 'Mood boards with materials, colours, furniture, and lighting directions.' },
      { step: 'Design Documentation', detail: 'Detailed drawings, specifications, and vendor BOQs for execution.' },
      { step: 'Site Execution',       detail: 'We supervise contractors and do quality checks at every stage.' },
    ],
    faq: [
      { q: 'Do you do turnkey interior projects?', a: 'Yes — we can manage the full execution, coordinating vendors, contractors, and procurement on your behalf.' },
      { q: 'What is the minimum budget for interior design?', a: 'A 1,000 sq ft apartment interior typically starts at ₹8–12 lakhs for mid-range finishes, and ₹15–25 lakhs for premium.' },
      { q: 'Can you work with existing furniture?', a: 'Absolutely. We incorporate pieces you love and design around them.' },
    ],
  },
  {
    name: 'Construction',
    slug: 'construction',
    icon: 'HardHat',
    tagline: 'Full-contract build with labour and materials.',
    description: `Suvasthuk offers complete construction services — we take responsibility for the entire build, from foundation to handover. This means you deal with one team, not a patchwork of contractors. We manage civil works, structural execution, MEP (mechanical, electrical, plumbing), finishes, and landscaping. Our construction contracts are transparent: detailed BOQs upfront, no hidden escalations, and a fixed handover date. With 30+ years of relationships with trusted vendors and sub-contractors in Bangalore, we maintain quality and schedule without compromise.`,
    process: [
      { step: 'BOQ & Contract',     detail: 'Detailed bill of quantities with fixed rates, so you know exactly what you are paying for.' },
      { step: 'Foundation & Civil', detail: 'Structural execution per approved drawings, with RCC and masonry quality checks.' },
      { step: 'MEP & Finishes',     detail: 'Electrical, plumbing, tiling, carpentry, painting — coordinated under one roof.' },
      { step: 'Handover',           detail: 'Final punch list, snag clearance, and keys handed over on schedule.' },
    ],
    faq: [
      { q: 'What is the cost per sq ft for construction in Bangalore?', a: 'Mid-range construction runs ₹1,800–2,500/sq ft. Premium finishes with branded fixtures can go up to ₹3,500+/sq ft. We provide detailed estimates after a site visit.' },
      { q: 'Do you provide a construction warranty?', a: 'Yes — one-year defect liability period post-handover, covering structural and waterproofing defects.' },
      { q: "Can you build from another architect's drawings?", a: 'Yes. We are happy to execute construction from approved drawings prepared by others.' },
    ],
  },
  {
    name: 'Structural Design',
    slug: 'structural-design',
    icon: 'Columns2',
    tagline: 'Engineering drawings for every stage of your project.',
    description: `Every building needs a sound structural design — one that is safe, code-compliant, and optimised for cost. Our structural engineering team produces complete drawings for residential, commercial, and institutional projects in Bangalore. We work with RCC framed structures, load-bearing masonry, and steel, adapting to the scale and soil conditions of each project. Our drawings are produced to BBMP and IS code standards, and are coordinated with architectural drawings to avoid conflicts. We also provide peer review of structural drawings prepared by others.`,
    process: [
      { step: 'Soil & Site Assessment', detail: 'Review soil test reports and site conditions to determine appropriate foundation type.' },
      { step: 'Structural Scheme',      detail: 'Column grid, beam depths, slab spans — structural concept aligned with architecture.' },
      { step: 'Working Drawings',       detail: 'Reinforcement details for foundation, columns, beams, slabs, and staircase.' },
      { step: 'Site Support',           detail: 'Available to answer contractor queries and review bar bending schedules.' },
    ],
    faq: [
      { q: 'Is structural design mandatory for BBMP approval?', a: 'Yes — BBMP requires structural drawings signed by a licensed structural engineer for most new constructions.' },
      { q: 'Can you review an existing structural design?', a: 'Yes, we offer peer review services for an independent check of structural drawings.' },
    ],
  },
  {
    name: 'Vastu Consultation',
    slug: 'vastu-consultation',
    icon: 'Compass',
    tagline: 'Aligned spaces and harmonious living.',
    description: `Vastu Shastra, when applied thoughtfully, creates homes and workspaces that feel balanced and harmonious. At Suvasthuk, we offer Vastu consultation both as a standalone service and integrated into our architectural design process. We do not apply Vastu as a rigid ruleset that overrides practical design — instead, we work with the underlying principles of orientation, energy flow, and spatial hierarchy to create spaces that feel right. Our consultations cover new construction (plot selection, orientation, room placement, entry design), interior layouts, and remediation for existing buildings.`,
    process: [
      { step: 'Plot & Orientation Review', detail: 'Analyse plot direction, surrounding context, and entry placement.' },
      { step: 'Layout Consultation',       detail: 'Room placement, door and window positions, kitchen and master bedroom orientation.' },
      { step: 'Interior Recommendations',  detail: 'Colour, material, and furniture placement aligned with Vastu principles.' },
      { step: 'Remediation (if needed)',   detail: 'Practical solutions for existing buildings that cannot be rebuilt.' },
    ],
    faq: [
      { q: 'Can Vastu and modern design coexist?', a: 'Yes — the majority of Vastu principles align naturally with good design: orientation for natural light, logical room adjacencies, clear entries. We reconcile the two seamlessly.' },
      { q: 'Do you offer Vastu for commercial spaces?', a: 'Yes — offices, retail stores, and hospitality spaces all benefit from Vastu-aligned planning.' },
    ],
  },
  {
    name: 'Renovation',
    slug: 'renovation',
    icon: 'Hammer',
    tagline: 'Refresh and transform existing spaces.',
    description: `A renovation done well can transform a dated or dysfunctional space into something you love again — without the cost and disruption of a full rebuild. Suvasthuk handles renovations from small apartment refreshes to complete gut-and-redo projects on older bungalows and heritage properties in Bangalore. We assess existing structure and services, identify what can be retained, and design interventions that make the most impact within your budget. Our renovation projects cover layout changes, kitchen and bathroom upgrades, flooring, facades, and full-service interior renovations.`,
    process: [
      { step: 'Condition Assessment',    detail: 'Inspect existing structure, services, and finishes to understand what can be kept and what must go.' },
      { step: 'Design Brief',            detail: 'Agree on scope, priorities, and budget before any design work begins.' },
      { step: 'Design & Documentation',  detail: 'Drawings and specifications for approved renovation scope.' },
      { step: 'Execution',               detail: 'Coordinated execution minimising disruption, especially in occupied spaces.' },
    ],
    faq: [
      { q: 'How long does a typical apartment renovation take?', a: 'A 2BHK renovation covering flooring, painting, kitchen and bathrooms typically takes 6–10 weeks.' },
      { q: 'Can you renovate while the space is occupied?', a: 'Yes — we phase the work room by room so you can continue living or working during the renovation.' },
    ],
  },
  {
    name: 'Landscaping',
    slug: 'landscaping',
    icon: 'Trees',
    tagline: 'Gardens and outdoor spaces that extend your home.',
    description: `The outdoor space around a building is as important as the building itself. Suvasthuk designs landscapes for residential plots, institutional campuses, and commercial properties across Bangalore. Our landscaping work covers site grading and drainage, planting design, paving, water features, boundary treatments, and lighting. We work with local plants suited to Bangalore's climate — drought-tolerant, low-maintenance species that look beautiful year-round. Our designs integrate seamlessly with the architecture, using the same material palette and language.`,
    process: [
      { step: 'Site Survey',    detail: 'Map existing trees, levels, drainage patterns, and soil conditions.' },
      { step: 'Concept Design', detail: 'Planting palette, paving layout, feature elements, and lighting concept.' },
      { step: 'Documentation',  detail: 'Planting plan, irrigation layout, and paving details for execution.' },
      { step: 'Establishment',  detail: 'We oversee planting and provide a maintenance guide for the first year.' },
    ],
    faq: [
      { q: 'Do you handle terrace gardens?', a: 'Yes — terrace and balcony gardens are a speciality, with lightweight planting media and integrated waterproofing.' },
    ],
  },
  {
    name: 'Layout Planning',
    slug: 'layout-planning',
    icon: 'Map',
    tagline: 'Master planning for plots and developments.',
    description: `Layout planning is required when subdividing land, planning a gated community, or developing a multi-plot site. Suvasthuk prepares detailed layout plans that comply with BBMP, BDA, and RERA regulations. We handle road widths, setbacks, common amenities, drainage, and phasing. Our layouts are designed not just for regulatory approval but for livability — well-oriented plots, generous road widths, and green buffers.`,
    process: [
      { step: 'Site & Regulation Review', detail: 'Understand applicable regulations (BBMP, BDA, RERA) and site constraints.' },
      { step: 'Layout Concept',           detail: 'Plot arrangement, road network, amenities, and open space.' },
      { step: 'Approval Drawings',        detail: 'Drawings prepared to authority standards for submission.' },
      { step: 'Execution Support',        detail: 'Site marking, infrastructure coordination, and RERA registration support.' },
    ],
    faq: [
      { q: 'How long does layout approval take in Bangalore?', a: 'BBMP layout approval typically takes 3–6 months. We manage the process and follow up on your behalf.' },
    ],
  },
  {
    name: 'Sanction Plans & TDR',
    slug: 'sanction-plans-tdr',
    icon: 'FileCheck',
    tagline: 'BBMP approvals and Transferable Development Rights.',
    description: `Navigating BBMP sanction plans and TDR (Transferable Development Rights) requires deep knowledge of local regulations. Suvasthuk has over 30 years of experience obtaining building sanctions in Bangalore, including complex cases involving TDR utilisation. We prepare plan approval drawings to BBMP standards, handle documentation, and liaise with authorities on your behalf. We also buy and sell TDR certificates to help clients maximise their permissible built-up area.`,
    process: [
      { step: 'Documentation Checklist', detail: 'Compile all required documents: khata, sketch, EC, structural certificate, etc.' },
      { step: 'Sanction Drawings',       detail: 'Prepare BBMP-format drawings — site plan, floor plans, elevations, sections.' },
      { step: 'Submission & Follow-up',  detail: 'Submit application and manage the approval process through to sanction order.' },
      { step: 'TDR (if applicable)',     detail: 'Identify TDR availability, calculate permissible utilisation, and procure certificates.' },
    ],
    faq: [
      { q: 'What documents are needed for BBMP plan sanction?', a: 'Khata certificate, property sketch, encumbrance certificate, structural stability certificate, and NOCs from BDA/fire/BWSSB depending on building height and use.' },
      { q: 'What is TDR and how can it help?', a: 'TDR lets you purchase additional floor area beyond your normal FAR entitlement. It is bought and sold as a certificate. We help you assess whether TDR is available for your area and handle procurement.' },
    ],
  },
  {
    name: 'Elevation Designs',
    slug: 'elevation-designs',
    icon: 'Building2',
    tagline: 'Facades that make a lasting first impression.',
    description: `The elevation is what the world sees — it sets expectations before anyone steps inside. Suvasthuk designs elevations for new construction and for existing buildings seeking a refresh. Our elevation designs balance the architectural character of the building, the neighbourhood context, material availability, and maintenance requirements. We produce detailed elevation drawings with material callouts, profiles, and 3D renders so you can visualise exactly how your building will look.`,
    process: [
      { step: 'Character Study',        detail: 'Analyse context, style preferences, and material options.' },
      { step: '2D Elevation Design',    detail: 'Detailed drawings showing window proportions, cladding, projections, and roof profile.' },
      { step: '3D Visualisation',       detail: 'Photo-realistic renders for client approval before construction.' },
      { step: 'Material Specification', detail: 'Detailed spec sheets for contractors with approved sources.' },
    ],
    faq: [
      { q: 'Can you redesign just the elevation of an existing building?', a: 'Yes — facade upgrades are a cost-effective way to modernise an older building without a full renovation.' },
    ],
  },
]
