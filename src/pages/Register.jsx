import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useQuery } from '@tanstack/react-query'
import { getGenres } from '../api/backend'

const GENRE_IDS = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance',
  878: 'Sci-Fi', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
}

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', age: 25,
    favorite_genres: [], favorite_actors: '', favorite_actresses: '',
    favorite_directors: '', favorite_writers: '', bio: '',
  })
  const { register, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const { data: genres } = useQuery({ queryKey: ['genres'], queryFn: () => getGenres(), select: (r) => r.data.genres })

  const toggleGenre = (id) => {
    setForm((f) => ({
      ...f,
      favorite_genres: f.favorite_genres.includes(id)
        ? f.favorite_genres.filter((g) => g !== id)
        : [...f.favorite_genres, id],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      favorite_actors: form.favorite_actors.split(',').map((s) => s.trim()).filter(Boolean),
      favorite_actresses: form.favorite_actresses.split(',').map((s) => s.trim()).filter(Boolean),
      favorite_directors: form.favorite_directors.split(',').map((s) => s.trim()).filter(Boolean),
      favorite_writers: form.favorite_writers.split(',').map((s) => s.trim()).filter(Boolean),
    }
    const ok = await register(payload)
    if (ok) navigate('/')
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-cinema-navy/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-cinema font-bold text-white mb-6 text-center">Create Your CineMood Profile</h1>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
              <span>{error}</span>
              <button onClick={clearError} className="text-red-300 hover:text-white ml-2">✕</button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" value={form.name} onChange={update('name')} required />
              <Input label="Email" type="email" value={form.email} onChange={update('email')} required />
              <Input label="Password" type="password" value={form.password} onChange={update('password')} required minLength={6} />
              <Input label="Age" type="number" value={form.age} onChange={update('age')} min={5} max={120} />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Favorite Genres (pick your top ones)</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(GENRE_IDS).map(([id, name]) => (
                  <button key={id} type="button" onClick={() => toggleGenre(Number(id))}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.favorite_genres.includes(Number(id))
                        ? 'bg-cinema-red/20 text-cinema-red border-cinema-red/40'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                    }`}>
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Favorite Actors (comma-separated)" value={form.favorite_actors} onChange={update('favorite_actors')} placeholder="Keanu Reeves, Tom Hardy" />
              <Input label="Favorite Actresses (comma-separated)" value={form.favorite_actresses} onChange={update('favorite_actresses')} placeholder="Scarlett Johansson, Zendaya" />
              <Input label="Favorite Directors (comma-separated)" value={form.favorite_directors} onChange={update('favorite_directors')} placeholder="Christopher Nolan, Greta Gerwig" />
              <Input label="Favorite Writers (comma-separated)" value={form.favorite_writers} onChange={update('favorite_writers')} placeholder="Charlie Kaufman, Aaron Sorkin" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Bio (tell us about your movie taste)</label>
              <textarea value={form.bio} onChange={update('bio')} rows={3} maxLength={500}
                className="w-full bg-cinema-dark text-white rounded-lg px-4 py-2.5 border border-white/10 focus:outline-none focus:border-cinema-red transition-colors resize-none" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-cinema-red hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Analyzing...' : 'Create Account & Analyze My DNA'}
            </button>
          </form>
          <p className="text-gray-500 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-cinema-red hover:text-red-400">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Input({ label, type = 'text', value, onChange, required, min, max, minLength, placeholder }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input type={type} value={value} onChange={onChange} required={required} min={min} max={max} minLength={minLength} placeholder={placeholder}
        className="w-full bg-cinema-dark text-white rounded-lg px-4 py-2.5 border border-white/10 focus:outline-none focus:border-cinema-red transition-colors" />
    </div>
  )
}
