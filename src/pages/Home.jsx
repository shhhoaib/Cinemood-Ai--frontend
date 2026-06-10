import { useQuery } from '@tanstack/react-query'
import { getTrending, getTrendingTv, getPopular, getNowPlaying, getUpcoming, getProvidersTrending, getDnaPicks } from '../api/backend'
import { useAuthStore } from '../store/useAuthStore'
import HeroBanner from '../components/Hero/HeroBanner'
import HorizontalScroll from '../components/Hero/HorizontalScroll'
import MoodPicker from '../components/MoodPicker/MoodPicker'
import MovieGrid from '../components/MovieGrid/MovieGrid'
import IndustrySidebar from '../components/Industry/IndustrySidebar'
import UserDnaBadge from '../components/UserDnaBadge/UserDnaBadge'
import { useMoodStore } from '../store/useMoodStore'

const PROVIDER_LABELS = {
  netflix: { name: 'Netflix', color: 'from-red-700/30' },
  prime: { name: 'Prime Video', color: 'from-blue-600/30' },
  disney: { name: 'Disney+', color: 'from-indigo-600/30' },
  apple: { name: 'Apple TV+', color: 'from-gray-600/30' },
  hulu: { name: 'Hulu', color: 'from-green-600/30' },
}

export default function Home() {
  const { mood, movies, loading } = useMoodStore()
  const { user } = useAuthStore()

  const { data: trending, isPending: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => getTrending(),
    select: (r) => r.data.movies,
  })

  const { data: popular } = useQuery({
    queryKey: ['popular'],
    queryFn: () => getPopular(1),
    select: (r) => r.data.movies,
  })

  const { data: trendingTv } = useQuery({
    queryKey: ['trending-tv'],
    queryFn: () => getTrendingTv(),
    select: (r) => r.data.movies,
  })

  const { data: providersData } = useQuery({
    queryKey: ['providers-trending'],
    queryFn: () => getProvidersTrending(),
    select: (r) => r.data.providers,
  })

  const { data: nowPlaying } = useQuery({
    queryKey: ['now-playing'],
    queryFn: () => getNowPlaying(1),
    select: (r) => r.data.movies,
    staleTime: 1000 * 60 * 60,
  })

  const { data: upcoming } = useQuery({
    queryKey: ['upcoming-home'],
    queryFn: () => getUpcoming(1),
    select: (r) => r.data.movies,
    staleTime: 1000 * 60 * 60,
  })

  const { data: dnaPicks, isPending: dnaLoading } = useQuery({
    queryKey: ['dna-picks', user?.id],
    queryFn: () => getDnaPicks(user.id),
    enabled: !!user?.id,
    select: (r) => r.data.recommendations,
  })

  return (
    <div className="relative z-10">
      <HeroBanner movies={trending} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
        {/* User DNA Badge */}
        <div className="mb-6">
          <UserDnaBadge />
        </div>

        {/* DNA-Powered Recommendations */}
        {user && dnaPicks && dnaPicks.length > 0 && (
          <div className="mb-8">
            <HorizontalScroll title="Your DNA Picks" items={dnaPicks} isLoading={dnaLoading} link="/for-you" />
          </div>
        )}

        {mood && movies.length > 0 && !loading && (
          <div className="bg-gradient-to-r from-cinema-red/10 to-transparent rounded-2xl p-4 md:p-5 mb-6 border border-cinema-red/20">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getEmoji(mood.emotion)}</span>
                <div>
                  <h2 className="text-white font-semibold capitalize">{mood.emotion} Mood</h2>
                  <p className="text-gray-400 text-sm">{mood.summary}</p>
                </div>
              </div>
              <button onClick={() => useMoodStore.getState().reset()} className="text-sm text-gray-400 hover:text-white transition-colors">✕ Clear</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {mood.genres?.map((g) => (
                <span key={g} className="bg-cinema-red/20 text-cinema-red text-xs px-3 py-1 rounded-full border border-cinema-red/30">{g}</span>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-cinema-red border-t-transparent" />
          </div>
        )}
        {mood && movies.length > 0 && !loading && (
          <div className="mb-10">
            <h2 className="text-white font-cinema text-xl mb-4">Movies for Your Mood</h2>
            <MovieGrid movies={movies} />
          </div>
        )}

        <div className="flex gap-6">
          <IndustrySidebar />

          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <MoodPicker />
            </div>

            <HorizontalScroll title="Trending Now" items={trending} isLoading={trendingLoading} link="/movies" />
            <HorizontalScroll title="Popular Movies" items={popular} isLoading={trendingLoading} link="/movies" />
            <HorizontalScroll title="Trending TV Series" items={trendingTv} isLoading={trendingLoading} link="/tv" />

            <HorizontalScroll title="Now in Cinemas" items={nowPlaying} isLoading={trendingLoading} link="/movies" />
            <HorizontalScroll title="Coming Soon" items={upcoming} isLoading={trendingLoading} link="/upcoming" />

            {/* Trending by Streaming Platform */}
            {providersData && Object.entries(providersData).map(([key, items]) => {
              if (!items || items.length === 0) return null
              const provider = PROVIDER_LABELS[key] || { name: key, color: 'from-gray-600/30' }
              return (
                <div key={key} className="mb-8">
                  <div className={`bg-gradient-to-r ${provider.color} to-transparent rounded-xl p-4 mb-3 border border-white/5`}>
                    <h3 className="text-white font-cinema text-lg font-bold">{provider.name}</h3>
                    <p className="text-gray-500 text-xs">Trending on {provider.name}</p>
                  </div>
                  <HorizontalScroll title="" items={items} isLoading={false} link="/movies" />
                </div>
              )
            })}
          </div>
        </div>

        <footer className="border-t border-white/5 mt-16 py-12 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-red/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-white font-cinema text-2xl tracking-[0.15em] font-bold">CINEMOOD</span>
              <span className="w-2 h-2 rounded-full bg-cinema-red shadow-lg shadow-cinema-red/50" />
            </div>
            <p className="text-gray-500 text-sm max-w-md mx-auto">AI-powered mood-driven movie recommendations.</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600">
              <span>© 2026 CineMood</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span>All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function getEmoji(emotion) {
  const map = {
    happy: '😊', sad: '😢', excited: '🎉', relaxed: '😌',
    romantic: '💕', scared: '😨', angry: '😤', nostalgic: '🥹',
    bored: '😐', motivated: '💪',
  }
  return map[emotion?.toLowerCase()] || '🎬'
}
