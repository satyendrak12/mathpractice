'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface Message {
  role: 'user' | 'ai'
  text: string
}

export default function ChatBot() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Hide chatbot on quiz pages
  if (pathname?.startsWith('/quiz')) return null
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hi! I am your AI Maths Teacher 🤖 Ask me any Class 11 or 12 Maths doubt!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.solution }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Please try again!' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">

          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="font-bold text-sm">AI Maths Teacher</p>
                <p className="text-xs text-blue-200">Class 11 & 12 Doubt Solver</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-blue-200 font-bold text-xl"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap
                  ${msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl rounded-bl-none text-sm">
                  🤔 Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your doubt..."
              className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 text-gray-800"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm"
            >
              Send
            </button>
          </div>

        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-2xl hover:bg-blue-700 transition flex items-center justify-center text-3xl z-50"
      >
        {open ? '✕' : '🤖'}
      </button>
    </>
  )
}