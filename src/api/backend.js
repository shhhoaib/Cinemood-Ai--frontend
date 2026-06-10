import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const analyzeMoodText = (text, events) => api.post('/mood/text', { text, events })
export const analyzeMoodImage = (imageBase64) => api.post('/mood/image', { image_base64: imageBase64 })
export const sendChatMessage = (messages, mood) => api.post('/chat/message', { messages, mood })

export const getTrending = () => api.get('/movies/trending')
export const getTrendingTv = () => api.get('/movies/trending/tv')
export const getPopular = (page = 1) => api.get('/movies/popular', { params: { page } })
export const getPopularTv = (page = 1) => api.get('/movies/popular/tv', { params: { page } })
export const getTopRated = (page = 1) => api.get('/movies/top-rated', { params: { page } })
export const getByGenre = (genreId, page = 1) => api.get(`/movies/genre/${genreId}`, { params: { page } })
export const getMovieDetail = (id) => api.get(`/movies/detail/${id}`)
export const getTvDetail = (id) => api.get(`/movies/tv/detail/${id}`)
export const searchMovies = (query, page = 1) => api.get('/movies/search', { params: { query, page } })
export const searchMulti = (query, page = 1) => api.get('/movies/search/multi', { params: { query, page } })
export const getGenres = () => api.get('/movies/genres')
export const getWatchProviders = (region = 'PK') => api.get('/movies/providers', { params: { region } })
export const getByProvider = (providerId) => api.get(`/movies/streaming/${providerId}`)
export const getTvSeasons = (tvId) => api.get(`/movies/tv/${tvId}/seasons`)
export const getTvEpisodes = (tvId, seasonNumber) => api.get(`/movies/tv/${tvId}/season/${seasonNumber}`)
export const getIndustries = () => api.get('/movies/industries')
export const getIndustryMovies = (industryId, page = 1, subcategory = null, mediaType = 'movie', watchProvider = null) =>
  api.get(`/movies/industry/${industryId}`, { params: { page, subcategory, media_type: mediaType, watch_provider: watchProvider } })
export const discoverMovies = (page = 1, sortBy = 'popularity.desc', genreId = null) =>
  api.get('/movies/discover', { params: { page, sort_by: sortBy, genre_id: genreId } })
export const getNowPlaying = (page = 1) => api.get('/movies/now-playing', { params: { page } })
export const getUpcoming = (page = 1) => api.get('/movies/upcoming', { params: { page } })
export const getForYou = (userId = 'default', page = 1) => api.get('/recommend/for-you', { params: { user_id: userId, page } })
export const getUserProfile = (userId = 'default') => api.get('/recommend/profile', { params: { user_id: userId } })
export const trackWatch = (data) => api.post('/recommend/track/watch', data)
export const trackLike = (data) => api.post('/recommend/track/like', data)
export const trackRating = (data) => api.post('/recommend/track/rating', data)
export const trackSearch = (data) => api.post('/recommend/track/search', data)

export const registerUser = (data) => api.post('/users/register', data)
export const loginUser = (data) => api.post('/users/login', data)
export const getMe = (token) => api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
export const updateProfile = (data, token) => api.put('/users/me', data, { headers: { Authorization: `Bearer ${token}` } })
export const getUserDna = (userId) => api.get(`/users/dna/${userId}`)
export const getProvidersTrending = () => api.get('/movies/providers/trending')
export const getDnaPicks = (userId, page = 1) => api.get(`/recommend/dna-picks/${userId}?page=${page}`)
export const getMovieMoodProfile = (movieId) => api.get(`/movies/mood-profile/${movieId}`)
export const getPersonCredits = (personId) => api.get(`/movies/person/${personId}`)
