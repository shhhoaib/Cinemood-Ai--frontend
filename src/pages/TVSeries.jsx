import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getPopularTv, getWatchProviders } from '../api/backend'
import MovieCard from '../components/MovieCard/MovieCard'
import Loader from '../components/UI/Loader'

export default function TVSeries() {
  const [page, setPage] = useState(1)
  const [shows, setShows] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)

  const { data: providers } = useQuery({
    queryKey: ['providers'],
    queryFn: getWatchProviders,
    select: (r) => r.data.providers,
  })

  const { isLoading } = useQuery({
    queryKey: ['popular-tv', page],
    queryFn: () => getPopularTv(page),
    select: (r) => r.data.movies,
    onSuccess: (data) => {
      if (page === 1) setShows(data || [])
      else setShows((prev) => [...prev, ...(data || [])])
    },
  })

  const loadMore = async () => {
    setLoadingMore(true)
    const np = page + 1
    try {
      const { data } = await getPopularTv(np)
      setShows((prev) => [...prev, ...(data.movies || [])])
      setPage(np)
    } catch {}
    setLoadingMore(false)
  }

  if (isLoading && page === 1) return <div className="flex justify-center py-20"><Loader text="Loading TV series..." /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-cinema text-white mb-2">TV Series</h1>
        <p className="text-gray-400 mb-6">Browse popular TV shows</p>

        {/* Streaming Provider Filters */}
        <div className="mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Available on</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {providers?.slice(0, 10).map((p) => (
              <a key={p.provider_id}
                href={`https://www.justwatch.com/pk/search?q=${encodeURIComponent(p.provider_name)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors flex-shrink-0 bg-white/5 text-gray-300 hover:bg-white/10"
                title={`Browse ${p.provider_name} on JustWatch`}>
                {p.logo_path && (
                  <img src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name}
                    className="w-5 h-5 rounded object-contain" />
                )}
                {p.provider_name}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {shows.map((item, i) => <MovieCard key={item.id} item={item} index={i} />)}
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
