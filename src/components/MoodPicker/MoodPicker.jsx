import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Webcam from 'react-webcam'
import { useMoodAnalyzer } from '../../hooks/useMoodAnalyzer'
import { useMoodStore } from '../../store/useMoodStore'

const QUICK_MOODS = [
  { emoji: '😊', label: 'Happy', text: 'I feel happy and cheerful' },
  { emoji: '😢', label: 'Sad', text: 'I feel sad and need comfort' },
  { emoji: '😤', label: 'Angry', text: 'I feel frustrated or angry' },
  { emoji: '😰', label: 'Anxious', text: 'I feel anxious or stressed' },
  { emoji: '😴', label: 'Tired', text: "I'm tired and need something relaxing" },
  { emoji: '❤️', label: 'Romantic', text: 'I feel romantic today' },
  { emoji: '🎉', label: 'Excited', text: "I'm excited and energetic" },
  { emoji: '🌟', label: 'Hopeful', text: 'I feel hopeful and inspired' },
]

export default function MoodPicker() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('quick')
  const [text, setText] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const { analyzeText, analyzeImage } = useMoodAnalyzer()
  const { mood, movies, loading, reset } = useMoodStore()
  const webcamRef = useRef(null)
  const [cameraReady, setCameraReady] = useState(false)

  const handleQuickMood = async (opt) => {
    await analyzeText(opt.text)
    setOpen(false)
  }

  const handleTextSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setChatHistory((prev) => [...prev, { role: 'user', text }])
    await analyzeText(text)
    setChatHistory((prev) => [...prev, { role: 'ai', text: `You seem ${mood?.emotion || '...'}` }])
    setText('')
    setOpen(false)
  }

  const handleCapture = useCallback(async () => {
    const img = webcamRef.current?.getScreenshot()
    if (!img) return
    const base64 = img.split(',')[1]
    await analyzeImage(base64)
    setOpen(false)
  }, [analyzeImage])

  const handleReset = () => {
    reset()
    setChatHistory([])
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cinema-red shadow-lg shadow-cinema-red/40 hover:shadow-cinema-red/60 hover:scale-105 transition-all flex items-center justify-center"
      >
        <span className="text-2xl">🎭</span>
      </button>

      {/* Mini mood banner when active */}
      {mood && !open && (
        <div className="fixed bottom-24 right-6 z-50 bg-cinema-navy/90 backdrop-blur-md border border-cinema-red/30 rounded-xl p-3 max-w-xs shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getEmoji(mood.emotion)}</span>
            <p className="text-white text-sm capitalize">{mood.emotion} · {movies.length} movies</p>
            <button onClick={handleReset} className="text-gray-400 hover:text-white ml-auto text-xs">✕</button>
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-cinema-navy rounded-2xl border border-white/10 w-full max-w-lg overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-white font-cinema text-lg">How do you feel?</h3>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/5">
                {[
                  { id: 'quick', label: 'Quick Mood' },
                  { id: 'chat', label: 'Chat' },
                  { id: 'face', label: 'Face Scan' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      tab === t.id ? 'text-cinema-red border-b-2 border-cinema-red' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-4 max-h-96 overflow-y-auto">
                {tab === 'quick' && (
                  <div className="grid grid-cols-4 gap-3">
                    {QUICK_MOODS.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => handleQuickMood(opt)}
                        disabled={loading}
                        className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-cinema-red/20 border border-white/5 hover:border-cinema-red/40 transition-all disabled:opacity-50"
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="text-xs text-gray-300">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {tab === 'chat' && (
                  <form onSubmit={handleTextSubmit} className="space-y-3">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Tell me how you're feeling..."
                      className="w-full bg-cinema-dark border border-white/10 rounded-xl p-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cinema-red resize-none h-24"
                    />
                    <button
                      type="submit"
                      disabled={!text.trim() || loading}
                      className="w-full bg-cinema-red hover:bg-red-600 disabled:bg-gray-600 text-white py-2.5 rounded-xl font-medium text-sm transition-all"
                    >
                      {loading ? 'Analyzing...' : 'Analyze Mood'}
                    </button>
                  </form>
                )}

                {tab === 'face' && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        onUserMedia={() => setCameraReady(true)}
                        className="rounded-xl border-2 border-white/10 w-full max-w-xs"
                        mirrored
                      />
                      {!cameraReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-cinema-dark/80 rounded-xl">
                          <p className="text-gray-400 text-sm">Loading camera...</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleCapture}
                      disabled={!cameraReady || loading}
                      className="bg-cinema-red hover:bg-red-600 disabled:bg-gray-600 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all"
                    >
                      {loading ? 'Analyzing...' : '📸 Capture & Analyze'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function getEmoji(emotion) {
  const map = {
    happy: '😊', sad: '😢', anxious: '😰', excited: '🎉',
    angry: '😠', romantic: '💕', nostalgic: '🥹', bored: '😐',
    stressed: '😫', hopeful: '🌟', neutral: '😶', tired: '😴',
  }
  return map[emotion?.toLowerCase()] || '🎭'
}
