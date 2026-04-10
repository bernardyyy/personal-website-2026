import { defineField, defineType } from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Bio (Homepage left column)',
      type: 'text',
      rows: 8,
    }),
    defineField({
      name: 'workExperience',
      title: 'Work Experience',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'company', title: 'Company', type: 'string' }),
            defineField({ name: 'role', title: 'Role', type: 'string' }),
            defineField({ name: 'period', title: 'Period', type: 'string', description: 'e.g. 2023 – 2024' }),
          ],
          preview: {
            select: { title: 'company', subtitle: 'role' },
          },
        },
      ],
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Service', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'description' },
          },
        },
      ],
    }),
    defineField({
      name: 'press',
      title: 'Press',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'institution', title: 'Institution', type: 'string' }),
            defineField({ name: 'degree', title: 'Degree / Course', type: 'string' }),
            defineField({ name: 'period', title: 'Period', type: 'string', description: 'e.g. 2022 – 2025' }),
          ],
          preview: {
            select: { title: 'institution', subtitle: 'degree' },
          },
        },
      ],
    }),
  ],
})
