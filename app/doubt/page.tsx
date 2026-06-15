'use client'
import { useState, useRef } from 'react'

export default function DoubtSolver() {
  const [question, setQuestion] = useState('')
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
      setQuestion('')
    }
  }

  function removeImage() {
    setImage(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleAsk() {
    if (!question.trim() && !image) return
    setLoading(true)
    setSolution('')

    try {
      const formData = new FormData()
      formData.append('question', question)
      if (image) formData.append('image', image)

      const response = await fetch('/api/doubt', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      setSolution(data.solution)
    } catch (error) {
      setSolution('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">M</div>
          <span className="text-xl font-bold text-blue-600">MathPractice</span>
        </div>
        <a href="/" className="text-sm text-blue-600 font-medium hover:underline">← Back to Home</a>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-4xl font-extrabold text-gray-900">AI Doubt Solver</h1>
          <p className="text-gray-600 mt-2 text-base font-medium">
            Type your doubt or upload a photo — get instant step-by-step solutions!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

          {/* Text Input */}
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type your doubt:
          </label>
          {!imagePreview ? (
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. How to find the roots of x2 - 5x + 6 = 0 ?"
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-800 focus:outline-none focus:border-blue-400 resize-none h-28 text-sm"
            />
          ) : (
            <div className="w-full border-2 border-gray-100 rounded-xl p-4 bg-gray-50 text-gray-400 text-sm">
              📷 Photo uploaded — text input disabled. Remove photo to type instead.
            </div>
          )}

          {/* Divider */}
          {!imagePreview && (
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          )}

          {/* Image Upload */}
          <div className="mt-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {imagePreview ? '📷 Uploaded photo:' : 'Upload a photo of your question:'}
            </label>

            {imagePreview ? (
              <div className="relative inline-block w-full">
                <img
                  src={imagePreview}
                  alt="Question"
                  className="w-full max-h-48 object-contain rounded-xl border-2 border-blue-200"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm font-bold hover:bg-red-600 transition"
                >
                  X
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-500 text-sm font-medium">Click to upload a photo of your question</p>
                <p className="text-gray-400 text-xs mt-1">Supports JPG, PNG, WEBP</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <button
            onClick={handleAsk}
            disabled={loading || (!question.trim() && !image)}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🤔 Solving your doubt...' : '✨ Solve My Doubt'}
          </button>
        </div>

        {solution && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💡</span>
              <h2 className="text-xl font-bold text-gray-800">Solution</h2>
            </div>
            <div className="text-gray-700 leading-relaxed text-sm">
              {solution.split('\n').map((line, index) => {
                if (line.startsWith('FINAL ANSWER:')) {
                  return (
                    <div key={index} className="mt-4 p-3 bg-green-50 border-2 border-green-400 rounded-xl">
                      <p className="font-extrabold text-green-700 text-base">{line}</p>
                    </div>
                  )
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={index} className="font-extrabold text-gray-900 text-base my-1">{line.replace(/\*\*/g, '')}</p>
                }
                if (line.match(/\*\*(.*?)\*\*/)) {
                  return <p key={index} className="my-1">{line.split(/\*\*(.*?)\*\*/).map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className="font-extrabold text-gray-900">{part}</strong> : part
                  )}</p>
                }
                return <p key={index} className="my-1">{line}</p>
              })}
            </div>
          </div>
        )}

        {!solution && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-700 mb-4">💬 Try these examples:</h3>
            <div className="flex flex-col gap-3">
              {[
                'How to find the roots of x2 - 5x + 6 = 0?',
                'What is the formula for sin(A+B)?',
                'How to find the derivative of x3 + 2x?',
                'What is the probability of getting a head when a coin is tossed?',
                'How to find the integral of sin(x)?'
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(example)}
                  className="text-left p-3 rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-600 font-medium transition"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
} 