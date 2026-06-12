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

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Math Practice</h1>
        <p className="text-gray-500 mb-8">Class 11 & 12 Chapter-wise MCQ Tests</p>
        
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3 px-6 font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          <img src="https://www.google.com/favicon.ico" width={20} height={20} alt="Google" />
          Continue with Google
        </button>
      </div>
    </main>
  )
}