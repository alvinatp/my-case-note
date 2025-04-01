import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyCaseNote',
  description: 'Up-to-date Resources for Case Managers',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
