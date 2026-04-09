import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const envPath = '/Users/bernardgerber/Downloads/Works/website 2026/portfolio/.env.local'
const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const idx = l.indexOf('='); return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()] })
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_API_TOKEN,
  useCdn: false,
})

async function main() {
  const projects = await client.fetch(
    `*[_type == "project" && (!defined(media) || length(media) == 0)] {
      _id, name, projectImages, videos
    }`
  )

  console.log(`Found ${projects.length} project(s) to migrate`)

  for (const project of projects) {
    const mediaItems = []
    let key = 0

    for (const img of project.projectImages || []) {
      mediaItems.push({
        _key: `migrated_img_${key++}`,
        _type: 'mediaImage',
        image: {
          _type: 'image',
          asset: img.asset,
          ...(img.hotspot ? { hotspot: img.hotspot } : {}),
          ...(img.crop ? { crop: img.crop } : {}),
          ...(img.alt ? { alt: img.alt } : {}),
        },
      })
    }

    for (const vid of project.videos || []) {
      mediaItems.push({
        _key: `migrated_vid_${key++}`,
        _type: 'mediaVideo',
        url: vid.url,
        title: vid.title || '',
      })
    }

    if (mediaItems.length === 0) {
      console.log(`  Skipping "${project.name}" — no images or videos found`)
      continue
    }

    await client.patch(project._id).set({ media: mediaItems }).commit()
    console.log(`  ✅ "${project.name}" — migrated ${mediaItems.length} item(s)`)
  }

  console.log('\nDone! Open Studio to drag and reorder media items per project.')
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })
