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

  const chapterIcons: { [key: string]: string } = {
    'Sets': '🔢',
    'Trigonometric Functions': '📐',
    'Permutation and Combination': '🔄',
    'Complex Numbers': '🔮',
    'Quadratic Equations': '📊',
    'Straight Lines': '📏',
    'Limits and Derivatives': '∞',
    'Statistics': '📈',
    'Probability': '🎲',
    'Integration': '∫',
    'Matrices': '🔲',
    'Determinants': '🔑',
    'Differentiation': '📉',
    'Application of Derivatives': '🎯',
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
            {user ? (
              <>
                <a href="/doubt">
                  <button className="bg-green-50 text-green-600 font-semibold px-3 py-2 rounded-lg hover:bg-green-100 transition text-sm">
                    🤖 AI Solver
                  </button>
                </a>
                <a href="/flashcards">
                  <button className="bg-yellow-50 text-yellow-600 font-semibold px-3 py-2 rounded-lg hover:bg-yellow-100 transition text-sm">
                    🃏 Flashcards
                  </button>
                </a>
                <a href="/leaderboard">
                  <button className="bg-purple-50 text-purple-600 font-semibold px-3 py-2 rounded-lg hover:bg-purple-100 transition text-sm">
                    🏆 Leaderboard
                  </button>
                </a>
                <a href="/dashboard">
                  <button className="bg-blue-50 text-blue-600 font-semibold px-3 py-2 rounded-lg hover:bg-blue-100 transition text-sm">
                    📊 Dashboard
                  </button>
                </a>
                <div className="w-px h-6 bg-gray-200" />
                <img
                  src={user.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-blue-100"
                />
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user.user_metadata?.full_name?.split(' ')[0] || 'Student'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login">
                  <button className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                    Login
                  </button>
                </a>
                <a href="/login">
                  <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Get Started Free
                  </button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <span>✨</span>
          <span>Free MCQ Practice Platform for Class 11 & 12</span>
        </div>
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Master Maths with
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> AI-Powered </span>
          Practice
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Chapter-wise MCQ tests, instant AI doubt solving, and detailed performance analytics — everything you need to ace your board exams!
        </p>
        <div className="flex items-center justify-center gap-4">
          {!user ? (
            <>
              <a href="/login">
                <button className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition text-lg shadow-lg shadow-blue-200">
                  Start Practicing Free →
                </button>
              </a>
              <a href="#chapters">
                <button className="text-gray-600 font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition text-lg">
                  View Chapters
                </button>
              </a>
            </>
          ) : (
            <a href="#chapters">
              <button className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition text-lg shadow-lg shadow-blue-200">
                Continue Practicing →
              </button>
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-4 gap-6">
          {[
            { number: '15+', label: 'Chapters', icon: '📚', color: 'blue' },
            { number: '175+', label: 'Questions', icon: '❓', color: 'purple' },
            { number: '30s', label: 'Timer per Question', icon: '⏱', color: 'orange' },
            { number: 'Free', label: 'Forever', icon: '🎉', color: 'green' },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-extrabold text-gray-900">{stat.number}</div>
              <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Everything You Need to Score High</h2>
            <p className="text-gray-500">Built specifically for Class 11 & 12 Maths students</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'AI Doubt Solver', desc: 'Get instant step-by-step solutions to any maths doubt using AI' },
              { icon: '⏱', title: '30 Second Timer', desc: 'Practice under exam-like pressure with a countdown timer' },
              { icon: '📊', title: 'Performance Analytics', desc: 'Track your progress chapter-wise and identify weak areas' },
              { icon: '🏆', title: 'Leaderboard', desc: 'Compete with other students and climb the rankings' },
              { icon: '💡', title: 'Instant Explanations', desc: 'Get detailed explanations after every question' },
              { icon: '📱', title: 'Works Everywhere', desc: 'Practice on any device — mobile, tablet or desktop' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div id="chapters" className="max-w-6xl mx-auto px-6 py-16">

        {/* Class 11 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-sm">Class 11</div>
            <h2 className="text-2xl font-extrabold text-gray-900">Chapters</h2>
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-sm text-gray-400">{class11.length} chapters</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {class11.map(chapter => (
              <a href={`/quiz/${chapter.id}`} key={chapter.id}>
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-blue-400 hover:shadow-lg cursor-pointer transition group">
                  <div className="text-3xl mb-3">{chapterIcons[chapter.name] || '📘'}</div>
                  <h3 className="font-bold text-gray-800 text-base group-hover:text-blue-600 transition leading-tight">{chapter.name}</h3>
                  <p className="text-sm text-blue-500 mt-2 font-semibold">Start Quiz →</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Class 12 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl text-sm">Class 12</div>
            <h2 className="text-2xl font-extrabold text-gray-900">Chapters</h2>
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-sm text-gray-400">{class12.length} chapters</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {class12.map(chapter => (
              <a href={`/quiz/${chapter.id}`} key={chapter.id}>
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-purple-400 hover:shadow-lg cursor-pointer transition group">
                  <div className="text-3xl mb-3">{chapterIcons[chapter.name] || '📗'}</div>
                  <h3 className="font-bold text-gray-800 text-base group-hover:text-purple-600 transition leading-tight">{chapter.name}</h3>
                  <p className="text-sm text-purple-500 mt-2 font-semibold">Start Quiz →</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Score Higher?</h2>
            <p className="text-blue-100 text-lg mb-8">Join thousands of students practicing daily on MathPractice</p>
            <a href="/login">
              <button className="bg-white text-blue-600 font-bold px-10 py-4 rounded-xl hover:bg-blue-50 transition text-lg shadow-xl">
                Start Practicing Free →
              </button>
            </a>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs">M</div>
            <span className="font-bold text-gray-900">MathPractice</span>
          </div>
          <p className="text-gray-400 text-sm">Made with ❤️ for Class 11 & 12 Maths Students</p>
          <div className="flex items-center gap-4">
            <a href="/leaderboard" className="text-sm text-gray-400 hover:text-blue-600 transition">Leaderboard</a>
            <a href="/dashboard" className="text-sm text-gray-400 hover:text-blue-600 transition">Dashboard</a>
            <a href="/doubt" className="text-sm text-gray-400 hover:text-blue-600 transition">AI Solver</a>
          </div>
        </div>
      </footer>

    </main>
  )
}