import Link from 'next/link'
import Clock from './Clock'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black px-[30px] py-[30px]">
      {/* Desktop: 3-column layout mirroring main content */}
      <div className="hidden md:flex items-center font-montreal text-[12px] text-white tracking-[-0.48px] leading-normal">
        <Link href="/" className="w-[330px] shrink-0 text-white/80 hover:text-white transition-colors">
          Bernard Gerber
        </Link>
        <div className="w-[370px] shrink-0" />
        <div className="flex items-center justify-between flex-1">
          <Clock />
          <Link href="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between font-montreal text-[12px] text-white tracking-[-0.48px] leading-normal">
        <Link href="/" className="text-white/80 hover:text-white transition-colors">Bernard Gerber</Link>
        <Link href="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
      </div>
    </header>
  )
}
