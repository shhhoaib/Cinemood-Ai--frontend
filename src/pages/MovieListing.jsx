import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { discoverMovies, getWatchProviders, getByProvider } from '../api/backend'
import MovieCard from '../components/MovieCard/MovieCard'
import SkeletonGrid from '../components/UI/SkeletonGrid'
import InfiniteScroll from '../components/UI/InfiniteScroll'

const GENRES = [
  { id: '', name: 'All' }, { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' }, { id: 27, name: 'Horror' }, { id: 10749, name: 'Romance' },
  { id: 53, name: 'Thriller' }, { id: 16, name: 'Animation' }, { id: 878, name: 'Sci-Fi' },
  { id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' },
]

const SORTS = [
  { id: 'popularity.desc', label: 'Popular' },
  { id: 'primary_release_date.desc', label: 'Latest' },
  { id: 'vote_average.desc', label: 'Top Rated' },
  { id: 'vote_count.desc', label: 'Most Watched' },
]

export default function MovieListing() {
  const [page, setPage] = useState(1)
  const [allMovies, setAllMovies] = useState([])
  const [genreFilter, setGenreFilter] = useState('')
  const [providerFilter, setProviderFilter] = useState('')
  const [activeSort, setActiveSort] = useState('popularity.desc')

  const { data: providers } = useQuery({
    queryKey: ['providers'],
    queryFn: () => getWatchProviders(),
    select: (r) => r.data.providers,
  })

  const { isFetching, isPending } = useQuery({
    queryKey: ['discover-movies', page, activeSort, genreFilter, providerFilter],
    queryFn: async () => {
      let movies
      if (providerFilter) {
        const r = await getByProvider(providerFilter)
        movies = r.data.movies || []
        setAllMovies(movies)
      } else {
        const r = await discoverMovies(page, activeSort, genreFilter || undefined)
        movies = r.data.movies || []
        if (page === 1) setAllMovies(movies)
        else setAllMovies((prev) => [...prev, ...movies])
      }
      return movies
    },
  })

  const handleSortChange = (sortId) => { setActiveSort(sortId); setPage(1); setAllMovies([]) }
  const handleGenreChange = (gId) => { setGenreFilter(gId); setPage(1); setAllMovies([]) }
  const handleProviderChange = (pId) => { setProviderFilter(pId); setPage(1); setAllMovies([]) }

  const loadMore = useCallback(() => {
    if (!isFetching && !providerFilter) setPage((p) => p + 1)
  }, [isFetching, providerFilter])

  const movies = allMovies
  const hasMore = !providerFilter && movies.length >= page * 20
  const isLoading = isPending && page === 1 && movies.length === 0

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-cinema text-white mb-2">Movies</h1>
        <p className="text-gray-400 mb-6">Browse movies — infinite scroll</p>

        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
          {SORTS.map((s) => (
            <button key={s.id} onClick={() => handleSortChange(s.id)}
              className={`text-xs md:text-sm px-4 py-1.5 rounded-full whitespace-nowrap transition-colors ${activeSort === s.id ? 'bg-cinema-red text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>{s.label}</button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Filter by Streaming Service</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => handleProviderChange('')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors flex-shrink-0 ${!providerFilter ? 'bg-cinema-red text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}><span>🎬</span> All</button>
            {providers?.slice(0, 10).map((p) => (
              <button key={p.provider_id} onClick={() => handleProviderChange(String(p.provider_id))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors flex-shrink-0 ${providerFilter === String(p.provider_id) ? 'bg-cinema-red text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                {p.logo_path && <img src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} className="w-5 h-5 rounded object-contain" />}
                {p.provider_name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {GENRES.map((g) => (
            <button key={g.id} onClick={() => handleGenreChange(g.id)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${genreFilter === g.id ? 'bg-cinema-red text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>{g.name}</button>
          ))}
        </div>

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
    </div>
  )
}
