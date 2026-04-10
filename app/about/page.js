import Link from 'next/link'
import { client } from '../../sanity/client'
import { aboutQuery } from '../../sanity/queries'

export const revalidate = 60

export default async function AboutPage() {
  const about = await client.fetch(aboutQuery)

  const workExperience = about?.workExperience || []
  const services = about?.services || []
  const press = about?.press || []
  const education = about?.education || []

  return (
    <main className="pt-[104px] pb-[30px]">
      {/* Back link */}
      <Link
        href="/"
        className="block font-montreal text-[14px] text-white/80 tracking-[-0.56px] leading-normal mb-[37px] hover:text-white transition-colors"
      >
        ↵ Back
      </Link>

      {/* Sections */}
      <div className="flex flex-col gap-[109px] max-w-[1030px]">
        {/* Work Experience */}
        <Section title="Work Experience">
          {workExperience.map((item, i) => (
            <ExperienceItem key={i} title={item.company} subtitle={`${item.role} • ${item.period}`} />
          ))}
        </Section>

        {/* Services */}
        <Section title="Services">
          {services.map((item, i) => (
            <ExperienceItem key={i} title={item.name} />
          ))}
        </Section>

        {/* Press */}
        <Section title="Press">
          {press.map((item, i) => (
            <div key={i} className="shrink-0 w-full">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group font-exposure text-[16px] text-white tracking-[-0.64px] leading-normal"
                >
                  <span className="group-hover:font-exposure-bold">{item.title}</span>
                </a>
              ) : (
                <p className="font-exposure text-[16px] text-white tracking-[-0.64px] leading-normal">
                  {item.title}
                </p>
              )}
            </div>
          ))}
        </Section>

        {/* Education */}
        <Section title="Education">
          {education.map((item, i) => (
            <ExperienceItem
              key={i}
              title={item.institution}
              subtitle={`${item.degree} • ${item.period}`}
            />
          ))}
        </Section>
      </div>

    </main>
  )
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-[20px]">
      <p className="font-exposure text-[16px] text-white tracking-[-0.64px] leading-normal shrink-0 md:w-[calc(100%-350px)]">
        {title}
      </p>
      <div className="flex flex-col gap-[20px] w-full md:w-[330px] shrink-0">
        {children}
      </div>
    </div>
  )
}

function ExperienceItem({ title, subtitle }) {
  return (
    <div className="flex flex-col shrink-0 w-full">
      <p className="font-exposure text-[16px] text-white tracking-[-0.64px] leading-normal">
        {title}
      </p>
      {subtitle && (
        <p className="font-montreal text-[14px] text-white/80 tracking-[-0.56px] leading-normal">
          {subtitle}
        </p>
      )}
    </div>
  )
}
