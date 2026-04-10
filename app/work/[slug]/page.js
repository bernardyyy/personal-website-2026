import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '../../../sanity/client'
import { projectBySlugQuery, otherProjectsQuery } from '../../../sanity/queries'
import { urlFor } from '../../../sanity/imageUrl'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const project = await client.fetch(projectBySlugQuery, { slug })
  if (!project) return {}
  return { title: `${project.name} — Bernard Gerber` }
}

export default async function ProjectPage({ params }) {
  const { slug } = await params

  const [project, otherProjects] = await Promise.all([
    client.fetch(projectBySlugQuery, { slug }),
    client.fetch(otherProjectsQuery, { slug }),
  ])

  if (!project) notFound()

  // Build unified media list: use new `media` array if populated,
  // otherwise fall back to legacy projectImages + videos
  const mediaItems = project.media?.length
    ? project.media
    : [
        ...(project.projectImages || []).map((img) => ({ _type: 'mediaImage', image: img })),
        ...(project.videos || []).map((vid) => ({ _type: 'mediaVideo', ...vid })),
      ]

  return (
    <main className="page-enter pt-[104px] pb-[30px]">

      {/* Mobile only: Back link at the very top */}
      <Link
        href="/"
        className="md:hidden block font-montreal text-[14px] text-white/80 tracking-[-0.56px] leading-normal mb-[20px] hover:text-white transition-colors"
      >
        ↵ Back
      </Link>

      <div className="flex flex-col md:flex-row">

        {/* Mobile only: Title + Description (order-1 → appears first on mobile) */}
        <div className="md:hidden flex flex-col gap-[12px] font-exposure text-[16px] text-white tracking-[-0.64px] leading-normal mb-[20px]">
          <p className="w-1/2">{project.name}</p>
          {project.description && (
            <p className="whitespace-pre-line">{project.description}</p>
          )}
        </div>

        {/* Left: sticky sidebar — on mobile appears after gallery (order-3) */}
        <aside className="w-full md:w-[330px] shrink-0 md:sticky md:top-[104px] md:self-start flex flex-col gap-[20px] order-3 md:order-none mt-[40px] md:mt-0 mb-[40px] md:mb-0">
          <Link
            href="/"
            className="hidden md:block font-montreal text-[14px] text-white/80 tracking-[-0.56px] leading-normal hover:text-white transition-colors"
          >
            ↵ Back
          </Link>

          {/* Desktop only: Title + Description inside sidebar */}
          <div className="hidden md:flex flex-col gap-[12px] font-exposure text-[16px] text-white tracking-[-0.64px] leading-normal">
            <p>{project.name}</p>
            {project.description && (
              <p className="whitespace-pre-line">{project.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-[16px]">
            {project.year && (
              <MetaItem label="Year" value={String(project.year)} />
            )}
            {project.category?.length > 0 && (
              <MetaItem label="Category" value={project.category.join(', ')} />
            )}
            {project.credits?.length > 0 && (
              <div className="flex flex-col gap-[4px]">
                <p className="font-exposure text-[16px] text-white tracking-[-0.64px] leading-normal">
                  Credits
                </p>
                {project.credits.map((credit, i) => {
                  const label = `${credit.name}${credit.role ? ` • ${credit.role}` : ''}`
                  return credit.url ? (
                    <a
                      key={i}
                      href={credit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-montreal text-[12px] text-white/80 tracking-[-0.48px] leading-normal hover:text-white transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <p key={i} className="font-montreal text-[12px] text-white/80 tracking-[-0.48px] leading-normal">
                      {label}
                    </p>
                  )
                })}
              </div>
            )}
          </div>

          {otherProjects?.length > 0 && (
            <div className="flex flex-col gap-[4px]">
              <p className="font-exposure text-[16px] text-white tracking-[-0.64px] leading-normal">
                Other Projects
              </p>
              {otherProjects.map((p) => (
                <Link
                  key={p.slug.current}
                  href={`/work/${p.slug.current}`}
                  className="font-montreal text-[12px] text-white/80 tracking-[-0.48px] leading-normal hover:text-white transition-colors"
                >
                  {p.name} ↗
                </Link>
              ))}
            </div>
          )}
        </aside>

        {/* Spacer */}
        <div className="hidden md:block w-[370px] shrink-0" />

        {/* Right: media — on mobile appears second (order-2), after title+desc */}
        <div className="w-full md:flex-1 flex flex-col gap-[20px] order-2 md:order-none">
          {mediaItems.map((item, i) => {
            if (item._type === 'mediaImage') {
              const img = item.image ?? item
              return (
                <div key={i} className="relative w-full aspect-[680/445] overflow-hidden rounded-sm">
                  <Image
                    src={urlFor(img).width(1360).height(890).quality(90).url()}
                    alt={img.alt || `${project.name} — image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 680px"
                    priority={i === 0}
                  />
                </div>
              )
            }

            if (item._type === 'mediaVideo') {
              return (
                <div key={i} className="relative w-full aspect-video overflow-hidden rounded-sm">
                  <iframe
                    src={toEmbedUrl(item.url)}
                    title={item.title || `Video ${i + 1}`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture; muted"
                  />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </main>
  )
}

function MetaItem({ label, value }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <p className="font-exposure text-[16px] text-white tracking-[-0.64px] leading-normal">
        {label}
      </p>
      <p className="font-montreal text-[12px] text-white/80 tracking-[-0.48px] leading-normal">
        {value}
      </p>
    </div>
  )
}

function toEmbedUrl(url) {
  if (!url) return ''
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?background=1&autoplay=1&muted=1&loop=1`
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  return url
}
