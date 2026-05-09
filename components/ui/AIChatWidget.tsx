'use client'

import { useState } from 'react'
import { GlassCard } from './GlassCard'

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: 'Hi! I am the RDEC Campus AI. How can I help you today?' }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: input }])
    setInput('')
    
    // Stub response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: 'This is a stub response. The AI integration will be built in Phase 9.' }])
    }, 1000)
  }

  const suggestedPrompts = [
    "When is Syntaxis 2026?",
    "Who is the Campus Mantri?",
    "Upcoming placements"
  ]

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-teal rounded-full flex items-center justify-center text-bg-deep shadow-[0_0_20px_var(--glow-teal)] hover:scale-110 transition-transform z-50"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <GlassCard glow="teal" className="p-0 flex flex-col h-[480px] overflow-hidden">
            <div className="p-4 border-b border-glass-border bg-bg-mid/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-bg-deep font-bold">AI</div>
              <div>
                <div className="text-white font-medium">Campus Advisor</div>
                <div className="text-[10px] text-teal">Online</div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div key={i} className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue text-white ml-auto rounded-tr-sm' : 'bg-glass-fill text-white mr-auto rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="p-3 bg-bg-mid/30">
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestedPrompts.map(prompt => (
                  <button 
                    key={prompt}
                    onClick={() => {
                      setInput(prompt)
                    }}
                    className="text-[10px] bg-glass-fill hover:bg-glass-fill-hover text-white px-2 py-1 rounded-full border border-glass-border transition-colors whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-glass-fill border border-glass-border rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-teal transition-colors"
                />
                <button onClick={handleSend} className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-bg-deep flex-shrink-0 hover:bg-teal/90 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  )
}
