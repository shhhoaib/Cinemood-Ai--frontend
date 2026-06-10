import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MovieCard from '../MovieCard/MovieCard'

export default function HorizontalScroll({ title, items, link, isLoading }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-cinema text-xl md:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          {link && (
            <Link to={link} className="text-sm text-gray-400 hover:text-cinema-red transition-colors">
              View All →
            </Link>
          )}
          <div className="hidden sm:flex gap-1">
            <button onClick={() => scroll(-1)} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll(1)} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:-mx-6 md:px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-36 sm:w-40">
              <div className="aspect-[2/3] rounded-xl bg-cinema-navy animate-pulse" />
              <div className="mt-2 space-y-1.5">
                <div className="h-3 bg-cinema-navy rounded animate-pulse w-3/4" />
                <div className="h-2 bg-cinema-navy rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))
        ) : items?.length > 0 ? (
          items.map((item, i) => <MovieCard key={item.id} item={item} index={i} />)
        ) : null}
      </div>
    </motion.section>
  )
}
