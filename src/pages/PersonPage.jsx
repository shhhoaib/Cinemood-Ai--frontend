import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getPersonCredits } from '../api/backend'
import MovieCard from '../components/MovieCard/MovieCard'
import SkeletonGrid from '../components/UI/SkeletonGrid'

export default function PersonPage() {
  const { id } = useParams()

  const { data: person, isPending, isError } = useQuery({
    queryKey: ['person', id],
    queryFn: () => getPersonCredits(id),
    select: (r) => r.data,
    enabled: id && /^\d+$/.test(id),
  })

  if (isPending) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-32 h-32 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
          <div className="space-y-3 flex-1">
            <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-64 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
        <SkeletonGrid count={12} />
      </div>
    )
  }

  if (isError || !person) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 text-center">
        <p className="text-gray-500 text-lg mb-2">Could not load actor info</p>
        <p className="text-gray-600 text-sm">Try again from the movie detail page.</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-5 mb-8">
        {person.profile ? (
          <img src={person.profile} alt={person.name} className="w-32 h-32 rounded-full object-cover flex-shrink-0 border-2 border-cinema-red/20" />
        ) : (
          <div className="w-32 h-32 rounded-full bg-cinema-deep flex items-center justify-center text-4xl flex-shrink-0">🎭</div>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-cinema text-white">{person.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{person.known_for_department}</p>
          {person.birthday && (
            <p className="text-gray-500 text-xs mt-0.5">
              {person.birthday}{person.deathday ? ` — ${person.deathday}` : ''}
              {person.place_of_birth ? ` | ${person.place_of_birth}` : ''}
            </p>
          )}
        </div>
      </div>

      {person.tv_credits?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-white font-cinema text-xl mb-4">TV Series ({person.tv_credits.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {person.tv_credits.map((item) => (
              <MovieCard key={`tv-${item.id}`} item={item} />
            ))}
          </div>
        </section>
      )}

      {person.movie_credits?.length > 0 && (
        <section>
          <h2 className="text-white font-cinema text-xl mb-4">Movies ({person.movie_credits.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {person.movie_credits.map((item) => (
              <MovieCard key={`movie-${item.id}`} item={item} />
            ))}
          </div>
        </section>
      )}

      {!person.movie_credits?.length && !person.tv_credits?.length && (
        <p className="text-gray-500 text-center py-12">No credits found.</p>
      )}
    </motion.div>
  )
}