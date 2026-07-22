import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote',    type: 'text',   title: 'Quote',        validation: r => r.required() }),
    defineField({ name: 'author',   type: 'string', title: 'Client Name',  validation: r => r.required() }),
    defineField({
      name: 'avatarGender', type: 'string', title: 'Avatar Icon',
      description: 'Which generic headshot icon to show next to this review.',
      options: { list: [{ title: 'Male', value: 'male' }, { title: 'Female', value: 'female' }] },
      validation: r => r.required(),
    }),
    defineField({ name: 'location', type: 'string', title: 'Location / Project type' }),
    defineField({
      name: 'rating', type: 'number', title: 'Rating (1-5 stars)',
      validation: r => r.min(1).max(5).integer(),
    }),
    defineField({ name: 'date', type: 'date', title: 'Review Date' }),
    defineField({ name: 'sourceUrl', type: 'url', title: 'Source URL (Google review link)' }),
    defineField({ name: 'order',    type: 'number', title: 'Display order' }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'quote' },
  },
})
