import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getForYou, getUserProfile, getDnaPicks } from '../api/backend'
import { useAuthStore } from '../store/useAuthStore'
import MovieCard from '../components/MovieCard/MovieCard'
import SkeletonGrid from '../components/UI/SkeletonGrid'
import InfiniteScroll from '../components/UI/InfiniteScroll'

export default function ForYou() {
  const [page, setPage] = useState(1)
  const [allRecs, setAllRecs] = useState([])
  const [source, setSource] = useState('dna')
  const [hasMore, setHasMore] = useState(true)
  const { user, dna } = useAuthStore()
  const userId = user?.id || 'default'

  const { data: profile } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => getUserProfile(),
    select: (r) => r.data.profile,
  })

  const hasHistory = profile && profile?.total_watched > 0

  const { isFetching, isPending } = useQuery({
    queryKey: ['for-you', userId, page, hasHistory ? 'history' : 'dna'],
    queryFn: async () => {
      if (hasHistory) {
        const r = await getForYou(userId, page)
        const recs = r.data.recommendations || []
        setSource('history')
        setHasMore(recs.length === 20)
        if (page === 1) setAllRecs(recs)
        else setAllRecs((prev) => [...prev, ...recs])
        return recs
      }
      const r = await getDnaPicks(userId, page)
      const recs = r.data.recommendations || []
      setSource('dna')
      setHasMore(r.data.has_more !== false)
      if (page === 1) setAllRecs(recs)
      else setAllRecs((prev) => [...prev, ...recs])
      return recs
    },
    enabled: !!profile,
  })

  const loadMore = useCallback(() => {
    if (!isFetching) setPage((p) => p + 1)
  }, [isFetching])

  const movies = allRecs
  const isLoading = isPending && page === 1 && movies.length === 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{dna?.primary?.emoji || '\U0001f3af'}</span>
        <div>
          <h1 className="text-3xl md:text-4xl font-cinema text-white">Picked for You</h1>
          {dna && (
            <p className="text-cinema-red text-sm font-medium">{dna.primary.name} {dna.primary.emoji}</p>
          )}
          <p className="text-gray-400 text-xs mt-0.5">
            {source === 'dna' ? 'Based on your movie DNA profile' : 'Based on your watch history and taste'}
          </p>
        </div>
      </div>

      {/* DNA Archetype Banner */}
      {dna && !profile?.total_watched && (
        <div className="bg-gradient-to-r from-cinema-red/10 via-cinema-navy/50 to-transparent border border-cinema-red/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{dna.primary.emoji}</span>
            <div>
              <p className="text-white text-sm font-semibold">{dna.primary.name}</p>
              <p className="text-gray-400 text-xs italic">{dna.primary.tagline}</p>
            </div>
          </div>
          {dna.top_genres?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {dna.top_genres.map((g) => (
                <span key={g} className="bg-cinema-red/10 text-cinema-red text-xs px-2 py-0.5 rounded-full">{g}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {(isLoading && profile?.total_watched > 0) ? (
        <SkeletonGrid count={12} />
      ) : movies.length > 0 ? (
        <InfiniteScroll onLoad={loadMore} loading={isFetching} hasMore={hasMore}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((item, i) => <MovieCard key={`${item.id}-${i}`} item={item} index={i} />)}
          </div>
        </InfiniteScroll>
      ) : !isFetching ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-2">Setting up your recommendations...</p>
          <p className="text-gray-600 text-sm">Update your movie preferences in your profile to get started.</p>
        </div>
      ) : null}
    </motion.div>
  )
}
