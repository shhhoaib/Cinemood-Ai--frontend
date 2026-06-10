import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function HeroSlider({ movies }) {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!movies?.length) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [movies?.length])

  const goTo = useCallback((i) => setCurrent(i), [])

  if (!movies?.length) return null

  const movie = movies[current]

  return (
    <div className="relative h-[70vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark via-cinema-dark/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark/80 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-16">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-cinema text-white drop-shadow-lg">
              {movie.title}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-sm md:text-base">
              <span className="text-cinema-gold font-semibold">
                ★ {movie.rating?.toFixed(1)}
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">{movie.year}</span>
            </div>
            <p className="text-gray-300 mt-3 max-w-xl line-clamp-2 text-sm md:text-base">
              {movie.overview}
            </p>
            <button
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="mt-4 bg-cinema-red hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm md:text-base transition-all w-fit"
            >
              View Details
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current
                ? 'bg-cinema-red w-6'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
