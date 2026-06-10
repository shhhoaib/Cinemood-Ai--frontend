import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getTrending, getTrendingTv } from '../api/backend'
import MovieCard from '../components/MovieCard/MovieCard'
import Loader from '../components/UI/Loader'

export default function TrendingPage() {
  const [tab, setTab] = useState('movies')

  const { data: movies, isLoading: moviesLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: getTrending,
    select: (r) => r.data.movies,
    enabled: tab === 'movies',
  })

  const { data: shows, isLoading: tvLoading } = useQuery({
    queryKey: ['trending-tv'],
    queryFn: getTrendingTv,
    select: (r) => r.data.movies,
    enabled: tab === 'tv',
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-cinema text-white mb-2">Trending</h1>
        <p className="text-gray-400 mb-6">What's popular this week</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-cinema-navy rounded-xl p-1 w-fit mb-6">
          <button onClick={() => setTab('movies')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'movies' ? 'bg-cinema-red text-white' : 'text-gray-400 hover:text-white'}`}>
            Movies
          </button>
          <button onClick={() => setTab('tv')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'tv' ? 'bg-cinema-red text-white' : 'text-gray-400 hover:text-white'}`}>
            TV Shows
          </button>
        </div>

        {tab === 'movies' && (moviesLoading ? <Loader /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies?.map((item, i) => <MovieCard key={item.id} item={item} index={i} />)}
          </div>
        ))}
        {tab === 'tv' && (tvLoading ? <Loader /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {shows?.map((item, i) => <MovieCard key={item.id} item={item} index={i} />)}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
