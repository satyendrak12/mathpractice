'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [attempts, setAttempts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: sessionData } = await supabase.auth.getSession()
      const currentUser = sessionData.session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        const { data } = await supabase
          .from('attempts')
          .select('*, questions(chapter_id, chapters(name, class))')
          .eq('user_id', currentUser.id)
          .order('attempted_at', { ascending: false })
        setAttempts(data || [])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500">Loading dashboard...</p>
    </div>
  )

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        <p className="text-xl text-gray-700 mb-4">Please login to view your dashboard</p>
        <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
          Login
        </a>
      </div>
    </div>
  )

  const totalAttempts = attempts.length
  const correctAttempts = attempts.filter(a => a.is_correct).length
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0

  // Group by chapter
  const chapterMap: any = {}
  attempts.forEach(a => {
    const chapterName = a.questions?.chapters?.name || 'Unknown'
    const className = a.questions?.chapters?.class || ''
    if (!chapterMap[chapterName]) {
      chapterMap[chapterName] = { name: chapterName, class: className, total: 0, correct: 0 }
    }
    chapterMap[chapterName].total++
    if (a.is_correct) chapterMap[chapterName].correct++
  })
  const chapterStats = Object.values(chapterMap)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📐</span>
          <span className="text-xl font-bold text-blue-600">MathPractice</span>
        </div>
        <a href="/" className="text-blue-600 font-semibold hover:underline">← Back to Home</a>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={user.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'}
            alt="avatar"
            className="w-16 h-16 rounded-full border-4 border-blue-200"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {user.user_metadata?.full_name || user.email}
            </h1>
            <p className="text-gray-500">Student Dashboard</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{totalAttempts}</p>
            <p className="text-gray-500 text-sm mt-1">Questions Attempted</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{correctAttempts}</p>
            <p className="text-gray-500 text-sm mt-1">Correct Answers</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{accuracy}%</p>
            <p className="text-gray-500 text-sm mt-1">Overall Accuracy</p>
          </div>
        </div>

        {/* Chapter wise performance */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Chapter-wise Performance</h2>
        {chapterStats.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500">No attempts yet! Start practicing to see your stats here.</p>
            <a href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Start Practicing →
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {chapterStats.map((chapter: any, index) => (
              <div key={index} className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg mr-2 ${chapter.class === 11 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                      Class {chapter.class}
                    </span>
                    <span className="font-bold text-gray-800">{chapter.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-500">
                    {chapter.correct}/{chapter.total} correct
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.round((chapter.correct / chapter.total) * 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.round((chapter.correct / chapter.total) * 100)}% accuracy
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}