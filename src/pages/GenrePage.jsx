import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { getByGenre } from '../api/backend'
import MovieCard from '../components/MovieCard/MovieCard'
import SkeletonGrid from '../components/UI/SkeletonGrid'
import InfiniteScroll from '../components/UI/InfiniteScroll'

export default function GenrePage() {
  const { id, name } = useParams()
  const displayName = name?.replace(/-/g, ' ') || ''
  const [page, setPage] = useState(1)
  const [allMovies, setAllMovies] = useState([])

  const { isFetching, isPending } = useQuery({
    queryKey: ['genre', id, page],
    queryFn: async () => {
      const res = await getByGenre(Number(id), page)
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
      <h1 className="text-3xl md:text-4xl font-cinema text-white mb-2 capitalize">{displayName}</h1>
      <p className="text-gray-400 mb-6">Browse {displayName} movies</p>
      {isLoading ? (
        <SkeletonGrid count={12} />
      ) : movies.length > 0 ? (
        <InfiniteScroll onLoad={loadMore} loading={isFetching} hasMore={hasMore}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((item, i) => <MovieCard key={`${item.id}-${i}`} item={item} index={i} />)}
          </div>
        </InfiniteScroll>
      ) : !isFetching ? (
        <p className="text-gray-500 text-center py-12">No movies found.</p>
      ) : null}
    </motion.div>
  )
}
