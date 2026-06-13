'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function QuizPage() {
  const params = useParams()
  const id = params.id

  const [questions, setQuestions] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [skipped, setSkipped] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [reviewList, setReviewList] = useState<any[]>([])

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    // Fetch questions
    async function fetchQuestions() {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('chapter_id', id)
      if (error) console.error(error)
      setQuestions(data || [])
    }
    fetchQuestions()
  }, [id])

  async function handleAnswer(option: string) {
    if (answered) return
    setSelected(option)
    setAnswered(true)

    const isCorrect = option === questions[current].correct_answer
    if (isCorrect) setScore(prev => prev + 1)

    // Add to review list
    setReviewList(prev => [...prev, {
      question: questions[current].question_text,
      selected: option,
      correct: questions[current].correct_answer,
      explanation: questions[current].explanation,
      isCorrect
    }])

    // Save attempt to Supabase
    if (user) {
      await supabase.from('attempts').insert({
        user_id: user.id,
        question_id: questions[current].id,
        selected_answer: option,
        is_correct: isCorrect
      })
    }
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(prev => prev + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  function handleSkip() {
    setSkipped(prev => prev + 1)
    setReviewList(prev => [...prev, {
      question: questions[current].question_text,
      selected: 'Skipped',
      correct: questions[current].correct_answer,
      explanation: questions[current].explanation,
      isCorrect: false
    }])
    handleNext()
  }

  if (questions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500">Loading questions...</p>
    </div>
  )

  if (showResult) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="max-w-2xl mx-auto px-4">

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-extrabold text-blue-600">Quiz Complete!</h2>
          <p className="text-gray-500 mt-2 mb-6">Here's how you did</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-600">{score}</p>
              <p className="text-xs text-gray-500 mt-1">Correct</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-red-500">{questions.length - score - skipped}</p>
              <p className="text-xs text-gray-500 mt-1">Wrong</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-yellow-500">{skipped}</p>
              <p className="text-xs text-gray-500 mt-1">Skipped</p>
            </div>
          </div>

          <p className="text-xl font-bold text-gray-800 mb-6">
            Score: {score} / {questions.length}
          </p>

          <div className="flex gap-3">
            <a href={`/quiz/${id}`} className="flex-1 block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-center">
              Retry Quiz 🔄
            </a>
            <a href="/" className="flex-1 block bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-center">
              Home 🏠
            </a>
          </div>
        </div>

        {/* Question Review */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Question Review</h3>
        <div className="flex flex-col gap-4">
          {reviewList.map((item, index) => (
            <div key={index} className={`bg-white rounded-2xl shadow p-5 border-l-4 ${item.isCorrect ? 'border-green-500' : item.selected === 'Skipped' ? 'border-yellow-400' : 'border-red-500'}`}>
              <p className="font-semibold text-gray-800 mb-2">Q{index + 1}. {item.question}</p>
              <p className={`text-sm font-medium ${item.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                Your answer: {item.selected}
              </p>
              {!item.isCorrect && (
                <p className="text-sm font-medium text-green-600">Correct answer: {item.correct}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">💡 {item.explanation}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )

  const q = questions[current]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-blue-600 font-semibold hover:underline">← Back</a>
          <span className="text-gray-500 text-sm">Question {current + 1} of {questions.length}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{q.question_text}</h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4">
          {['A', 'B', 'C', 'D'].map(option => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`p-4 rounded-xl text-left font-medium border-2 transition
                ${!answered ? 'bg-white hover:bg-blue-50 border-gray-200 text-gray-800' : ''}
                ${answered && option === q.correct_answer ? 'bg-green-100 border-green-500 text-green-700' : ''}
                ${answered && selected === option && option !== q.correct_answer ? 'bg-red-100 border-red-500 text-red-700' : ''}
                ${answered && selected !== option && option !== q.correct_answer ? 'bg-white border-gray-200 text-gray-500' : ''}
              `}
            >
              <span className="font-bold mr-2">{option}.</span>
              {q[`option_${option.toLowerCase()}`]}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {answered && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
            <p className="text-yellow-800">
              <span className="font-bold">Explanation: </span>
              {q.explanation}
            </p>
          </div>
        )}

        {/* Skip Button */}
        {!answered && (
          <button
            onClick={handleSkip}
            className="mt-6 w-full bg-orange-50 text-orange-500 border-2 border-orange-300 py-3 rounded-xl font-semibold hover:bg-orange-100 hover:border-orange-400 transition"
          >
            Skip Question ⏭
          </button>
        )}

        {/* Next Button */}
        {answered && (
          <button
            onClick={handleNext}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {current + 1 < questions.length ? 'Next Question →' : 'See Result'}
          </button>
        )}

      </div>
    </main>
  )
}