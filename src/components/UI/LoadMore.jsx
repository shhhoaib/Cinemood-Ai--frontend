import { motion } from 'framer-motion'

export default function LoadMore({ onLoad, loading, hasMore = true }) {
  if (!hasMore) return null

  return (
    <div className="flex justify-center py-8">
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-cinema-red border-t-transparent" />
          <span className="text-sm">Loading more...</span>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLoad}
          className="bg-white/5 hover:bg-cinema-red/20 border border-white/10 hover:border-cinema-red/50 text-white text-sm px-8 py-3 rounded-full transition-all"
        >
          Load More
        </motion.button>
      )}
    </div>
  )
}
