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

  useEffect(() => {
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

  function handleAnswer(option: string) {
    if (answered) return
    setSelected(option)
    setAnswered(true)
    if (option === questions[current].correct_answer) {
      setScore(prev => prev + 1)
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

  if (questions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500">Loading questions...</p>
    </div>
  )

  if (showResult) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow p-10 text-center">
        <h2 className="text-3xl font-bold text-blue-600">Quiz Complete! 🎉</h2>
       <p className="text-xl mt-4 text-gray-800">Your Score: <span className="font-bold text-blue-600">{score} / {questions.length}</span></p>
        <a href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg">
          Back to Home
        </a>
      </div>
    </div>
  )

  const q = questions[current]

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">

        <p className="text-gray-500 mb-4">Question {current + 1} of {questions.length}</p>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{q.question_text}</h2>
        </div>

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

        {answered && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
            <p className="text-yellow-800"><span className="font-bold">Explanation:</span> {q.explanation}</p>
          </div>
        )}

        {answered && (
          <button
            onClick={handleNext}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            {current + 1 < questions.length ? 'Next Question →' : 'See Result'}
          </button>
        )}

      </div>
    </main>
  )
}