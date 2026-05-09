import { ReactNode } from 'react'
import { NavBar } from '@/components/ui/NavBar'
import { AIChatWidget } from '@/components/ui/AIChatWidget'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar transparent={true} />
      <main className="min-h-screen">
        {children}
      </main>
      <AIChatWidget />
    </>
  )
}
