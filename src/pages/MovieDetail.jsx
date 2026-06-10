import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getMovieDetail, getTvDetail, getMovieMoodProfile } from '../api/backend'
import HorizontalScroll from '../components/Hero/HorizontalScroll'
import Loader from '../components/UI/Loader'
import Reviews from '../components/Reviews/Reviews'

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = window.location
  const isTv = location.pathname.startsWith('/tv/')

  const { data: movie, isLoading, error, refetch } = useQuery({
    queryKey: ['movie', id, isTv],
    queryFn: () => isTv ? getTvDetail(id) : getMovieDetail(id),
    select: (r) => r.data.movie,
  })

  const { data: moodProfile, isFetching: mpLoading } = useQuery({
    queryKey: ['mood-profile', id],
    queryFn: () => getMovieMoodProfile(id),
    select: (r) => r.data.emotional_profile,
    enabled: !isTv,
    staleTime: 1000 * 60 * 60,
  })

  if (isLoading) return <div className="flex justify-center py-20"><Loader text={`Loading ${isTv ? 'series' : 'movie'}...`} /></div>
  if (error || !movie) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-gray-400 mb-4">Failed to load details</p>
      <button onClick={refetch} className="bg-cinema-red text-white px-6 py-2 rounded-full text-sm">Retry</button>
    </div>
  )

  const trailerUrl = movie.trailer_key ? `https://www.youtube.com/embed/${movie.trailer_key}` : null

  const EMOTION_COLORS = {
    excitement: { label: 'Excitement', color: 'bg-orange-500', emoji: '⚡' },
    humor: { label: 'Humor', color: 'bg-yellow-400', emoji: '😂' },
    romance: { label: 'Romance', color: 'bg-pink-400', emoji: '💕' },
    tension: { label: 'Tension', color: 'bg-purple-500', emoji: '😬' },
    sadness: { label: 'Sadness', color: 'bg-blue-400', emoji: '😢' },
    fear: { label: 'Fear', color: 'bg-indigo-600', emoji: '😨' },
    inspiration: { label: 'Inspiration', color: 'bg-emerald-400', emoji: '✨' },
    intrigue: { label: 'Intrigue', color: 'bg-cyan-400', emoji: '🧐' },
    warmth: { label: 'Warmth', color: 'bg-rose-400', emoji: '🤗' },
    nostalgia: { label: 'Nostalgia', color: 'bg-amber-400', emoji: '🥹' },
  }

  const MOOD_EMOJIS = {
    happy: '😊', sad: '😢', excited: '🎉', relaxed: '😌', romantic: '💕',
    scared: '😨', thoughtful: '🤔', adventurous: '🗺️', nostalgic: '🥹', funny: '😂',
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 h-[50vh]">
        {movie.backdrop && <img src={movie.backdrop} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-cinema-dark/20 via-cinema-dark/60 to-cinema-dark" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-6 md:gap-10 mt-4">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} className="w-48 md:w-64 rounded-xl shadow-2xl" />
            ) : (
              <div className="w-48 md:w-64 aspect-[2/3] rounded-xl bg-cinema-deep flex items-center justify-center">{isTv ? '📺' : '🎬'}</div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-cinema text-white">{movie.title}</h1>
            {movie.tagline && <p className="text-gray-400 italic mt-1">{movie.tagline}</p>}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
              <span className="text-cinema-gold font-semibold text-lg">★ {movie.rating?.toFixed(1)}</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300">{movie.year}</span>
              {!isTv && movie.runtime > 0 && <><span className="text-gray-500">|</span><span className="text-gray-300">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span></>}
              {movie.status && <><span className="text-gray-500">|</span><span className={`${movie.status === 'Released' || movie.status === 'Returning Series' ? 'text-green-400' : 'text-yellow-400'}`}>{movie.status}</span></>}
              {isTv && movie.number_of_seasons > 0 && <><span className="text-gray-500">|</span><span className="text-gray-300">{movie.number_of_seasons} Season{movie.number_of_seasons > 1 ? 's' : ''}</span></>}
            </div>

            {/* Multi-source Ratings */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              {/* TMDB */}
              {movie.tmdb_rating != null && (
                <div className="flex items-center gap-1.5 bg-cinema-dark/60 rounded-lg px-2.5 py-1.5 border border-white/5">
                  <span className="text-[10px] font-bold text-cinema-gold">TMDB</span>
                  <span className="text-white font-semibold text-sm">{movie.tmdb_rating.toFixed(1)}</span>
                </div>
              )}
              {/* IMDB Rating Badge */}
              {movie.imdb_rating != null ? (
                <a href={movie.imdb_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-yellow-500/10 rounded-lg px-2.5 py-1.5 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors group">
                  <span className="text-[10px] font-bold text-yellow-400">IMDb</span>
                  <span className="text-white font-semibold text-sm">{movie.imdb_rating.toFixed(1)}</span>
                  <svg className="w-3 h-3 text-yellow-400/50 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                </a>
              ) : movie.imdb_url ? (
                <a href={movie.imdb_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-yellow-500/10 rounded-lg px-2.5 py-1.5 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
                  <span className="text-[10px] font-bold text-yellow-400">IMDb</span>
                  <span className="text-xs text-gray-400">View</span>
                </a>
              ) : null}
              {/* Rotten Tomatoes Badge */}
              {movie.rt_tomatometer != null && (
                <a href={`https://www.rottentomatoes.com/m/${movie.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border transition-colors group"
                  style={{ backgroundColor: movie.rt_tomatometer >= 60 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', borderColor: movie.rt_tomatometer >= 60 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)' }}>
                  <span className="text-[10px] font-bold" style={{ color: movie.rt_tomatometer >= 60 ? '#22c55e' : '#ef4444' }}>RT</span>
                  <span className="text-white font-semibold text-sm">{movie.rt_tomatometer}%</span>
                </a>
              )}
              {/* Metacritic Badge */}
              {movie.metacritic_score != null && (
                <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border"
                  style={{ backgroundColor: movie.metacritic_score >= 60 ? 'rgba(34,197,94,0.1)' : movie.metacritic_score >= 40 ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)', borderColor: movie.metacritic_score >= 60 ? 'rgba(34,197,94,0.2)' : movie.metacritic_score >= 40 ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)' }}>
                  <span className="text-[10px] font-bold" style={{ color: movie.metacritic_score >= 60 ? '#22c55e' : movie.metacritic_score >= 40 ? '#eab308' : '#ef4444' }}>Meta</span>
                  <span className="text-white font-semibold text-sm">{movie.metacritic_score}</span>
                </div>
              )}
              {/* Certification */}
              {movie.certification && (
                <div className="flex items-center bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/10">
                  <span className="text-xs font-bold text-gray-300">{movie.certification}</span>
                </div>
              )}
              {/* JustWatch Link */}
              {movie.justwatch_url && (
                <a href={movie.justwatch_url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-cinema-red transition-colors">
                  Where to Watch →
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {movie.genre_names?.map((g) => (
                <Link key={g} to={`/genre/${movie.genre_ids?.[movie.genre_names.indexOf(g)] || ''}/${g}`}
                  className="text-xs text-white bg-white/10 hover:bg-cinema-red/30 px-3 py-1 rounded-full transition-colors">{g}</Link>
              ))}
            </div>
            <p className="text-gray-300 mt-4 leading-relaxed">{movie.overview}</p>

            {/* Movie Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              {/* Budget */}
              {movie.budget_formatted && (
                <div className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Budget</p>
                  <p className="text-white text-sm font-semibold mt-0.5">{movie.budget_formatted}</p>
                </div>
              )}
              {/* Revenue */}
              {movie.revenue_formatted && (
                <div className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Box Office</p>
                  <p className="text-white text-sm font-semibold mt-0.5">{movie.revenue_formatted}</p>
                </div>
              )}
              {/* Director */}
              {movie.director && (
                <div className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Director</p>
                  {movie.director.id ? (
                    <Link to={`/person/${movie.director.id}`} className="text-cinema-red text-sm font-semibold mt-0.5 block hover:text-red-400 transition-colors">{movie.director.name}</Link>
                  ) : (
                    <p className="text-white text-sm font-semibold mt-0.5">{movie.director.name}</p>
                  )}
                </div>
              )}
              {/* Release Date */}
              {movie.release_date && (
                <div className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Release Date</p>
                  <p className="text-white text-sm font-semibold mt-0.5">
                    {new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
              {/* Runtime (for movies) */}
              {!isTv && movie.runtime > 0 && (
                <div className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Runtime</p>
                  <p className="text-white text-sm font-semibold mt-0.5">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</p>
                </div>
              )}
              {/* Language */}
              {movie.spoken_languages?.length > 0 && (
                <div className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Language</p>
                  <p className="text-white text-sm font-semibold mt-0.5 truncate">{movie.spoken_languages?.join(', ')}</p>
                </div>
              )}
              {/* Original Title (if different) */}
              {movie.original_title && movie.original_title !== movie.title && (
                <div className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 col-span-2 sm:col-span-1">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Original Title</p>
                  <p className="text-white text-sm font-semibold mt-0.5">{movie.original_title}</p>
                </div>
              )}
              {/* TMDB Votes */}
              {movie.tmdb_votes > 0 && (
                <div className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">TMDB Votes</p>
                  <p className="text-white text-sm font-semibold mt-0.5">{movie.tmdb_votes?.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Production Companies */}
            {movie.production_companies?.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Production</p>
                <div className="flex flex-wrap gap-3">
                  {movie.production_companies.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                      {c.logo ? (
                        <img src={c.logo} alt={c.name} className="h-4 object-contain brightness-0 invert" />
                      ) : null}
                      <span className="text-gray-300 text-xs">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Homepage Link */}
            {movie.homepage && (
              <div className="mt-3">
                <a href={movie.homepage} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-cinema-red transition-colors flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Official Website
                </a>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              {trailerUrl && (
                <a
                  href={trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cinema-red hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg shadow-cinema-red/20 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Watch Trailer
                </a>
              )}
              <Link to="/recommend"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all backdrop-blur-sm flex items-center gap-2">
                <span>🎭</span>
                Mood Matches
              </Link>
            </div>

            {/* Trailer Player */}
            {trailerUrl && (
              <div className="mt-6">
                <h3 className="text-white text-sm font-semibold mb-2">Trailer</h3>
                <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={trailerUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="encrypted-media; fullscreen"
                    title="Trailer"
                  />
                </div>
              </div>
            )}

            {/* AI Emotional Profile */}
            {!isTv && moodProfile && (
              <div className="mt-8 bg-cinema-navy/40 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🧬</span>
                  <h3 className="text-white font-semibold text-sm">AI Emotional DNA</h3>
                  <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">AI-Powered</span>
                </div>
                <div className="space-y-2.5">
                  {Object.entries(EMOTION_COLORS).map(([key, meta]) => {
                    const val = moodProfile[key]
                    if (val == null) return null
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400 flex items-center gap-1.5">
                            <span>{meta.emoji}</span>
                            <span>{meta.label}</span>
                          </span>
                          <span className="text-white font-semibold">{val}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${meta.color}`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-3 text-xs">
                  {moodProfile.best_mood && (
                    <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1.5">
                      <span>🎭 Best when feeling</span>
                      <span className="text-white font-semibold">{MOOD_EMOJIS[moodProfile.best_mood] || ''} {moodProfile.best_mood}</span>
                    </div>
                  )}
                  {moodProfile.best_time && (
                    <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1.5">
                      <span>⏰ Best time</span>
                      <span className="text-white font-semibold capitalize">{moodProfile.best_time.replace('_', ' ')}</span>
                    </div>
                  )}
                  {moodProfile.vibe_tags?.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1.5">
                      <span>🏷️</span>
                      {moodProfile.vibe_tags.map((tag) => (
                        <span key={tag} className="text-white bg-cinema-red/20 px-2 py-0.5 rounded-full text-[10px]">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {!isTv && mpLoading && (
              <div className="mt-6 bg-cinema-navy/40 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-4 h-4 rounded-full border-2 border-cinema-red border-t-transparent animate-spin" />
                  <span className="text-gray-400 text-xs">Analyzing emotional DNA...</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Cast */}
        {movie.cast?.length > 0 && (
          <section className="mt-10">
            <h2 className="text-white font-cinema text-xl mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {movie.cast.map((actor, i) => {
                const img = actor.profile ? (
                  <img src={actor.profile} alt={actor.name} className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-transparent group-hover:ring-cinema-red transition-all" loading="lazy" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-cinema-deep flex items-center justify-center mx-auto group-hover:ring-2 group-hover:ring-cinema-red transition-all">🎭</div>
                )
                const name = <p className="text-white text-xs mt-1 truncate group-hover:text-cinema-red transition-colors">{actor.name}</p>
                const character = <p className="text-gray-500 text-[10px] truncate">{actor.character}</p>
                return actor.id ? (
                  <Link key={i} to={`/person/${actor.id}`} className="flex-shrink-0 text-center w-20 group">
                    {img}{name}{character}
                  </Link>
                ) : (
                  <div key={i} className="flex-shrink-0 text-center w-20">
                    {img}{name}{character}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Similar */}
        {movie.similar?.length > 0 && (
          <section className="mt-8">
            <HorizontalScroll title={isTv ? 'Similar Shows' : 'Similar Movies'} items={movie.similar} />
          </section>
        )}

        {/* Reviews / Comments */}
        {id && (
          <section className="pb-16">
            <Reviews contentType={isTv ? 'tv' : 'movie'} contentId={id} />
          </section>
        )}
      </div>
    </div>
  )
}
