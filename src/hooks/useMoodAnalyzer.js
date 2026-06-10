import { useMoodStore } from '../store/useMoodStore'
import { analyzeMoodText, analyzeMoodImage } from '../api/backend'

export function useMoodAnalyzer() {
  const { setMood, setMovies, setLoading, setError } = useMoodStore()

  const analyzeText = async (text, events = '') => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await analyzeMoodText(text, events)
      setMood(data.mood)
      setMovies(data.movies)
      return data
    } catch (e) {
      const msg = e.response?.data?.detail || 'Failed to analyze mood'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const analyzeImage = async (base64) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await analyzeMoodImage(base64)
      setMood(data.mood)
      setMovies(data.movies)
      return data
    } catch (e) {
      const msg = e.response?.data?.detail || 'Failed to analyze image'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { analyzeText, analyzeImage }
}
