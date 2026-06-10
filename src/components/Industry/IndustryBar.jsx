import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const INDUSTRIES = [
  { id: 'bollywood', name: 'Bollywood', flag: '🇮🇳' },
  { id: 'hollywood', name: 'Hollywood', flag: '🇺🇸' },
  { id: 'korean', name: 'Korean', flag: '🇰🇷' },
  { id: 'anime', name: 'Anime', flag: '🇯🇵' },
  { id: 'tamil', name: 'Tamil', flag: '🇮🇳' },
  { id: 'telugu', name: 'Telugu', flag: '🇮🇳' },
  { id: 'punjabi', name: 'Punjabi', flag: '🇮🇳' },
  { id: 'pakistani', name: 'Pakistani', flag: '🇵🇰' },
  { id: 'bengali', name: 'Bengali', flag: '🇧🇩' },
  { id: 'turkish', name: 'Turkish', flag: '🇹🇷' },
]

export default function IndustryBar() {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' })
    }
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-cinema text-lg">Browse by Industry</h2>
        <div className="hidden sm:flex gap-1">
          <button onClick={() => scroll(-1)} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => scroll(1)} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {INDUSTRIES.map((ind) => (
          <motion.div key={ind.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`/industry/${ind.id}`}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cinema-red/40 transition-all whitespace-nowrap flex-shrink-0"
            >
              <span className="text-xl">{ind.flag}</span>
              <span className="text-white text-sm font-medium">{ind.name}</span>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
