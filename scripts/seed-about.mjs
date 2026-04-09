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

const about = {
  _type: 'about',
  bio: `I'm a Brazilian multidisciplinary designer based in Lisbon, Portugal.

Over the past years, I've been crafting visual identities and digital design systems for a range of companies, helping them build clear, thoughtful, and lasting visual languages.

I believe good design should be functional at its core and culturally aware, shaped by the world we live in. This comes from strong research and a close alignment with strategy, ensuring that every decision is intentional, and relevant.

When I'm not designing, you'll probably find me riding my bike, listening to NTS Radio 24/7, or drinking mate.

Say hi on LinkedIn or check what I'm collecting on Are.na.

And don't forget to follow along on Instagram — or drop a cool email at bernard@gerberworks.xyz.`,
  workExperience: [
    { _key: 'we1', company: 'Praia Irmão', role: 'Graphic Designer', period: '2025 – 2026' },
    { _key: 'we2', company: 'Bernard Gerber', role: 'Independent Designer', period: '2024 – Present' },
    { _key: 'we3', company: 'Aprender Design', role: 'Graphic Designer', period: '2024 – 2024' },
    { _key: 'we4', company: 'Duck Design Studio', role: 'Graphic Designer', period: '2023 – 2024' },
    { _key: 'we5', company: 'Wunderman Thompson', role: 'Visual Designer Intern', period: '2021 – 2022' },
  ],
  services: [
    { _key: 's1', name: 'Visual Identity' },
    { _key: 's2', name: 'Campaign' },
    { _key: 's3', name: 'Editorial Design' },
    { _key: 's4', name: 'Motion' },
    { _key: 's5', name: 'Digital Design' },
  ],
  press: [
    { _key: 'p1', title: 'Behance Gallery - Graphic Design', url: 'https://www.behance.net/gallery/147637755/Flow-Brand' },
    { _key: 'p2', title: 'Criacura', url: 'https://www.gerberworks.xyz/about' },
    { _key: 'p3', title: 'Type Crit Crew — #13 — Plau Design', url: 'https://www.youtube.com/watch?v=qB4iltSCY7Q&list=LL&index=18' },
    { _key: 'p4', title: 'Talk — Semana do Design IFSul 2024', url: 'https://www.instagram.com/p/DC2hvfvsvmj/?utm_source=ig_web_copy_link' },
    { _key: 'p5', title: 'Talk — a designer at the end of…', url: 'https://www.belasartes.ulisboa.pt/a-designer-at-the-end-of-2/' },
    { _key: 'p6', title: 'Book review — Emprecariat', url: 'https://dissenyobert.com/emprecariado-ninguem-esta-a-salvo-todo-mundo-e-empreendedor/' },
    { _key: 'p7', title: 'Bronze Awards ADCE — Art Directors Club of Europe', url: 'https://www.oneclub.org/awards/adceuropestudent/-award/60916/coura-naturalmente//' },
  ],
  education: [
    { _key: 'e1', institution: 'Faculty of Fine Arts of Lisbon', degree: "Bachelor's Degree — Communication Design", period: '2022 – 2025' },
    { _key: 'e2', institution: 'Aprender Design', degree: 'Visual Design for Digital Products', period: '2026' },
  ],
}

async function main() {
  // Delete existing about doc if any
  const existing = await client.fetch(`*[_type == "about"][0]._id`)
  if (existing) {
    await client.delete(existing)
    console.log('Deleted existing about document')
  }

  await client.create(about)
  console.log('✅ About document created!')
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })
