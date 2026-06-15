'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function FlashCards() {
  const [user, setUser] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])
  const [selectedChapter, setSelectedChapter] = useState<any>(null)
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState<'select' | 'study' | 'complete'>('select')
  const [gotIt, setGotIt] = useState<any[]>([])
  const [needPractice, setNeedPractice] = useState<any[]>([])
  const [pdf, setPdf] = useState<File | null>(null)
  const [round, setRound] = useState(1)
  const pdfRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    supabase
      .from('chapters')
      .select('*')
      .order('class', { ascending: true })
      .then(({ data }) => setChapters(data || []))
  }, [])

  async function generateFlashcards() {
    if (!selectedChapter && !pdf) return
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('chapterName', selectedChapter?.name || 'Custom Notes')
      if (pdf) formData.append('pdf', pdf)

      const response = await fetch('/api/flashcards', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()

      if (data.flashcards) {
        const cards = data.flashcards.map((card: any, index: number) => ({
          ...card,
          id: index,
          status: 'unseen'
        }))
        setFlashcards(cards)
        setCurrent(0)
        setFlipped(false)
        setGotIt([])
        setNeedPractice([])
        setRound(1)
        setStage('study')

        // Save to Supabase if logged in
        if (user && selectedChapter) {
          await supabase.from('flashcards').insert(
            cards.map((card: any) => ({
              user_id: user.id,
              chapter_id: selectedChapter.id,
              question: card.question,
              answer: card.answer,
              status: 'unseen'
            }))
          )
        }
      }
    } catch (error) {
      console.error('Error generating flashcards:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleGotIt() {
    const card = flashcards[current]
    setGotIt(prev => [...prev, card])
    moveToNext()
  }

  function handleNeedPractice() {
    const card = flashcards[current]
    setNeedPractice(prev => [...prev, card])
    moveToNext()
  }

  function moveToNext() {
    setFlipped(false)
    setTimeout(() => {
      if (current + 1 < flashcards.length) {
        setCurrent(prev => prev + 1)
      } else {
        setStage('complete')
      }
    }, 300)
  }

  function startPracticeRound() {
    setFlashcards(needPractice)
    setNeedPractice([])
    setGotIt([])
    setCurrent(0)
    setFlipped(false)
    setRound(prev => prev + 1)
    setStage('study')
  }

  function resetAll() {
    setStage('select')
    setFlashcards([])
    setSelectedChapter(null)
    setPdf(null)
    setGotIt([])
    setNeedPractice([])
    setCurrent(0)
    setFlipped(false)
    setRound(1)
  }

  const class11 = chapters.filter(c => c.class === 11)
  const class12 = chapters.filter(c => c.class === 12)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">M</div>
          <span className="text-xl font-bold text-blue-600">MathPractice</span>
        </div>
        <a href="/" className="text-sm text-blue-600 font-medium hover:underline">← Back to Home</a>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🃏</div>
          <h1 className="text-4xl font-extrabold text-gray-900">AI Flashcard Generator</h1>
          <p className="text-gray-600 mt-2 text-base font-medium">
            Pick a chapter or upload your notes — AI generates flashcards instantly!
          </p>
        </div>

        {/* SELECT STAGE */}
        {stage === 'select' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            {/* Chapter Selection */}
            <h2 className="text-lg font-bold text-gray-800 mb-4">Select a Chapter:</h2>

            <div className="mb-4">
              <p className="text-sm font-semibold text-blue-600 mb-2">Class 11</p>
              <div className="grid grid-cols-2 gap-2">
                {class11.map(chapter => (
                  <button
                    key={chapter.id}
                    onClick={() => { setSelectedChapter(chapter); setPdf(null) }}
                    className={`p-3 rounded-xl text-left text-sm font-medium border-2 transition
                      ${selectedChapter?.id === chapter.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-100 hover:border-blue-300 text-gray-700'
                      }`}
                  >
                    {chapter.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-purple-600 mb-2">Class 12</p>
              <div className="grid grid-cols-2 gap-2">
                {class12.map(chapter => (
                  <button
                    key={chapter.id}
                    onClick={() => { setSelectedChapter(chapter); setPdf(null) }}
                    className={`p-3 rounded-xl text-left text-sm font-medium border-2 transition
                      ${selectedChapter?.id === chapter.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-100 hover:border-purple-300 text-gray-700'
                      }`}
                  >
                    {chapter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* PDF Upload */}
            <div
              onClick={() => pdfRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
                ${pdf ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
            >
              <div className="text-4xl mb-2">{pdf ? '✅' : '📄'}</div>
              <p className="text-sm font-medium text-gray-600">
                {pdf ? pdf.name : 'Upload your notes PDF'}
              </p>
              <p className="text-xs text-gray-400 mt-1">AI will generate flashcards from your notes</p>
            </div>
            <input
              ref={pdfRef}
              type="file"
              accept="application/pdf"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) { setPdf(file); setSelectedChapter(null) }
              }}
              className="hidden"
            />

            <button
              onClick={generateFlashcards}
              disabled={loading || (!selectedChapter && !pdf)}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🤖 Generating Flashcards...' : '✨ Generate Flashcards'}
            </button>
          </div>
        )}

        {/* STUDY STAGE */}
        {stage === 'study' && flashcards.length > 0 && (
          <div>

            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 font-medium">
                Round {round} • Card {current + 1} of {flashcards.length}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-green-600 text-sm font-semibold">✅ {gotIt.length}</span>
                <span className="text-orange-500 text-sm font-semibold">🔄 {needPractice.length}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((current) / flashcards.length) * 100}%` }}
              />
            </div>

            {/* Flashcard */}
            <div
              onClick={() => setFlipped(!flipped)}
              className="cursor-pointer mb-6"
              style={{ perspective: '1000px' }}
            >
              <div
                style={{
                  transition: 'transform 0.5s',
                  transformStyle: 'preserve-3d',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  position: 'relative',
                  height: '280px'
                }}
              >
                {/* Front */}
                <div
                  style={{ backfaceVisibility: 'hidden' }}
                  className="absolute inset-0 bg-white rounded-2xl shadow-lg border-2 border-blue-100 flex flex-col items-center justify-center p-8 text-center"
                >
                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4">Question</p>
                  <p className="text-xl font-bold text-gray-800">{flashcards[current]?.question}</p>
                  <p className="text-xs text-gray-400 mt-6">👆 Tap to see answer</p>
                </div>

                {/* Back */}
                <div
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  className="absolute inset-0 bg-blue-600 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 text-center"
                >
                  <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-4">Answer</p>
                  <p className="text-xl font-bold text-white">{flashcards[current]?.answer}</p>
                  <p className="text-xs text-blue-200 mt-6">👆 Tap to see question</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {flipped && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleNeedPractice}
                  className="bg-orange-50 text-orange-500 border-2 border-orange-300 py-4 rounded-xl font-bold hover:bg-orange-100 transition text-sm"
                >
                  🔄 Need More Practice
                </button>
                <button
                  onClick={handleGotIt}
                  className="bg-green-50 text-green-600 border-2 border-green-300 py-4 rounded-xl font-bold hover:bg-green-100 transition text-sm"
                >
                  ✅ Got It!
                </button>
              </div>
            )}

            {!flipped && (
              <button
                onClick={() => setFlipped(true)}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                Reveal Answer 👁
              </button>
            )}

          </div>
        )}

        {/* COMPLETE STAGE */}
        {stage === 'complete' && (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Round {round} Complete!</h2>
            <p className="text-gray-500 mb-8">Here's how you did</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 rounded-2xl p-6">
                <p className="text-4xl font-extrabold text-green-600">{gotIt.length}</p>
                <p className="text-sm text-gray-500 mt-1">Got It ✅</p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6">
                <p className="text-4xl font-extrabold text-orange-500">{needPractice.length}</p>
                <p className="text-sm text-gray-500 mt-1">Need Practice 🔄</p>
              </div>
            </div>

            {needPractice.length > 0 ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={startPracticeRound}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Practice {needPractice.length} Cards Again 🔄
                </button>
                <button
                  onClick={resetAll}
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Start New Session
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-2">
                  <p className="text-green-700 font-bold">🌟 Perfect! You got all cards right!</p>
                </div>
                <button
                  onClick={resetAll}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Start New Session
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}