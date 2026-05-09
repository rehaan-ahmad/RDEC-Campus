import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-deep p-4">
      {/* Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
