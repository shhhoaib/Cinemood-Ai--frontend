export const MOOD_GENRE_MAP = {
  happy: ['Comedy', 'Adventure', 'Animation'],
  sad: ['Drama', 'Romance', 'Animation'],
  anxious: ['Comedy', 'Adventure', 'Fantasy'],
  excited: ['Action', 'Science Fiction', 'Adventure'],
  angry: ['Action', 'Thriller', 'Drama'],
  romantic: ['Romance', 'Comedy', 'Drama'],
  nostalgic: ['Drama', 'Animation', 'Fantasy'],
  bored: ['Action', 'Science Fiction', 'Thriller'],
  stressed: ['Comedy', 'Fantasy', 'Animation'],
  hopeful: ['Drama', 'Adventure', 'Fantasy'],
  neutral: ['Drama', 'Comedy', 'Documentary'],
  tired: ['Comedy', 'Animation', 'Fantasy'],
}

export const EMOTION_EMOJIS = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  excited: '🎉',
  angry: '😠',
  romantic: '💕',
  nostalgic: '🥹',
  bored: '😐',
  stressed: '😫',
  hopeful: '🌟',
  neutral: '😶',
  tired: '😴',
}

export function getGenresForEmotion(emotion) {
  return MOOD_GENRE_MAP[emotion?.toLowerCase()] || ['Drama', 'Comedy']
}

export function getEmojiForEmotion(emotion) {
  return EMOTION_EMOJIS[emotion?.toLowerCase()] || '🎬'
}
