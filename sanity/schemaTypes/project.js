import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Controls display order on the homepage (lower = first)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'category',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. Visual Identity, Campaign, Motion',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'role', title: 'Role', type: 'string' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'role' },
          },
        },
      ],
    }),
    defineField({
      name: 'media',
      title: 'Media',
      description: 'Drag to reorder — images and videos can be mixed freely',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'mediaImage',
          title: 'Image',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
              ],
            }),
          ],
          preview: {
            select: { media: 'image', title: 'image.alt' },
            prepare: ({ media, title }) => ({ title: title || 'Image', media }),
          },
        },
        {
          type: 'object',
          name: 'mediaVideo',
          title: 'Video',
          fields: [
            defineField({ name: 'url', title: 'URL (Vimeo / YouTube)', type: 'url' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'url' },
          },
        },
      ],
    }),
    // Legacy fields kept so existing documents don't break in Studio
    defineField({
      name: 'projectImages',
      title: 'Project Images (legacy)',
      type: 'array',
      hidden: true,
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        },
      ],
    }),
    defineField({
      name: 'videos',
      title: 'Videos (legacy)',
      type: 'array',
      hidden: true,
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'url', title: 'URL', type: 'url' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'year' },
  },
})
