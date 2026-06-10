import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function HeroBanner({ movies }) {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!movies?.length) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [movies?.length])

  if (!movies?.length) return null
  const movie = movies[current]

  return (
    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {movie.backdrop && (
            <img src={movie.backdrop} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark via-cinema-dark/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full flex items-end pb-16 md:pb-20 max-w-7xl mx-auto px-4 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id + '-content'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-cinema text-white drop-shadow-lg">
              {movie.title}
            </h1>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="text-cinema-gold font-semibold">★ {movie.rating?.toFixed(1)}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">{movie.year}</span>
              {movie.genre_names?.slice(0, 3).map((g) => (
                <span key={g} className="text-xs text-white/70 bg-white/10 px-2 py-0.5 rounded-full">{g}</span>
              ))}
            </div>
            <p className="text-gray-300 mt-3 text-sm md:text-base line-clamp-2">{movie.overview}</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-cinema-red hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg shadow-cinema-red/30 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                View Details
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all backdrop-blur-sm flex items-center gap-2"
              >
                <span>🎭</span>
                Find by Mood
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-cinema-red' : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
