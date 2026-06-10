const IMG_BASE = 'https://image.tmdb.org/t/p'

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null
  return `${IMG_BASE}/${size}${path}`
}

export const getBackdropUrl = (path) => {
  if (!path) return null
  return `${IMG_BASE}/w1280${path}`
}

export const getYoutubeEmbedUrl = (key) => {
  if (!key) return null
  return `https://www.youtube.com/embed/${key}`
}
