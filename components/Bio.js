'use client'

import { useState, useCallback } from 'react'

function HoverLink({ href, children, external = true }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group/link inline-flex items-baseline"
    >
      <span className="group-hover/link:font-exposure-bold">
        {children}
      </span>
    </a>
  )
}

function HoverWord({ children, emoji, href }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  const handleMouseMove = useCallback((e) => {
    setPos({ x: e.clientX, y: e.clientY })
  }, [])

  const inner = (
    <span
      className="group/word inline-flex items-baseline"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="group-hover/word:font-exposure-bold">{children}</span>
      {visible && (
        <span
          className="fixed pointer-events-none select-none z-50 leading-none text-[1.5rem]"
          style={{ left: pos.x + 16, top: pos.y - 12 }}
        >
          {emoji}
        </span>
      )}
    </span>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return inner
}

export default function Bio({ mobile = false }) {
  return (
    <div className={`font-exposure text-white leading-normal flex flex-col gap-[1em] ${mobile ? 'text-[14px] tracking-[-0.56px]' : 'text-[16px] tracking-[-0.64px]'}`}>
      <p>
        I'm a <HoverWord emoji="🇧🇷">Brazilian</HoverWord> multidisciplinary designer
        based in Lisbon, <HoverWord emoji="🇵🇹">Portugal</HoverWord>.
      </p>
      <p>
        Over the past years, I've been crafting visual identities and digital design
        systems for a range of companies, helping them build clear, thoughtful, and
        lasting visual languages.
      </p>
      <p>
        I believe good design should be functional at its core and culturally aware,
        shaped by the world we live in. This comes from strong research and a close
        alignment with strategy, ensuring that every decision is intentional, and
        relevant.
      </p>
      <p>
        When I'm not designing, you'll probably find me riding my{' '}
        <HoverWord emoji="🚴‍♂️" href="https://www.strava.com/athletes/50415101">
          bike
        </HoverWord>
        , listening to <HoverWord emoji="📻">NTS</HoverWord> Radio 24/7, or drinking{' '}
        <HoverWord emoji="🧉">mate</HoverWord>.
      </p>
      <p>
        Say hi on{' '}
        <HoverLink href="https://www.linkedin.com/in/bernardyy">LinkedIn</HoverLink>{' '}
        or check what I'm collecting on{' '}
        <HoverLink href="https://www.are.na/bernard-gerber/channels">Are.na</HoverLink>.
      </p>
      <p>
        And don't forget to follow along on{' '}
        <HoverLink href="https://www.instagram.com/bernard.gerber/">Instagram</HoverLink>{' '}
        — or drop a cool email at{' '}
        <HoverLink href="mailto:bernard@gerberworks.xyz" external={false}>
          bernard@gerberworks.xyz
        </HoverLink>
        .
      </p>
    </div>
  )
}

