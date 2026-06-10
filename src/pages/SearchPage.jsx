import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { searchMulti } from '../api/backend'
import MovieCard from '../components/MovieCard/MovieCard'

const GENRES = [
  { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' }, { id: 10749, name: 'Romance' }, { id: 53, name: 'Thriller' },
  { id: 16, name: 'Animation' }, { id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' },
  { id: 14, name: 'Fantasy' }, { id: 9648, name: 'Mystery' }, { id: 80, name: 'Crime' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [input, setInput] = useState(query)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [genreFilter, setGenreFilter] = useState('')

  useEffect(() => {
    if (!query) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const { data } = await searchMulti(query)
        let filtered = data.results || []
        if (typeFilter !== 'all') filtered = filtered.filter((r) => r.media_type === typeFilter)
        if (genreFilter) filtered = filtered.filter((r) => r.genre_ids?.includes(Number(genreFilter)))
        setResults(filtered)
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, typeFilter, genreFilter])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) setSearchParams({ q: input.trim() })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative max-w-2xl mx-auto">
          <input
            value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Search movies & TV shows..."
            className="w-full bg-cinema-navy border border-white/10 rounded-2xl py-4 px-6 pl-14 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-cinema-red transition-colors"
          />
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-cinema-navy border border-white/10 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-cinema-red">
          <option value="all">All Types</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}
          className="bg-cinema-navy border border-white/10 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-cinema-red">
          <option value="">All Genres</option>
          {GENRES.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        {query && <p className="text-gray-400 text-sm ml-auto">Results for "{query}"</p>}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[2/3] rounded-xl bg-cinema-navy animate-pulse" />
              <div className="mt-2 space-y-1.5">
                <div className="h-3 bg-cinema-navy rounded animate-pulse w-3/4" />
                <div className="h-2 bg-cinema-navy rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((item, i) => <MovieCard key={`${item.media_type}-${item.id}`} item={item} index={i} />)}
        </div>
      ) : query ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <span className="text-5xl block mb-4">🔍</span>
          <h3 className="text-white font-cinema text-xl mb-2">No Results Found</h3>
          <p className="text-gray-400">Try a different search term or adjust filters</p>
        </motion.div>
      ) : null}
    </div>
  )
}
