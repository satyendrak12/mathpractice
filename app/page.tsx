'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [chapters, setChapters] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    supabase
      .from('chapters')
      .select('*')
      .order('class', { ascending: true })
      .then(({ data }) => setChapters(data || []))
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  const class11 = chapters.filter(c => c.class === 11)
  const class12 = chapters.filter(c => c.class === 12)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📐</span>
          <span className="text-xl font-bold text-blue-600">MathPractice</span>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <a href="/leaderboard">
                <button className="bg-purple-50 text-purple-600 font-semibold px-4 py-2 rounded-lg hover:bg-purple-100 transition text-sm">
                  🏆 Leaderboard
                </button>
              </a>
              <a href="/dashboard">
                <button className="bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition text-sm">
                  Dashboard
                </button>
              </a>
              <div className="flex items-center gap-2 border-l pl-3">
                <img
                  src={user.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border-2 border-blue-200"
                />
                <span className="text-gray-700 font-medium hidden md:block">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-500 font-semibold px-4 py-2 rounded-lg hover:bg-red-100 transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <a href="/login">
              <button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                Login / Sign Up
              </button>
            </a>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center py-16 px-4">
        <div className="inline-block bg-blue-100 text-blue-600 font-semibold px-4 py-1 rounded-full text-sm mb-4">
          Free MCQ Practice Platform
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Master Class 11 & 12 <span className="text-blue-600">Maths</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
          Chapter-wise MCQ tests with instant results and explanations. Practice daily and ace your board exams!
        </p>
        {!user && (
          <a href="/login">
            <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-lg shadow-lg">
              Start Practicing Free →
            </button>
          </a>
        )}
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-3xl font-bold text-blue-600">10+</p>
            <p className="text-gray-500 text-sm mt-1">Chapters</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-3xl font-bold text-purple-600">100+</p>
            <p className="text-gray-500 text-sm mt-1">Questions</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-3xl font-bold text-green-600">Free</p>
            <p className="text-gray-500 text-sm mt-1">Forever</p>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="max-w-4xl mx-auto px-4 pb-16">

        {/* Class 11 */}
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-blue-600 text-white font-bold px-3 py-1 rounded-lg text-sm">Class 11</span>
          <h2 className="text-2xl font-bold text-gray-800">Chapters</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {class11.map(chapter => (
            <a href={`/quiz/${chapter.id}`} key={chapter.id}>
              <div className="bg-white rounded-2xl shadow hover:shadow-md p-6 hover:bg-blue-50 cursor-pointer transition group">
                <div className="text-3xl mb-3">📘</div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">{chapter.name}</h3>
                <p className="text-sm text-blue-500 mt-2 font-medium">Start Quiz →</p>
              </div>
            </a>
          ))}
        </div>

        {/* Class 12 */}
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-purple-600 text-white font-bold px-3 py-1 rounded-lg text-sm">Class 12</span>
          <h2 className="text-2xl font-bold text-gray-800">Chapters</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {class12.map(chapter => (
            <a href={`/quiz/${chapter.id}`} key={chapter.id}>
              <div className="bg-white rounded-2xl shadow hover:shadow-md p-6 hover:bg-purple-50 cursor-pointer transition group">
                <div className="text-3xl mb-3">📗</div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition">{chapter.name}</h3>
                <p className="text-sm text-purple-500 mt-2 font-medium">Start Quiz →</p>
              </div>
            </a>
          ))}
        </div>

      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-400 text-sm border-t">
        Made with ❤️ for Class 11 & 12 Math Students
      </div>

    </main>
  )
}