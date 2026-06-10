import { useState } from 'react'

function StarIcon({ filled, half, size = 'md', onClick, onHover }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  const cls = sizes[size] || sizes.md
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      className={`${cls} transition-transform ${onClick ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <defs>
          <linearGradient id={`half-${half}`}>
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={filled ? '#facc15' : half ? `url(#half-${half})` : 'transparent'}
          stroke={filled || half ? '#facc15' : '#4b5563'}
          strokeWidth="1.5"
          className="transition-colors"
        />
      </svg>
    </button>
  )
}

export default function StarRating({ value, onChange, size = 'lg', count, showValue = true }) {
  const [hover, setHover] = useState(0)
  const display = hover || value || 0

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <StarIcon
          key={star}
          filled={star <= display}
          half={!Number.isInteger(display) && star === Math.ceil(display)}
          size={size}
          onClick={onChange ? () => onChange(star) : undefined}
          onHover={onChange ? () => setHover(star) : undefined}
        />
      ))}
      {onChange && (
        <span
          className="ml-2 text-gray-400 text-xs cursor-pointer hover:text-white transition-colors"
          onClick={() => { setHover(0); onChange(0) }}
        >
          Clear
        </span>
      )}
      {showValue && display > 0 && (
        <span className="ml-2 text-white font-bold text-sm">{display}/10</span>
      )}
      {count != null && (
        <span className="ml-1 text-gray-500 text-xs">{count.toLocaleString()} votes</span>
      )}
    </div>
  )
}
