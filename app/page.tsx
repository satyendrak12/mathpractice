import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getChapters() {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .order('class', { ascending: true })
  if (error) console.error(error)
  return data || []
}

export default async function Home() {
  const chapters = await getChapters()
  const class11 = chapters.filter(c => c.class === 11)
  const class12 = chapters.filter(c => c.class === 12)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-10 text-center">
        <h1 className="text-4xl font-bold">Math Practice</h1>
        <p className="mt-2 text-lg">Class 11 & 12 Chapter-wise MCQ Tests</p>
        <p className="text-white text-xl mt-4"><a href="/login">Click here to Login</a></p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Class 11</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {class11.map(chapter => (
            <a href={`/quiz/${chapter.id}`} key={chapter.id}>
              <div className="bg-white rounded-xl shadow p-5 hover:bg-blue-50 cursor-pointer transition">
                <h3 className="text-lg font-semibold text-blue-700">{chapter.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Start Quiz →</p>
              </div>
            </a>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Class 12</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {class12.map(chapter => (
            <a href={`/quiz/${chapter.id}`} key={chapter.id}>
              <div className="bg-white rounded-xl shadow p-5 hover:bg-blue-50 cursor-pointer transition">
                <h3 className="text-lg font-semibold text-blue-700">{chapter.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Start Quiz →</p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </main>
  )
}