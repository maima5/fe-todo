'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { addTodo } from '@/lib/api'
import { Calendar, Briefcase, BookOpen, Home, Activity} from 'lucide-react'
import Image from 'next/image'
const CATEGORIES = [
  { name: 'Work', icon: Briefcase },
  { name: 'Study', icon: BookOpen },
  { name: 'Personal', icon: Home },
  { name: 'Health', icon: Activity },
]

export default function AddPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [category, setCategory] = useState('Personal')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!text.trim()) return setError('Judul tidak boleh kosong!')
    try {
      setLoading(true)
      setError(null)
      await addTodo({ text, category, deadline })
      router.push('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-pink-50 flex flex-col items-center px-4">

      {/* Navbar */}
      <nav className="w-full max-w-2xl flex items-center justify-between py-5">
              <div className="flex items-center gap-2">
                  <Image
                    src="/icons/icon-192x192.png"
                    alt="Bloom Todo Logo"
                    width={70}
                    height={70}
                    className="rounded-xl"
                    priority
                  />
                <span className="font-bold text-gray-800 text-lg">bloom.todo</span>
              </div>
        <div className="flex gap-1 bg-white border border-pink-100 rounded-2xl p-1 shadow-sm">
          <Link href="/">
            <span className="px-4 py-1.5 rounded-xl text-pink-400 text-sm font-medium hover:bg-pink-50 transition cursor-pointer">Dashboard</span>
          </Link>
          <span className="px-4 py-1.5 rounded-xl bg-[#6F4E37] text-white text-sm font-semibold">Add Todo</span>
          <Link href="/done">
            <span className="px-4 py-1.5 rounded-xl text-pink-400 text-sm font-medium hover:bg-pink-50 transition cursor-pointer">Done</span>
          </Link>
        </div>
      </nav>

      <div className="w-full max-w-2xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 rounded-2xl px-5 py-3 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-pink-100 p-6 flex flex-col gap-5 shadow-sm">
          <h2 className="text-xl font-bold text-pink-500 flex items-center gap-2">
            <span>+</span> New Todo
          </h2>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-pink-300 uppercase tracking-wider">Title</label>
            <input
              className="w-full mt-2 border-2 border-pink-100 rounded-2xl px-4 py-3 outline-none focus:border-pink-400 text-gray-700 text-sm bg-pink-50/30 placeholder:text-pink-200"
              placeholder="What do you need to do?"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-pink-300 uppercase tracking-wider">Category</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {CATEGORIES.map(cat => {
                // Deklarasikan Icon sebagai komponen (Capitalized) agar bisa dirender
                const Icon = cat.icon; 
                
                return (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`py-3 rounded-2xl text-sm font-medium border-2 transition flex items-center justify-center gap-2 ${
                      category === cat.name
                        ? 'bg-pink-400 text-white border-pink-400'
                        : 'bg-pink-50/50 text-pink-400 border-pink-100 hover:border-pink-300'
                    }`}
                  >
                    {/* Render icon Lucide di sini */}
                    <Icon size={18} strokeWidth={2.5} /> 
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-xs font-semibold text-pink-300 uppercase tracking-wider">Deadline</label>
            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300"><Calendar className="w-3.5 h-3.5 text-pink-300" /></span>
              <input
                type="date"
                className="w-full border-2 border-pink-100 rounded-2xl pl-10 pr-4 py-3 outline-none focus:border-pink-400 text-gray-700 text-sm bg-pink-50/30"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-pink-400 hover:bg-pink-500 disabled:opacity-60 text-white py-3 rounded-full font-semibold transition text-sm"
            >
              {loading ? 'Saving...' : '+ Add Todo'}
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-full border-2 border-pink-200 text-pink-400 hover:border-pink-400 text-sm transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}