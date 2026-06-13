'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
      if (error) console.error(error)
      setLeaders(data || [])
      setLoading(false)
    }
    fetchLeaderboard()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-lg text-gray-400 animate-pulse">Loading leaderboard...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📐</span>
          <span className="text-xl font-bold text-blue-600">MathPractice</span>
        </div>
        <a href="/" className="text-sm text-blue-600 font-medium hover:underline">← Back to Home</a>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
         <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-extrabold text-gray-900">Leaderboard</h1>
          <p className="text-gray-700 mt-2 text-base font-medium">Top performers ranked by correct answers</p>
        </div>

        {/* Top 3 Podium */}
        {leaders.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-12">

            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <img src={leaders[1].avatar || 'https://www.gravatar.com/avatar/?d=mp'} className="w-14 h-14 rounded-full border-4 border-gray-300 mb-2" />
              <p className="font-bold text-gray-700 text-sm">{leaders[1].name?.split(' ')[0] || 'Anonymous'}</p>
              <p className="text-gray-600 text-xs font-semibold">{leaders[1].total_correct} correct</p>
              <div className="bg-gray-200 w-24 h-16 rounded-t-xl flex items-center justify-center mt-2">
                <span className="text-2xl">🥈</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <img src={leaders[0].avatar || 'https://www.gravatar.com/avatar/?d=mp'} className="w-16 h-16 rounded-full border-4 border-yellow-400 mb-2" />
              <p className="font-bold text-gray-800 text-sm">{leaders[0].name?.split(' ')[0] || 'Anonymous'}</p>
              <p className="text-gray-600 text-xs font-semibold">{leaders[0].total_correct} correct</p>
              <div className="bg-yellow-400 w-24 h-24 rounded-t-xl flex items-center justify-center mt-2">
                <span className="text-3xl">🥇</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <img src={leaders[2].avatar || 'https://www.gravatar.com/avatar/?d=mp'} className="w-14 h-14 rounded-full border-4 border-orange-300 mb-2" />
              <p className="font-bold text-gray-700 text-sm">{leaders[2].name?.split(' ')[0] || 'Anonymous'}</p>
              <p className="text-gray-600 text-xs font-semibold">{leaders[2].total_correct} correct</p>
              <div className="bg-orange-300 w-24 h-12 rounded-t-xl flex items-center justify-center mt-2">
                <span className="text-2xl">🥉</span>
              </div>
            </div>

          </div>
        )}

        {/* Full List */}
        {leaders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500 text-lg">No attempts yet!</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to attempt a quiz and claim the top spot.</p>
            <a href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm">
              Start Practicing →
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Student</div>
              <div className="col-span-2 text-center">Attempted</div>
              <div className="col-span-2 text-center">Correct</div>
              <div className="col-span-2 text-center">Accuracy</div>
            </div>

            {/* Table Rows */}
            {leaders.map((leader, index) => (
              <div key={index} className={`grid grid-cols-12 px-6 py-4 items-center border-b border-gray-100 hover:bg-gray-50 transition
                ${index === 0 ? 'bg-yellow-50' : ''}
              `}>

                {/* Rank */}
                <div className="col-span-1 font-bold text-gray-800">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>

                {/* Student */}
                <div className="col-span-5 flex items-center gap-3">
                  <img
                    src={leader.avatar || 'https://www.gravatar.com/avatar/?d=mp'}
                    alt="avatar"
                    className="w-9 h-9 rounded-full border border-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{leader.name || 'Anonymous'}</p>
                  </div>
                </div>

                {/* Attempted */}
                <div className="col-span-2 text-center text-gray-800 text-sm font-semibold">
                  {leader.total_attempted}
                </div>

                {/* Correct */}
                <div className="col-span-2 text-center text-blue-600 font-bold text-sm">
                  {leader.total_correct}
                </div>

                {/* Accuracy */}
                <div className="col-span-2 text-center">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full
                    ${leader.accuracy >= 80 ? 'bg-green-100 text-green-600' :
                      leader.accuracy >= 50 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-500'}
                  `}>
                    {leader.accuracy}%
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}