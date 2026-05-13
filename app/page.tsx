'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTodos, toggleTodo, deleteTodo, computeStats } from '@/lib/api'
import Image from 'next/image'
// Gunakan 'as' untuk memberi nama lain pada icon Home
// Update this line at the top of your file
import { 
  Home as HomeIcon, 
  Briefcase, 
  BookOpen, 
  Activity, 
  LayoutGrid, 
  Search,    // Add this
  Calendar,  // Add this
  Trash2     // Add this
} from 'lucide-react';
const CATEGORIES = ['All', 'Work', 'Study', 'Personal', 'Health'];

const CAT_STYLE = {
  All:      { style: 'bg-blue-100 text-blue-700',     icon: LayoutGrid },
  Work:     { style: 'bg-pink-100 text-pink-700',     icon: Briefcase },
  Study:    { style: 'bg-purple-100 text-purple-700', icon: BookOpen },
  Personal: { style: 'bg-orange-100 text-orange-700', icon: HomeIcon },
  Health:   { style: 'bg-green-100 text-green-700',   icon: Activity },
};


function getPriority(deadline) {
  if (!deadline) return null
  const diff = (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  if (diff <= 1) return { label: 'Urgent', style: 'bg-red-100 text-red-500' }
  if (diff <= 3) return { label: 'Medium', style: 'bg-yellow-100 text-yellow-600' }
  return { label: 'Low', style: 'bg-green-100 text-green-600' }
}

function formatDeadline(deadline) {
  const d = new Date(deadline)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)

  const sameDay = (a, b) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()

  if (sameDay(d, now)) return 'Today'
  if (sameDay(d, tomorrow)) return `Tomorrow, ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Home() {
  const [allTodos, setAllTodos] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTodos(search, category)
      // sort by deadline: no deadline goes last
      const sorted = [...data].sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline) - new Date(b.deadline)
      })
      setAllTodos(sorted)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTodos() }, [search, category])

  const handleToggle = async (id) => {
    try { await toggleTodo(id); fetchTodos() } catch (err) { alert(err.message) }
  }
  const handleDelete = async (id) => {
    try { await deleteTodo(id); fetchTodos() } catch (err) { alert(err.message) }
  }

  const activeTodos = allTodos.filter(t => !t.done)
  const stats = computeStats(allTodos)

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
          <span className="px-4 py-1.5 rounded-xl bg-[#6F4E37] text-white text-sm font-semibold">Dashboard</span>
          <Link href="/add">
            <span className="px-4 py-1.5 rounded-xl text-pink-400 text-sm font-medium hover:bg-pink-50 transition cursor-pointer">Add Todo</span>
          </Link>
          <Link href="/done">
            <span className="px-4 py-1.5 rounded-xl text-pink-400 text-sm font-medium hover:bg-pink-50 transition cursor-pointer">Done</span>
          </Link>
        </div>
      </nav>

      <div className="w-full max-w-2xl pb-16">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Active todos', value: stats.active },
            { label: 'Due today', value: stats.dueToday },
            { label: 'Done this week', value: stats.doneThisWeek },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-pink-100 px-5 py-4 shadow-sm">
              <p className="text-3xl font-bold text-pink-500">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-4 h-4" />
          <input
            className="w-full border-2 border-pink-100 rounded-full pl-10 pr-5 py-2.5 outline-none focus:border-pink-400 text-pink-700 bg-white text-sm shadow-sm"
            placeholder="Search todos by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {CATEGORIES.map(cat => {
            // Ambil data style dan icon dari CAT_STYLE berdasarkan nama kategori
            // Jika 'All' tidak ada di CAT_STYLE, kita berikan fallback icon
            const categoryData = CAT_STYLE[cat] || { style: '', icon: null };
            const Icon = categoryData.icon;
            
            const isActive = category === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-pink-400 text-white border-pink-400'
                    : 'bg-white text-pink-400 border-pink-100 hover:border-pink-400 shadow-sm'
                }`}
              >
                {/* Render icon Lucide jika tersedia */}
                {Icon && <Icon size={14} strokeWidth={2.5} />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sorted label */}
        {!loading && !error && activeTodos.length > 0 && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Sorted by deadline</p>
        )}

        {/* Loading */}
        {loading && <div className="text-center text-pink-300 py-10">Loading... 🌸</div>}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 rounded-2xl px-5 py-3 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Todo List */}
        {!loading && !error && (
          <ul className="flex flex-col gap-3">
            {activeTodos.length === 0 && (
              <p className="text-center text-pink-300 py-10">Tidak ada todo! 🎉</p>
            )}
            {activeTodos.map(todo => {
              const priority = getPriority(todo.deadline)
              const cat = CAT_STYLE[todo.category] || { style: 'bg-gray-100 text-gray-500', icon: null }
              const CatIcon = cat.icon
              return (
                <li key={todo.id} className="bg-white border border-pink-100 rounded-2xl px-5 py-4 flex items-start justify-between shadow-sm">
                  <div className="flex gap-3 items-start">
                    <button
                      onClick={() => handleToggle(todo.id)}
                      className="mt-0.5 w-5 h-5 rounded-full border-2 border-pink-300 flex-shrink-0 hover:bg-pink-100 transition"
                    />
                    <div>
                      <p className="text-gray-800 font-semibold text-sm">{todo.text}</p>
                      <div className="flex gap-2 mt-1.5 flex-wrap items-center">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${cat.style} flex items-center gap-1`}>
                          {CatIcon && <CatIcon size={12} strokeWidth={2.5} />}
                          {todo.category}
                        </span>
                        {todo.deadline && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-pink-300" />
                            {formatDeadline(todo.deadline)}
                          </span>
                        )}
                        {priority && (
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${priority.style}`}>
                            {priority.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(todo.id)} className="text-pink-200 hover:text-pink-400 transition ml-2 flex-shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}