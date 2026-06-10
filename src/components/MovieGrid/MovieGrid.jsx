import MovieCard from '../MovieCard/MovieCard'

export default function MovieGrid({ movies }) {
  if (!movies?.length) return null
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((item, i) => <MovieCard key={item.id} item={item} index={i} />)}
    </div>
  )
}
