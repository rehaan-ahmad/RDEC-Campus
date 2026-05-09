import type { ReactNode } from 'react'
import { Playfair_Display, Syne, JetBrains_Mono } from 'next/font/google'
import '../styles/globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata = {
  title: 'RDEC Campus',
  description: 'RDEC Campus — Official Student Platform',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${playfair.variable} ${syne.variable} ${jetbrains.variable} font-body page-bg text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
