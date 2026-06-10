export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <svg className="animate-spin h-10 w-10 text-cinema-red" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs">🎬</span>
        </div>
      </div>
      <p className="text-gray-400 mt-4 text-sm">{text}</p>
    </div>
  )
}
