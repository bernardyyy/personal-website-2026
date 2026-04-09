import Link from 'next/link'
import Image from 'next/image'
import { client } from '../sanity/client'
import { projectsQuery } from '../sanity/queries'
import { urlFor } from '../sanity/imageUrl'
import Bio from '../components/Bio'

export const revalidate = 60

export default async function HomePage() {
  const projects = await client.fetch(projectsQuery)

  return (
    <main className="pt-[80px] md:pt-[104px] pb-[30px]">
      <div className="flex">
        {/* Left: sticky bio */}
        <aside className="hidden md:block w-[330px] shrink-0 sticky top-[104px] self-start">
          <Bio />
        </aside>

        {/* Spacer */}
        <div className="hidden md:block w-[370px] shrink-0" />

        {/* Right: project list */}
        <div className="w-full md:flex-1 flex flex-col gap-[10px] md:gap-[20px]">
          {/* Mobile bio */}
          <div className="md:hidden mb-[14px]">
            <Bio mobile />
          </div>

          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/work/${project.slug.current}`}
              className="flex flex-col gap-[6px] md:gap-[8px] group"
            >
              {/* Cover image */}
              <div className="relative w-full aspect-[680/445] overflow-hidden rounded-sm">
                {project.coverImage ? (
                  <Image
                    src={urlFor(project.coverImage).width(1360).height(890).quality(90).url()}
                    alt={project.coverImage.alt || project.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 680px"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900" />
                )}
              </div>

              {/* Title + category row */}
              <div className="flex items-center justify-between">
                <span className="font-exposure text-[14px] md:text-[16px] text-white tracking-[-0.56px] md:tracking-[-0.64px] leading-normal group-hover:font-exposure-bold">
                  {project.name}
                </span>
                <span className="font-montreal text-[12px] md:text-[14px] text-white tracking-[-0.48px] md:tracking-[-0.56px] leading-normal">
                  {project.category?.join(', ')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
