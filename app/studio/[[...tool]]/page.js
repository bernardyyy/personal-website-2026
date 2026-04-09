'use client'

import { notFound } from 'next/navigation'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export default function StudioPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  return <NextStudio config={config} />
}
