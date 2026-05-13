'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTodos, deleteTodo } from '@/lib/api'
import { Trash2, Briefcase, BookOpen, Home, Activity, Sparkles } from 'lucide-react';
import Image from 'next/image' 
const CAT_STYLE = {
  Work:     { style: 'bg-pink-100 text-pink-700',     icon: Briefcase },
  Study:    { style: 'bg-purple-100 text-purple-700', icon: BookOpen },
  Personal: { style: 'bg-orange-100 text-orange-700', icon: Home },
  Health:   { style: 'bg-green-100 text-green-700',   icon: Activity },
};

function formatCompletedAt(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function DonePage() {
  const [allTodos, setAllTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTodos()
      setAllTodos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleDelete = async (id) => {
    try { await deleteTodo(id); fetchAll() } catch (err) { alert(err.message) }
  }

  const doneTodos = allTodos.filter(t => t.done)
  const total = allTodos.length
  const doneCount = doneTodos.length
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0

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
          <Link href="/add">
            <span className="px-4 py-1.5 rounded-xl text-pink-400 text-sm font-medium hover:bg-pink-50 transition cursor-pointer">Add Todo</span>
          </Link>
          <span className="px-4 py-1.5 rounded-xl bg-[#6F4E37] text-white text-sm font-semibold">Done</span>
        </div>
      </nav>

      <div className="w-full max-w-2xl pb-16">

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-pink-100 px-5 py-4 mb-6 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">This week's progress</p>
          <div className="bg-pink-100 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-pink-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-end gap-1.5 text-pink-500">
            <p className="text-sm font-semibold">
              {doneCount} of {total} done
            </p>
            <Sparkles size={16} className="fill-current animate-pulse" />
          </div>
        </div>

        {loading && <div className="text-center text-pink-300 py-10">Loading... 🌸</div>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 rounded-2xl px-5 py-3 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Completed Todos</p>
            <ul className="flex flex-col gap-3">
              {doneTodos.length === 0 && (
                <p className="text-center text-pink-300 py-10">Belum ada yang selesai! 🌸</p>
              )}
              {doneTodos.map(todo => {
                // Ambil style dan komponen icon dari CAT_STYLE
                const cat = CAT_STYLE[todo.category] || { style: 'bg-gray-100 text-gray-500', icon: null };
                
                // Simpan ke variabel dengan huruf kapital agar bisa dirender sebagai tag
                const Icon = cat.icon;

                return (
                  <li key={todo.id} className="bg-white border border-pink-100 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
                      <div>
                        <p className="text-gray-400 font-medium text-sm line-through">{todo.text}</p>
                        <div className="flex gap-2 mt-1 items-center flex-wrap">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${cat.style}`}>
                            {/* Render icon jika ada, jika tidak ada tampilkan fallback emoji/pin */}
                            {Icon ? <Icon size={12} /> : <span>📌</span>} 
                            {todo.category}
                          </span>
                          {todo.completedAt && (
                            <span className="text-xs text-gray-400">
                              Completed {formatCompletedAt(todo.completedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(todo.id)} className="text-pink-200 hover:text-pink-400 transition ml-2 flex-shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </main>
  )
}