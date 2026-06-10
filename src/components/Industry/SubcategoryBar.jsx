import { useRef } from 'react'

const SUBCATEGORIES = [
  { id: 'trending', label: 'Trending' },
  { id: 'top-rated', label: 'Top Rated' },
  { id: 'latest', label: 'Latest' },
  { id: 'action', label: 'Action' },
  { id: 'romance', label: 'Romance' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'drama', label: 'Drama' },
  { id: 'thriller', label: 'Thriller' },
  { id: 'horror', label: 'Horror' },
  { id: 'scifi', label: 'Sci-Fi' },
]

export default function SubcategoryBar({ active, onChange }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <button onClick={() => scroll(-1)} className="hidden sm:block p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex-shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {SUBCATEGORIES.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onChange(sub)}
            className={`text-xs md:text-sm px-4 py-1.5 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
              active?.id === sub.id
                ? 'bg-cinema-red text-white shadow-lg shadow-cinema-red/20'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>
      <button onClick={() => scroll(1)} className="hidden sm:block p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex-shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  )
}
