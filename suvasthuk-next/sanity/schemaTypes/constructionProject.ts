import { defineField, defineType } from 'sanity'

export const constructionProject = defineType({
  name: 'constructionProject',
  title: 'Construction Project',
  type: 'document',
  fields: [
    defineField({ name: 'title',    type: 'string', title: 'Project Title',  validation: r => r.required() }),
    defineField({ name: 'slug',     type: 'slug',   title: 'Slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({
      name: 'category', type: 'string', title: 'Category',
      options: { list: ['residential', 'commercial', 'turnkey', 'renovation', 'institutional'] },
      validation: r => r.required(),
    }),
    defineField({
      name: 'coverImage', type: 'image', title: 'Cover Image', options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({ name: 'location',       type: 'string', title: 'Location (e.g. Whitefield, Bangalore)' }),
    defineField({ name: 'area',           type: 'string', title: 'Built-up Area (e.g. 4200 sqft)' }),
    defineField({ name: 'completionYear', type: 'number', title: 'Completion Year' }),
    defineField({ name: 'description',    type: 'text',   title: 'Short Description (for cards)', rows: 3 }),
    defineField({
      name: 'body', type: 'array', title: 'Case Study Body',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] },
      ],
    }),
    defineField({ name: 'featured', type: 'boolean', title: 'Show on construction homepage', initialValue: false }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'category' },
  },
})
