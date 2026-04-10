import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Bernard Gerber',
  description: 'Brazilian multidisciplinary designer based in Lisbon, Portugal.',
  openGraph: {
    title: 'Bernard Gerber',
    type: 'website',
    url: 'https://www.gerberworks.xyz',
    images: [{ url: '/og_img.jpg' }],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen px-[30px]">
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
