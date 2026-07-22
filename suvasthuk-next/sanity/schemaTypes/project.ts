import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title',    type: 'string',  title: 'Title',    validation: r => r.required() }),
    defineField({ name: 'slug',     type: 'slug',    title: 'Slug',     options: { source: 'title' }, validation: r => r.required() }),
    defineField({
      name: 'category', type: 'string', title: 'Category',
      // Unified enum spanning the architecture + construction verticals (dual-brand DRY).
      options: { list: ['residential','commercial','interior','institutional','renovation','turnkey'] },
      validation: r => r.required(),
    }),
    defineField({
      name: 'portfolioVisibility', type: 'array', title: 'Portfolio Visibility',
      description: 'Which brand galleries show this project. Suvasthuk = architecture site; Yashas = construction site.',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Suvasthuk Architects', value: 'suvasthuk' },
          { title: 'Yashas Construction',  value: 'yashas' },
        ],
        layout: 'grid',
      },
      initialValue: ['suvasthuk'],
      validation: r => r.min(1).error('Select at least one brand'),
    }),
    defineField({ name: 'area',     type: 'string',  title: 'Area (e.g. 4,200 sq ft)' }),
    defineField({ name: 'location', type: 'string',  title: 'Location (e.g. Whitefield, Bengaluru)' }),
    defineField({ name: 'year',     type: 'number',  title: 'Year Completed' }),
    defineField({ name: 'services', type: 'array',   title: 'Services', of: [{ type: 'string' }] }),
    defineField({
      name: 'coverImage', type: 'image', title: 'Cover Image', options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'gallery', type: 'array', title: 'Gallery',
      of: [{
        type: 'image', options: { hotspot: true },
        fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
      }],
    }),
    defineField({ name: 'brief',    type: 'text',    title: 'Client Brief' }),
    defineField({ name: 'designStory', type: 'array', title: 'Design Story', of: [{ type: 'block' }] }),
    defineField({ name: 'tags',     type: 'array',   title: 'Tags',     of: [{ type: 'string' }] }),
    defineField({ name: 'featured', type: 'boolean', title: 'Show on homepage mosaic', initialValue: false }),
    defineField({ name: 'seoTitle', type: 'string',  title: 'SEO Title (override)' }),
    defineField({ name: 'seoDescription', type: 'text', title: 'SEO Description (override)', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'category' },
  },
})
