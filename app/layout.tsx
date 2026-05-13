import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'Bloom Todo 🌸',
  description: 'Aplikasi todo list cantik dengan tema soft pink',
  keywords: ['todo', 'task manager', 'produktivitas'],
  manifest: '/manifest.json',
  themeColor: '#f472b6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bloom Todo',
  },
  openGraph: {
    title: 'Bloom Todo 🌸',
    description: 'Kelola tugasmu dengan gaya!',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f472b6" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={geist.className}>{children}</body>
    </html>
  )
}