import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getIndustryMovies, getWatchProviders } from '../api/backend'
import MovieCard from '../components/MovieCard/MovieCard'
import SkeletonGrid from '../components/UI/SkeletonGrid'
import InfiniteScroll from '../components/UI/InfiniteScroll'
import IndustryBar from '../components/Industry/IndustryBar'
import { useState, useCallback, useEffect } from 'react'

const INDUSTRY_META = {
  bollywood: { name: 'Bollywood', flag: '🇮🇳', description: 'Hindi Cinema (Bollywood)' },
  hollywood: { name: 'Hollywood', flag: '🇺🇸', description: 'English Cinema (Hollywood)' },
  korean: { name: 'Korean', flag: '🇰🇷', description: 'Korean Cinema & K-Drama' },
  anime: { name: 'Anime', flag: '🇯🇵', description: 'Japanese Animation' },
  tamil: { name: 'Tamil', flag: '🇮🇳', description: 'Tamil Cinema (Kollywood)' },
  telugu: { name: 'Telugu', flag: '🇮🇳', description: 'Telugu Cinema (Tollywood)' },
  punjabi: { name: 'Punjabi', flag: '🇮🇳', description: 'Punjabi Cinema' },
  pakistani: { name: 'Pakistani', flag: '🇵🇰', description: 'Urdu Cinema (Pakistan)' },
  bengali: { name: 'Bengali', flag: '🇧🇩', description: 'Bengali Cinema' },
  turkish: { name: 'Turkish', flag: '🇹🇷', description: 'Turkish Cinema & Series' },
}

const REGION_MAP = {
  bollywood: 'IN', hollywood: 'US', korean: 'KR', anime: 'JP',
  tamil: 'IN', telugu: 'IN', punjabi: 'IN', pakistani: 'PK',
  bengali: 'IN', turkish: 'TR',
}

const SUBCATEGORIES = [
  { id: 'trending', label: 'Trending' },
  { id: 'latest', label: 'Latest' },
  { id: 'top-rated', label: 'Top Rated' },
  { id: 'action', label: 'Action' },
  { id: 'romance', label: 'Romance' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'drama', label: 'Drama' },
  { id: 'thriller', label: 'Thriller' },
  { id: 'horror', label: 'Horror' },
  { id: 'scifi', label: 'Sci-Fi' },
]

export default function IndustryPage() {
  const { id } = useParams()
  const [page, setPage] = useState(1)
  const [allMovies, setAllMovies] = useState([])
  const [activeSub, setActiveSub] = useState('trending')
  const [mediaType, setMediaType] = useState('movie')
  const [watchProvider, setWatchProvider] = useState('')
  const [showFilter, setShowFilter] = useState(false)

  const industry = INDUSTRY_META[id] || { name: id, flag: '🎬', description: '' }
  const region = REGION_MAP[id] || 'PK'

  useEffect(() => {
    setPage(1)
    setAllMovies([])
    setActiveSub('trending')
    setMediaType('movie')
    setWatchProvider('')
    setShowFilter(false)
  }, [id])

  const { data: providers } = useQuery({
    queryKey: ['industry-providers', region],
    queryFn: () => getWatchProviders(region),
    select: (r) => r.data.providers?.slice(0, 15),
  })

  const { isFetching, isPending } = useQuery({
    queryKey: ['industry', id, activeSub, page, mediaType, watchProvider],
    queryFn: async () => {
      const res = await getIndustryMovies(id, page, activeSub, mediaType, watchProvider || null)
      const movies = res.data.movies || []
      if (page === 1) setAllMovies(movies)
      else setAllMovies((prev) => [...prev, ...movies])
      return movies
    },
  })

  const handleSubChange = (subId) => {
    if (subId === activeSub) return
    setActiveSub(subId)
    setPage(1)
    setAllMovies([])
  }

  const handleMediaToggle = (type) => {
    if (type === mediaType) return
    setMediaType(type)
    setPage(1)
    setAllMovies([])
    setActiveSub('trending')
  }

  const handleProviderChange = (pId) => {
    setWatchProvider(pId)
    setPage(1)
    setAllMovies([])
  }

  const loadMore = useCallback(() => {
    if (!isFetching) setPage((p) => p + 1)
  }, [isFetching])

  const movies = allMovies
  const hasMore = movies.length >= page * 20
  const isLoading = isPending && page === 1 && movies.length === 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{industry.flag}</span>
        <h1 className="text-3xl md:text-4xl font-cinema text-white">{industry.name}</h1>
      </div>

      <IndustryBar />

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex bg-white/5 rounded-xl p-0.5">
          <button onClick={() => handleMediaToggle('movie')}
            className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all ${mediaType === 'movie' ? 'bg-cinema-red text-white shadow-lg shadow-cinema-red/25' : 'text-gray-400 hover:text-white'}`}>Movies</button>
          <button onClick={() => handleMediaToggle('tv')}
            className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all ${mediaType === 'tv' ? 'bg-cinema-red text-white shadow-lg shadow-cinema-red/25' : 'text-gray-400 hover:text-white'}`}>TV Series</button>
        </div>
        <button onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all ${watchProvider ? 'bg-cinema-red text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          {watchProvider ? 'Filtered' : 'Filter by Platform'}
        </button>
        {watchProvider && <button onClick={() => handleProviderChange('')} className="text-xs text-gray-500 hover:text-white transition-colors">✕ Clear</button>}
      </div>

      {showFilter && providers && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden mb-4">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Available in {region}</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleProviderChange('')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${!watchProvider ? 'bg-cinema-red text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>🎬 All</button>
              {providers.map((p) => (
                <button key={p.provider_id} onClick={() => handleProviderChange(String(p.provider_id))}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all ${watchProvider === String(p.provider_id) ? 'bg-cinema-red text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {p.logo_path && <img src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} className="w-4 h-4 rounded object-contain" />}
                  {p.provider_name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
        {SUBCATEGORIES.map((sub) => (
          <motion.button key={sub.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => handleSubChange(sub.id)}
            className={`px-3 py-2.5 rounded-xl text-sm transition-all ${activeSub === sub.id ? 'bg-gradient-to-r from-cinema-red to-red-700 text-white shadow-lg shadow-cinema-red/25' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'}`}>
            <span className="font-medium">{sub.label}</span>
          </motion.button>
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
        <p className="text-gray-500 text-center py-12">No results found.</p>
      ) : null}
    </motion.div>
  )
}
