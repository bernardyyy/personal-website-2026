import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Bernard Gerber',
  description: 'Brazilian multidisciplinary designer based in Lisbon, Portugal.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen px-[30px]">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
