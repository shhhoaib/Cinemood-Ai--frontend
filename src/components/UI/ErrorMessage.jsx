export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null

  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center max-w-md mx-auto">
      <p className="text-red-400 text-sm mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-white bg-cinema-red px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
