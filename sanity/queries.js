import { groq } from 'next-sanity'

export const projectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    name,
    slug,
    category,
    year,
    "coverImage": projectImages[0]
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    category,
    year,
    credits,
    media,
    projectImages,
    videos
  }
`

export const otherProjectsQuery = groq`
  *[_type == "project" && slug.current != $slug] | order(order asc) [0..2] {
    name,
    slug
  }
`

export const aboutQuery = groq`
  *[_type == "about"][0] {
    bio,
    workExperience,
    services,
    press,
    education
  }
`
