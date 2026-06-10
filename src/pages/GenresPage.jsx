import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getGenres } from '../api/backend'
import Loader from '../components/UI/Loader'

const GENRE_IMAGES = {
  Action: '🎯', Adventure: '🗺️', Animation: '🐭', Comedy: '😂',
  Crime: '🔫', Documentary: '📽️', Drama: '🎭', Family: '👨‍👩‍👧‍👦',
  Fantasy: '🧙', History: '📜', Horror: '👻', Music: '🎵',
  Mystery: '🔍', Romance: '💕', 'Science Fiction': '🚀', 'TV Movie': '📺',
  Thriller: '😬', War: '⚔️', Western: '🤠',
}

export default function GenresPage() {
  const { data: genres, isLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: () => getGenres(),
    select: (r) => r.data.genres,
  })

  if (isLoading) return <div className="flex justify-center py-20"><Loader text="Loading genres..." /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-3xl md:text-4xl font-cinema text-white mb-2">Browse by Genre</h1>
      <p className="text-gray-400 mb-8">Explore movies by your favorite genre</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genres?.map((genre, i) => (
          <motion.div
            key={genre.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              to={`/genre/${genre.id}/${genre.name}`}
              className="flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-cinema-red/20 border border-white/10 hover:border-cinema-red/30 rounded-2xl p-6 transition-all group h-36"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{GENRE_IMAGES[genre.name] || '🎬'}</span>
              <span className="text-white text-sm font-semibold text-center">{genre.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
