import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getTopRated } from '../api/backend'
import MovieCard from '../components/MovieCard/MovieCard'
import Loader from '../components/UI/Loader'

export default function TopRated() {
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)

  const { isLoading } = useQuery({
    queryKey: ['top-rated-page', page],
    queryFn: () => getTopRated(page),
    select: (r) => r.data.movies,
    onSuccess: (data) => {
      if (page === 1) setMovies(data || [])
      else setMovies((prev) => [...prev, ...(data || [])])
    },
  })

  const loadMore = async () => {
    setLoadingMore(true)
    const np = page + 1
    try {
      const { data } = await getTopRated(np)
      setMovies((prev) => [...prev, ...(data.movies || [])])
      setPage(np)
    } catch {}
    setLoadingMore(false)
  }

  if (isLoading) return <div className="flex justify-center py-20"><Loader text="Loading top rated..." /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-cinema text-white mb-2">Top Rated</h1>
        <p className="text-gray-400 mb-6">The highest-rated movies of all time</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((item, i) => <MovieCard key={item.id} item={item} index={i} />)}
        </div>
        <div className="text-center mt-8">
          <button onClick={loadMore} disabled={loadingMore}
            className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-full font-medium transition-colors disabled:opacity-50">
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
