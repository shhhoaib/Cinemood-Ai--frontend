import { useEffect, useRef } from 'react'

export default function InfiniteScroll({ onLoad, loading, hasMore = true, children }) {
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (!hasMore || loading) return

    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoad()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, onLoad])

  return (
    <>
      {children}
      <div ref={sentinelRef} className="h-10 w-full" />
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-cinema-red border-t-transparent" />
        </div>
      )}
    </>
  )
}
