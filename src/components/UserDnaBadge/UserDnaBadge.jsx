import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export default function UserDnaBadge() {
  const { user, dna } = useAuthStore()

  if (!user || !dna) return null

  return (
    <Link to="/profile" className="group block">
      <div className="bg-gradient-to-r from-cinema-red/10 via-cinema-navy/50 to-transparent border border-cinema-red/20 rounded-xl p-4 hover:border-cinema-red/40 transition-all">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{dna.primary.emoji}</span>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">Welcome back, {user.name || 'Movie Lover'}!</p>
            <p className="text-cinema-red text-xs font-medium">{dna.primary.name}</p>
            <p className="text-gray-500 text-xs truncate mt-0.5">{dna.primary.tagline}</p>
          </div>
        </div>
        {dna.top_genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {dna.top_genres.map((g) => (
              <span key={g} className="bg-cinema-red/10 text-cinema-red text-[10px] px-2 py-0.5 rounded-full border border-cinema-red/20">{g}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
