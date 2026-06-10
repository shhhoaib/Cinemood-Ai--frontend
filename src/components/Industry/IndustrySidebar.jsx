import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const INDUSTRIES = [
  { id: 'bollywood', name: 'Bollywood', flag: '\u{1F1EE}\u{1F1F3}' },
  { id: 'hollywood', name: 'Hollywood', flag: '\u{1F1FA}\u{1F1F8}' },
  { id: 'korean', name: 'Korean', flag: '\u{1F1F0}\u{1F1F7}' },
  { id: 'anime', name: 'Anime', flag: '\u{1F1EF}\u{1F1F5}' },
  { id: 'tamil', name: 'Tamil', flag: '\u{1F1EE}\u{1F1F3}' },
  { id: 'telugu', name: 'Telugu', flag: '\u{1F1EE}\u{1F1F3}' },
  { id: 'punjabi', name: 'Punjabi', flag: '\u{1F1EE}\u{1F1F3}' },
  { id: 'pakistani', name: 'Pakistani', flag: '\u{1F1F5}\u{1F1F0}' },
  { id: 'bengali', name: 'Bengali', flag: '\u{1F1E7}\u{1F1E9}' },
  { id: 'turkish', name: 'Turkish', flag: '\u{1F1F9}\u{1F1F7}' },
]

const PLATFORMS = [
  { id: 8, name: 'Netflix', color: '#E50914' },
  { id: 384, name: 'HBO', color: '#9B59B6' },
  { id: 9, name: 'Prime Video', color: '#00A8E1' },
  { id: 15, name: 'Hulu', color: '#1CE783' },
  { id: 337, name: 'Disney+', color: '#0063E5' },
]

export default function IndustrySidebar() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const activeProvider = params.get('provider')

  return (
    <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-20 self-start">
      <div className="space-y-5">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold px-1">
            Industries
          </h3>
          <nav className="space-y-0.5">
            {INDUSTRIES.map((ind) => {
              const active = location.pathname === `/industry/${ind.id}`
              return (
                <Link
                  key={ind.id}
                  to={`/industry/${ind.id}`}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    active
                      ? 'bg-cinema-red/10 text-white border border-cinema-red/20 shadow-[inset_0_1px_0_0_rgba(229,9,20,0.1)]'
                      : 'text-gray-400 hover:text-cinema-red hover:bg-cinema-red/[0.06] border border-transparent hover:border-cinema-red/10'
                  }`}
                >
                  <span className="text-base leading-none w-5 text-center flex-shrink-0">
                    {ind.flag}
                  </span>
                  <span className="font-medium truncate">{ind.name}</span>
                  {active && (
                    <motion.span
                      layoutId="industryActive"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-cinema-red shadow-[0_0_6px_rgba(229,9,20,0.6)] flex-shrink-0"
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold px-1">
            Platforms
          </h3>
          <nav className="space-y-0.5">
            {PLATFORMS.map((p) => {
              const isActive = activeProvider === String(p.id)
              return (
                <Link
                  key={p.id}
                  to={`/movies?provider=${p.id}`}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-cinema-red/10 text-white border border-cinema-red/20 shadow-[inset_0_1px_0_0_rgba(229,9,20,0.1)]'
                      : 'text-gray-400 hover:text-cinema-red hover:bg-cinema-red/[0.06] border border-transparent hover:border-cinema-red/10'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white/10 group-hover:ring-cinema-red/30 transition-all duration-200"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="font-medium truncate">{p.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cinema-red shadow-[0_0_6px_rgba(229,9,20,0.6)] flex-shrink-0" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}
