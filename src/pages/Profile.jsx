import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const GENRE_IDS = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance',
  878: 'Sci-Fi', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
}

export default function Profile() {
  const { user, dna, loading, updateProfile, logout } = useAuthStore()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        age: user.age || 25,
        favorite_genres: user.favorite_genres || [],
        favorite_actors: (user.favorite_actors || []).join(', '),
        favorite_actresses: (user.favorite_actresses || []).join(', '),
        favorite_directors: (user.favorite_directors || []).join(', '),
        favorite_writers: (user.favorite_writers || []).join(', '),
        bio: user.bio || '',
      })
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-xl text-white font-cinema mb-4">Not signed in</h2>
        <button onClick={() => navigate('/login')} className="bg-cinema-red text-white px-6 py-2 rounded-lg">Sign In</button>
      </div>
    )
  }

  const toggleGenre = (id) => {
    setForm((f) => ({
      ...f,
      favorite_genres: f.favorite_genres.includes(id)
        ? f.favorite_genres.filter((g) => g !== id)
        : [...f.favorite_genres, id],
    }))
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSave = async () => {
    const payload = {
      ...form,
      favorite_actors: form.favorite_actors.split(',').map((s) => s.trim()).filter(Boolean),
      favorite_actresses: form.favorite_actresses.split(',').map((s) => s.trim()).filter(Boolean),
      favorite_directors: form.favorite_directors.split(',').map((s) => s.trim()).filter(Boolean),
      favorite_writers: form.favorite_writers.split(',').map((s) => s.trim()).filter(Boolean),
    }
    await updateProfile(payload)
    setEditing(false)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* DNA Badge */}
        {dna && (
          <div className="bg-gradient-to-r from-cinema-red/10 via-cinema-navy/50 to-transparent border border-cinema-red/20 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4 flex-wrap">
              <span className="text-5xl">{dna.primary.emoji}</span>
              <div className="flex-1 min-w-[200px]">
                <h2 className="text-2xl font-cinema font-bold text-white">{dna.primary.name}</h2>
                <p className="text-gray-400 italic mt-1">{dna.primary.tagline}</p>
                <p className="text-gray-500 text-sm mt-2">{dna.primary.description}</p>
                {dna.top_genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {dna.top_genres.map((g) => (
                      <span key={g} className="bg-cinema-red/10 text-cinema-red text-xs px-3 py-1 rounded-full border border-cinema-red/20">{g}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="bg-cinema-red/20 text-cinema-red text-sm font-bold px-4 py-2 rounded-full border border-cinema-red/30">
                  DNA Score: {dna.primary.score}
                </div>
              </div>
            </div>
            {dna.secondary.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Also in your DNA</p>
                <div className="flex flex-wrap gap-3">
                  {dna.secondary.map((s) => (
                    <span key={s.id} className="text-sm text-gray-400">
                      {s.emoji} {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
              <span>🎬 {dna.total_watched} watched</span>
              <span>❤️ {dna.total_likes} liked</span>
              <span>⭐ {dna.actor_count} actors</span>
              <span>🎥 {dna.director_count} directors</span>
            </div>
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-cinema-navy/30 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-cinema font-bold text-white">Profile Settings</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="text-cinema-red text-sm hover:text-red-400">Edit</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="text-gray-400 text-sm hover:text-white">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="bg-cinema-red text-white text-sm px-4 py-1.5 rounded-lg disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="text-white ml-2">{user.name}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="text-white ml-2">{user.email}</span></div>
              <div><span className="text-gray-500">Age:</span> <span className="text-white ml-2">{user.age}</span></div>
              <div><span className="text-gray-500">Bio:</span> <span className="text-white ml-2">{user.bio || '—'}</span></div>
              <div className="md:col-span-2">
                <span className="text-gray-500">Favorite Genres:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(user.favorite_genres || []).map((g) => (
                    <span key={g} className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">{GENRE_IDS[g] || g}</span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-500">Favorite Actors:</span>
                <span className="text-white ml-2">{(user.favorite_actors || []).join(', ') || '—'}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-500">Favorite Directors:</span>
                <span className="text-white ml-2">{(user.favorite_directors || []).join(', ') || '—'}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Name" value={form.name} onChange={update('name')} />
                <Input label="Age" type="number" value={form.age} onChange={update('age')} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Favorite Genres</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(GENRE_IDS).map(([id, name]) => (
                    <button key={id} type="button" onClick={() => toggleGenre(Number(id))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.favorite_genres?.includes(Number(id))
                          ? 'bg-cinema-red/20 text-cinema-red border-cinema-red/40'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                      }`}>
                      {name}
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Favorite Actors (comma-separated)" value={form.favorite_actors} onChange={update('favorite_actors')} />
              <Input label="Favorite Actresses (comma-separated)" value={form.favorite_actresses} onChange={update('favorite_actresses')} />
              <Input label="Favorite Directors (comma-separated)" value={form.favorite_directors} onChange={update('favorite_directors')} />
              <Input label="Favorite Writers (comma-separated)" value={form.favorite_writers} onChange={update('favorite_writers')} />
              <div>
                <label className="block text-sm text-gray-400 mb-1">Bio</label>
                <textarea value={form.bio} onChange={update('bio')} rows={3} className="w-full bg-cinema-dark text-white rounded-lg px-4 py-2.5 border border-white/10 focus:outline-none focus:border-cinema-red transition-colors resize-none" />
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <button onClick={() => { logout(); navigate('/') }} className="text-gray-500 hover:text-red-400 text-sm transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

function Input({ label, type = 'text', value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input type={type} value={value} onChange={onChange}
        className="w-full bg-cinema-dark text-white rounded-lg px-4 py-2.5 border border-white/10 focus:outline-none focus:border-cinema-red transition-colors" />
    </div>
  )
}
