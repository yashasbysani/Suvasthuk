import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title',       type: 'string',   title: 'Title',    validation: r => r.required() }),
    defineField({ name: 'slug',        type: 'slug',     title: 'Slug',     options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'category',    type: 'string',   title: 'Category' }),
    defineField({ name: 'coverImage',  type: 'image',    title: 'Cover Image', options: { hotspot: true } }),
    defineField({ name: 'excerpt',     type: 'text',     title: 'Excerpt (150 chars)', rows: 2 }),
    defineField({ name: 'author',      type: 'string',   title: 'Author', initialValue: 'Suvasthuk Architects' }),
    defineField({ name: 'publishedAt', type: 'datetime', title: 'Published At' }),
    defineField({ name: 'readTime',    type: 'number',   title: 'Read Time (minutes)' }),
    defineField({ name: 'body',        type: 'array',    title: 'Body',     of: [
      { type: 'block' },
      {
        type: 'image',
        options: { hotspot: true },
        fields: [
          { name: 'alt', type: 'string', title: 'Alt text', validation: r => r.required() },
          { name: 'caption', type: 'string', title: 'Caption (optional)' },
        ],
      },
    ] }),
    defineField({ name: 'tags',        type: 'array',    title: 'Tags',     of: [{ type: 'string' }] }),
    defineField({ name: 'seoTitle',    type: 'string',   title: 'SEO Title (override)' }),
    defineField({ name: 'seoDescription', type: 'text', title: 'SEO Description', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'publishedAt' },
  },
})
