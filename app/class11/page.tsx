'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Class11() {
  const [chapters, setChapters] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('chapters')
      .select('*')
      .eq('class', 11)
      .order('sort_order', { ascending: true })
      .then(({ data }) => setChapters(data || []))
  }, [])

  const chapterIcons: { [key: string]: string } = {
    'Sets': '🔢',
    'Relations and Functions': '🔗',
    'Trigonometric Functions': '📐',
    'Complex Numbers': '🔮',
    'Complex Numbers and Quadratic Equations': '🔮',
    'Quadratic Equations': '📊',
    'Linear Inequalities': '📉',
    'Permutations and Combinations': '🔄',
    'Permutation and Combination': '🔄',
    'Binomial Theorem': '🔁',
    'Sequences and Series': '🔢',
    'Straight Lines': '📏',
    'Conic Sections': '⭕',
    'Introduction to Three Dimensional Geometry': '📦',
    'Limits and Derivatives': '∞',
    'Statistics': '📈',
    'Probability': '🎲',
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">M</div>
            <span className="text-xl font-bold text-gray-900">MathPractice</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/class12">
              <button className="text-sm font-medium text-gray-600 hover:text-purple-600 transition">
                Class 12 →
              </button>
            </a>
            <a href="/">
              <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Home
              </button>
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span>📚</span>
            <span>NCERT Class 11 Mathematics</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Class 11 <span className="text-blue-600">Chapters</span>
          </h1>
          <p className="text-gray-500 text-lg">Select a chapter to start practicing MCQs</p>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <a href={`/quiz/${chapter.id}`} key={chapter.id}>
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg cursor-pointer transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center text-xl">
                    {chapterIcons[chapter.name] || '📘'}
                  </div>
                  <span className="text-xs font-bold text-blue-400">Chapter {index + 1}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-base group-hover:text-blue-600 transition leading-tight mb-2">
                  {chapter.name}
                </h3>
                <p className="text-sm text-blue-500 font-semibold">Start Quiz →</p>
              </div>
            </a>
          ))}
        </div>

      </div>

    </main>
  )
}