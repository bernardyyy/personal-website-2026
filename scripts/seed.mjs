import { createClient } from '@sanity/client'
import { readFileSync, existsSync, createReadStream } from 'fs'
import { join, basename } from 'path'

// Read .env.local manually
const envPath = '/Users/bernardgerber/Downloads/Works/website 2026/portfolio/.env.local'
const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_API_TOKEN,
  useCdn: false,
})

const PROJECTS_BASE = '/Users/bernardgerber/Desktop/Ber/website_v2-main'
const projects = JSON.parse(
  readFileSync('/Users/bernardgerber/Desktop/Ber/website_v2-main/personal-website/src/data/projects.json', 'utf-8')
)

// Cache uploaded assets to avoid re-uploading the same file
const uploadCache = {}

async function uploadImage(relativePath) {
  if (uploadCache[relativePath]) return uploadCache[relativePath]

  const fullPath = join(PROJECTS_BASE, relativePath)
  if (!existsSync(fullPath)) {
    console.warn(`  ⚠ File not found: ${fullPath}`)
    return null
  }

  const filename = basename(fullPath)
  const stream = createReadStream(fullPath)
  const asset = await client.assets.upload('image', stream, { filename })
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  uploadCache[relativePath] = ref
  return ref
}

async function seedProject(project, order) {
  console.log(`\nSeeding: ${project.title}`)

  // --- Images: ensure cover is first ---
  const mediaPaths = (project.media || [])
    .filter(m => m.type === 'image')
    .map(m => m.url)

  const coverPath = project.coverImage
  if (coverPath) {
    if (!mediaPaths.includes(coverPath)) {
      mediaPaths.unshift(coverPath)
    } else if (mediaPaths[0] !== coverPath) {
      mediaPaths.splice(mediaPaths.indexOf(coverPath), 1)
      mediaPaths.unshift(coverPath)
    }
  }

  const projectImages = []
  for (const path of mediaPaths) {
    process.stdout.write(`  Uploading ${basename(path)}... `)
    const img = await uploadImage(path)
    if (img) {
      projectImages.push({ ...img, _key: Math.random().toString(36).slice(2) })
      console.log('✓')
    }
  }

  // --- Videos ---
  const videos = (project.media || [])
    .filter(m => m.type === 'vimeo')
    .map(m => ({
      _key: m.videoId,
      url: `https://vimeo.com/${m.videoId}`,
      title: '',
    }))

  // --- Credits ---
  const credits = (project.collaboration || []).map((c, i) => ({
    _key: `credit_${i}`,
    name: c.name,
    role: c.role || '',
  }))

  // --- Categories ---
  const category = (project.category || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  // --- Year (handle "2022—" etc.) ---
  const year = parseInt(project.year) || undefined

  const doc = {
    _type: 'project',
    name: project.title,
    slug: { _type: 'slug', current: project.slug },
    order,
    description: Array.isArray(project.description)
      ? project.description.join('\n\n')
      : project.description || '',
    category,
    year,
    credits,
    projectImages,
    videos,
  }

  await client.create(doc)
  console.log(`  ✓ Created "${project.title}"`)
}

async function main() {
  console.log('Starting Sanity seed...\n')
  console.log(`Project ID: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`Dataset: ${env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`)

  for (let i = 0; i < projects.length; i++) {
    await seedProject(projects[i], i + 1)
  }

  console.log('\n✅ All projects seeded!')
}

main().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
