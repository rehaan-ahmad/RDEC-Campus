'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NotificationBadge } from './NotificationBadge'
import { SearchBar } from './SearchBar'

export function NavBar({ transparent = false }: { transparent?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const bgClass = (transparent && !isScrolled && !mobileMenuOpen) ? 'bg-transparent border-transparent' : 'bg-bg-mid/80 backdrop-blur-[20px] border-b border-glass-border shadow-sm'
  const transformClass = isHidden ? '-translate-y-full' : 'translate-y-0'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass} ${transformClass}`}>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue to-teal opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-2">
                <span className="text-blue">RDEC</span> Campus
              </Link>
              <div className="hidden md:flex space-x-1">
                <Link href="/events" className="px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-glass-fill transition-colors">Events</Link>
                <Link href="/team" className="px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-glass-fill transition-colors">Team Wall</Link>
                <Link href="/news" className="px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-glass-fill transition-colors">News</Link>
                <Link href="/bulletin" className="px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-glass-fill transition-colors">Bulletin</Link>
                <Link href="/clubs" className="px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-glass-fill transition-colors">Clubs</Link>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="w-64">
                <SearchBar />
              </div>
              <NotificationBadge />
              <Link href="/login" className="px-4 py-2 rounded-[var(--r-button)] bg-blue/10 text-blue font-medium text-sm hover:bg-blue/20 transition-colors border border-blue/20">
                Sign In
              </Link>
            </div>
            <div className="flex items-center md:hidden gap-4">
              <NotificationBadge />
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white/80 hover:text-white"
                aria-label="Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {mobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </>
                  ) : (
                    <>
                      <line x1="4" x2="20" y1="12" y2="12" />
                      <line x1="4" x2="20" y1="6" y2="6" />
                      <line x1="4" x2="20" y1="18" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-bg-deep/95 backdrop-blur-xl pt-20 pb-6 px-4 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <SearchBar />
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/events" onClick={() => setMobileMenuOpen(false)} className="px-4 py-4 text-lg font-medium border-b border-glass-border">Events</Link>
              <Link href="/team" onClick={() => setMobileMenuOpen(false)} className="px-4 py-4 text-lg font-medium border-b border-glass-border">Team Wall</Link>
              <Link href="/news" onClick={() => setMobileMenuOpen(false)} className="px-4 py-4 text-lg font-medium border-b border-glass-border">News</Link>
              <Link href="/bulletin" onClick={() => setMobileMenuOpen(false)} className="px-4 py-4 text-lg font-medium border-b border-glass-border">Bulletin</Link>
              <Link href="/clubs" onClick={() => setMobileMenuOpen(false)} className="px-4 py-4 text-lg font-medium border-b border-glass-border">Clubs</Link>
              <Link href="/deals" onClick={() => setMobileMenuOpen(false)} className="px-4 py-4 text-lg font-medium border-b border-glass-border">Deals</Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-4 text-lg font-medium text-blue mt-4">Sign In to Dashboard</Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
