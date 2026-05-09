'use client'

import { FormEvent, useState } from 'react'

export function SearchBar({ onSearch }: { onSearch?: (q: string) => void }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (onSearch && query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-10 pr-4 py-2 border border-glass-border rounded-full bg-glass-fill backdrop-blur-md text-white placeholder:text-white/40 focus:outline-none focus:border-blue transition-colors"
        placeholder="Ask anything..."
      />
    </form>
  )
}
