import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function MovieCard({ item, index = 0 }) {
  const navigate = useNavigate()
  if (!item) return null

  const isTv = item.media_type === 'tv'
  const detailPath = isTv ? `/tv/${item.id}` : `/movie/${item.id}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="group cursor-pointer flex-shrink-0 w-36 sm:w-40"
    >
      <div
        onClick={() => navigate(detailPath)}
        className="relative rounded-xl overflow-hidden bg-cinema-navy aspect-[2/3] shadow-lg shadow-black/30 group-hover:shadow-cinema-red/20 group-hover:shadow-xl transition-all duration-300">
        {item.poster_small || item.poster ? (
          <img
            src={item.poster_small || item.poster}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cinema-deep">
            <span className="text-3xl">{isTv ? '📺' : '🎬'}</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Details link overlay */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(detailPath) }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </button>

        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-xs">
          <span className="text-cinema-gold font-semibold">★ {item.rating?.toFixed(1)}</span>
        </div>
        {isTv && (
          <div className="absolute top-2 left-2 bg-cinema-red/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
            TV
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <h3
          onClick={() => navigate(detailPath)}
          className="text-white text-sm font-medium truncate hover:text-cinema-red transition-colors cursor-pointer"
        >
          {item.title}
        </h3>
        <p className="text-gray-500 text-xs">{item.year}</p>
        {item.genre_names?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.genre_names.slice(0, 2).map((g) => (
              <span key={g} className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">{g}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
