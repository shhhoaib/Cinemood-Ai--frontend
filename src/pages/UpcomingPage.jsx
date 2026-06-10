import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getUpcoming } from '../api/backend'
import MovieCard from '../components/MovieCard/MovieCard'
import SkeletonGrid from '../components/UI/SkeletonGrid'
import InfiniteScroll from '../components/UI/InfiniteScroll'

export default function UpcomingPage() {
  const [page, setPage] = useState(1)
  const [allMovies, setAllMovies] = useState([])

  const { isFetching, isPending } = useQuery({
    queryKey: ['upcoming', page],
    queryFn: async () => {
      const res = await getUpcoming(page)
      const movies = res.data.movies || []
      if (page === 1) setAllMovies(movies)
      else setAllMovies((prev) => [...prev, ...movies])
      return movies
    },
  })

  const loadMore = useCallback(() => {
    if (!isFetching) setPage((p) => p + 1)
  }, [isFetching])

  const movies = allMovies
  const hasMore = movies.length >= page * 20
  const isLoading = isPending && page === 1 && movies.length === 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-3xl md:text-4xl font-cinema text-white mb-2">Coming Soon</h1>
      <p className="text-gray-400 mb-6">Movies releasing soon — sorted by release date</p>
      {isLoading ? (
        <SkeletonGrid count={12} />
      ) : movies.length > 0 ? (
        <InfiniteScroll onLoad={loadMore} loading={isFetching} hasMore={hasMore}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((item, i) => (
              <div key={`${item.id}-${i}`} className="relative">
                {item.release_date && (
                  <div className="absolute top-2 left-2 z-10 bg-cinema-red text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                    {new Date(item.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                )}
                <MovieCard item={item} index={i} />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      ) : !isFetching ? (
        <p className="text-gray-500 text-center py-12">No upcoming movies found.</p>
      ) : null}
    </motion.div>
  )
}
