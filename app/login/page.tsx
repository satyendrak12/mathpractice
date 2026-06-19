'use client'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000'
      }
    })
  }

  async function signUpWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000',
        queryParams: { prompt: 'select_account' }
      }
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full border border-gray-100">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">M</div>
          <span className="text-2xl font-bold text-gray-900">MathPractice</span>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Get Started</h1>
        <p className="text-gray-500 mb-8 text-sm">Sign in or create a new account to track your progress</p>

        {/* Login Button */}
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white rounded-xl py-3 px-6 font-semibold hover:bg-blue-700 transition mb-3"
        >
          <img src="https://www.google.com/favicon.ico" width={20} height={20} alt="Google" />
          Login with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">New here?</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Sign Up Button */}
        <button
          onClick={signUpWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3 px-6 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
        >
          <img src="https://www.google.com/favicon.ico" width={20} height={20} alt="Google" />
          Sign Up with Google
        </button>

        <p className="text-xs text-gray-400 mt-6">
          By signing in you agree to our terms of service
        </p>

        <a href="/" className="block mt-4 text-sm text-blue-600 hover:underline">
          ← Back to Home
        </a>

      </div>
    </main>
  )
}