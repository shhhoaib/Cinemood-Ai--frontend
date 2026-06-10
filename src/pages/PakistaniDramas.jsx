import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

export default function PakistaniDramas() {
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [dramas, setDramas] = useState(null)
  const [selectedDrama, setSelectedDrama] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [playing, setPlaying] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`${API}/dramas/channels`)
      .then((r) => setChannels(r.data.channels || []))
      .catch(() => {})
  }, [])

  const selectChannel = async (ch) => {
    setSelectedChannel(ch)
    setSelectedDrama(null)
    setEpisodes([])
    setPlaying(null)
    setDramas(null)
    setLoading(true)
    try {
      const r = await axios.get(`${API}/dramas/channel/${ch.id}`)
      setDramas(r.data.dramas || [])
    } catch { setDramas([]) }
    setLoading(false)
  }

  const selectDrama = async (drama) => {
    setSelectedDrama(drama)
    setPlaying(null)
    setLoading(true)
    try {
      const r = await axios.get(`${API}/dramas/playlist/${drama.id}`, { params: { channel: selectedChannel?.name } })
      setEpisodes(r.data.episodes || [])
    } catch { setEpisodes([]) }
    setLoading(false)
  }

  const playEpisode = (ep) => setPlaying(ep)

  const goBack = () => {
    if (playing) { setPlaying(null); return }
    if (selectedDrama) { setSelectedDrama(null); setEpisodes([]); return }
    if (selectedChannel) { setSelectedChannel(null); setDramas(null); return }
  }

  const ChannelAvatar = ({ ch }) => (
    ch?.avatar ? (
      <img src={ch.avatar} alt={ch.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-2 ring-white/10 group-hover:ring-cinema-red/50 transition-all" />
    ) : (
      <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gradient-to-br from-cinema-red to-red-700 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-cinema-red/50 transition-all shadow-lg shadow-cinema-red/20">
        <span className="text-white font-bold text-2xl">{ch.name?.[0] || '?'}</span>
      </div>
    )
  )

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🇵🇰</span>
        <div>
          <h1 className="text-3xl md:text-4xl font-cinema text-white">Pakistani Dramas</h1>
          <p className="text-gray-400 text-sm">Browse dramas by channel — HUM, Geo, ARY, Green TV</p>
        </div>
      </div>

      <div className="bg-cinema-red/10 border border-cinema-red/20 rounded-xl p-3 mb-6 text-xs text-gray-400">
        ⚠️ Disclaimer: We do not own or host any of the content displayed on this page.
        All videos are sourced from YouTube and are the property of their respective owners.
        This is for informational purposes only.
      </div>

      {(selectedChannel || selectedDrama || playing) && (
        <button onClick={goBack} className="text-sm text-gray-400 hover:text-white mb-4 flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
      )}

      <AnimatePresence>
        {playing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50">
              <iframe
                src={`https://www.youtube.com/embed/${playing.video_id}?autoplay=1&rel=0`}
                title={playing.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-white text-sm mt-2">{playing.title}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Channel Selection */}
      {!selectedChannel && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {channels.map((ch) => (
            <motion.button
              key={ch.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => selectChannel(ch)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-center transition-all group cursor-pointer"
            >
              <ChannelAvatar ch={ch} />
              <h3 className="text-white font-bold text-sm">{ch.name}</h3>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{ch.description}</p>
            </motion.button>
          ))}
        </div>
      )}

      {/* Drama List */}
      {selectedChannel && !selectedDrama && (
        <>
          <h2 className="text-white font-cinema text-xl mb-4">{selectedChannel.name} Dramas</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-xl overflow-hidden">
                  <div className="aspect-video bg-white/5" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : dramas?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {dramas.map((d) => (
                <motion.button
                  key={d.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectDrama(d)}
                  className="bg-white/5 rounded-xl overflow-hidden border border-white/5 hover:border-cinema-red/30 transition-all text-left cursor-pointer"
                >
                  {d.thumbnail ? (
                    <img src={d.thumbnail} alt={d.title} className="w-full aspect-video object-cover" />
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-cinema-navy to-cinema-dark flex items-center justify-center">
                      <svg className="w-10 h-10 text-cinema-red/40" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  )}
                  <div className="p-2.5">
                    <p className="text-white text-sm font-medium truncate">{d.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{d.video_count} episodes</p>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : dramas !== null && dramas.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No dramas found for this channel.</p>
          ) : null}
        </>
      )}

      {/* Episode List */}
      {selectedDrama && (
        <>
          <div className="flex items-center gap-3 mb-4">
            {selectedDrama.thumbnail ? (
              <img src={selectedDrama.thumbnail} alt="" className="w-16 h-9 rounded object-cover" />
            ) : (
              <div className="w-16 h-9 rounded bg-cinema-navy flex items-center justify-center">
                <svg className="w-5 h-5 text-cinema-red/40" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            )}
            <div>
              <h2 className="text-white font-cinema text-xl">{selectedDrama.title}</h2>
              <p className="text-gray-400 text-xs">{selectedChannel?.name} · {episodes.length} episodes</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-6 h-12 bg-white/5 rounded" />
                  <div className="w-20 h-12 bg-white/5 rounded-lg" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : episodes.length > 0 ? (
            <div className="space-y-2">
              {episodes.map((ep) => (
                <motion.button
                  key={ep.video_id}
                  whileHover={{ x: 4 }}
                  onClick={() => playEpisode(ep)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left cursor-pointer ${
                    playing?.video_id === ep.video_id
                      ? 'bg-cinema-red/10 border border-cinema-red/30'
                      : 'bg-white/5 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <span className="text-gray-400 text-xs w-6 text-right flex-shrink-0">{ep.episode}</span>
                  {ep.thumbnail ? (
                    <img src={ep.thumbnail} alt="" className="w-20 h-12 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-12 rounded-lg bg-cinema-navy flex-shrink-0 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm truncate ${playing?.video_id === ep.video_id ? 'text-cinema-red' : 'text-white'}`}>{ep.title}</p>
                    {ep.duration > 0 && <p className="text-gray-500 text-xs mt-0.5">{Math.floor(ep.duration / 60)} min</p>}
                  </div>
                  <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                </motion.button>
              ))}
            </div>
          ) : episodes.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No episodes found.</p>
          ) : null}
        </>
      )}
    </div>
  )
}
