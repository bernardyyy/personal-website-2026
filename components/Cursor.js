'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ringRef = useRef(null)
  const rafRef = useRef(null)
  const pos = useRef({ mouse: { x: -100, y: -100 }, ring: { x: -100, y: -100 } })

  useEffect(() => {
    const ring = ringRef.current

    const onMouseMove = (e) => {
      pos.current.mouse.x = e.clientX
      pos.current.mouse.y = e.clientY
    }

    const onMouseOver = (e) => {
      if (e.target.closest('a, button')) {
        ring.classList.add('inverted')
      } else {
        ring.classList.remove('inverted')
      }
    }

    const onMouseEnter = () => { ring.style.opacity = '1' }
    const onMouseLeave = () => { ring.style.opacity = '0' }

    const animate = () => {
      const { mouse, ring: r } = pos.current
      r.x += (mouse.x - r.x) * 0.1
      r.y += (mouse.y - r.y) * 0.1
      ring.style.left = r.x + 'px'
      ring.style.top = r.y + 'px'
      rafRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={ringRef}
      className="cursor-ring fixed top-0 left-0 pointer-events-none z-[9999] opacity-0"
    />
  )
}
