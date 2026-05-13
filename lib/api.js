const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getTodos(search = '', category = 'All') {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (category && category !== 'All') params.append('category', category)

  const res = await fetch(`${BASE_URL}/todos?${params.toString()}`)
  if (!res.ok) throw new Error('Gagal mengambil data todos')
  return res.json()
}

export async function addTodo({ text, category, deadline }) {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, category, deadline: deadline || null }),
  })
  if (!res.ok) throw new Error('Gagal menambahkan todo')
  return res.json()
}

export async function toggleTodo(id) {
  const res = await fetch(`${BASE_URL}/todos/${id}`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Gagal mengubah status todo')
  return res.json()
}

export async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/todos/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Gagal menghapus todo')
  return res.json()
}

// Helper: hitung stats dari array todos
export function computeStats(todos) {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
  const startOfWeek = new Date(startOfDay)
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())

  const active = todos.filter(t => !t.done).length
  const dueToday = todos.filter(t => {
    if (!t.deadline || t.done) return false
    const d = new Date(t.deadline)
    return d >= startOfDay && d < endOfDay
  }).length
  const doneThisWeek = todos.filter(t => {
    if (!t.done || !t.completedAt) return false
    return new Date(t.completedAt) >= startOfWeek
  }).length

  return { active, dueToday, doneThisWeek }
}