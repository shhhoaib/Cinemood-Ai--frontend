import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendChatMessage } from '../../api/backend'
import { useAuthStore } from '../../store/useAuthStore'
import MovieCard from '../MovieCard/MovieCard'
import Loader3D from '../UI/Loader3D'
import BrainScan from '../UI/BrainScan'

const WELCOME = {
  role: 'assistant',
  content: "Hi, I'm your AI Therapist 🧠💬 Tell me how you're feeling today — sad, happy, stressed, anxious, or anything else — and I'll read your emotional state to prescribe the perfect film therapy.",
}

const PRESCRIPTION_EMOJIS = {
  sadness: '\u{1F31E}', anxiety: '\u{1F30A}', stress: '\u{1F9D8}', heartbreak: '\u2764\uFE0F\u200D\u{1FA79}',
  loneliness: '\u{1F30D}', anger: '\u{1F4A5}', burnout: '\u{1F634}', hope: '\u{1F31F}',
  existential: '\u{1F30C}', creativity: '\u{1F4A1}', scared: '\u{1F96F}', nostalgia: '\u{1F3F3}\uFE0F\u200D\u{1F308}',
}

export default function ChatBot({ onMoodUpdate, onScanningChange }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([WELCOME])
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState([])
  const [moviesLoading, setMoviesLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [showMovies, setShowMovies] = useState(false)
  const [prescription, setPrescription] = useState(null)
  const [searchQuery, setSearchQuery] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const silenceTimer = useRef(null)
  const finalTranscript = useRef('')
  const handleSendRef = useRef(null)
  const listeningRef = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const LANGUAGES = ['en-US', 'ur-PK', 'hi-IN', 'en-IN', 'en-GB']
    let langIndex = 0

    const rec = new SpeechRecognition()
    rec.lang = LANGUAGES[langIndex]
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 3

    rec.onresult = (e) => {
      let interim = ''
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) {
          final += r[0].transcript + ' '
        } else {
          interim += r[0].transcript
        }
      }
      if (final) {
        finalTranscript.current += final
        setInput(finalTranscript.current)
      }
      setInterimText(interim)

      if (silenceTimer.current) clearTimeout(silenceTimer.current)
      silenceTimer.current = setTimeout(() => {
        if (finalTranscript.current.trim() && handleSendRef.current) {
          handleSendRef.current(finalTranscript.current.trim())
          finalTranscript.current = ''
          setInterimText('')
        }
      }, 1200)
    }

    rec.onerror = (e) => {
      if (e.error === 'no-speech') return
      if (e.error === 'language-not-supported') {
        langIndex++
        if (langIndex < LANGUAGES.length) {
          rec.lang = LANGUAGES[langIndex]
          try { rec.start() } catch {}
        }
        return
      }
      setListening(false)
      listeningRef.current = false
    }

    rec.onend = () => {
      if (listeningRef.current) {
        try { rec.start() } catch {}
      }
    }

    recognitionRef.current = rec
  }, [])

  const toggleVoice = useCallback(() => {
    if (!recognitionRef.current) return
    if (listeningRef.current) {
      recognitionRef.current.stop()
      setListening(false)
      listeningRef.current = false
    } else {
      finalTranscript.current = ''
      setInterimText('')
      setInput('')
      recognitionRef.current.start()
      setListening(true)
      listeningRef.current = true
    }
  }, [])

  const handleSend = async (overrideText) => {
    const text = overrideText || input
    if (!text.trim() || loading) return
    setInput('')
    setInterimText('')
    setLoading(true)
    setMoviesLoading(true)
    setShowMovies(false)
    setPrescription(null)
    if (onScanningChange) onScanningChange(true)
    const userMsg = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    try {
      const { data } = await sendChatMessage(
        [...messages.filter((m) => m.role !== 'system'), userMsg],
        null
      )
      if (onScanningChange) onScanningChange(false)
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      if (data.prescription) setPrescription(data.prescription)
      else setPrescription(null)
      setSearchQuery(data.search_query || null)
      if (data.movies?.length) {
        setMovies(data.movies)
        setTimeout(() => setShowMovies(true), 300)
        if (data.mood && onMoodUpdate) onMoodUpdate(data.mood)
      }
    } catch {
      if (onScanningChange) onScanningChange(false)
      setMessages((prev) => [...prev, { role: 'assistant', content: "I'm here to listen. Tell me more about how you're feeling." }])
    } finally {
      setLoading(false)
      setMoviesLoading(false)
    }
  }

  handleSendRef.current = handleSend

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chat Panel */}
        <div className="lg:col-span-3">
          <div className="bg-cinema-navy/80 backdrop-blur-sm rounded-2xl border border-cinema-mid/30 overflow-hidden h-[600px] flex flex-col">
            <div className="p-4 border-b border-cinema-mid/30 bg-gradient-to-r from-cinema-red/10 to-transparent flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧠</span>
                <div>
                  <h3 className="text-white font-cinema text-lg">AI Therapist</h3>
                  <p className="text-gray-400 text-xs">Tell me how you feel, I'll find the perfect movies</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-cinema-red text-white rounded-br-md'
                          : 'bg-cinema-deep text-gray-200 rounded-bl-md border border-white/5'
                      }`}
                    >
                      {msg.role === 'assistant' && i === 0 && (
                        <span className="text-lg mr-2">🧠</span>
                      )}
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-cinema-deep p-4 rounded-2xl rounded-bl-md border border-white/5">
                    <Loader3D size="sm" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-cinema-mid/30 flex-shrink-0">
              {listening ? (
                /* Voice Mode - like WhatsApp voice recorder */
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleVoice}
                    className="bg-cinema-red hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg shadow-cinema-red/30"
                    title="Stop listening"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </button>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cinema-red opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cinema-red" />
                      </span>
                    </div>
                    <div className="text-white text-sm font-medium">
                      {input || 'Speak now...'}
                    </div>
                    {interimText && (
                      <span className="text-cinema-red/60 text-xs italic truncate ml-1">{interimText}</span>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs">EN/UR/HI</span>
                </div>
              ) : (
                /* Text Mode - input field */
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      disabled={loading}
                      className="w-full bg-cinema-dark border border-cinema-mid/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cinema-red text-sm pr-12"
                    />
                    {recognitionRef.current && (
                      <button
                        onClick={toggleVoice}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        title="Voice input"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="bg-cinema-red hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                    </svg>
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movie Recommendations Panel */}
        <div className="lg:col-span-2">
          <div className="bg-cinema-navy/60 backdrop-blur-sm rounded-2xl border border-cinema-mid/30 h-[600px] flex flex-col">
            <div className="p-4 border-b border-cinema-mid/30 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">{searchQuery ? '\u{1F50D}' : '\u{1F3AC}'}</span>
                <h3 className="text-white font-cinema text-base">{searchQuery ? 'Search Results' : 'Film Prescriptions'}</h3>
                {movies.length > 0 && (
                  <span className="text-xs text-gray-500 ml-auto">{movies.length} {searchQuery ? 'found' : 'prescribed'}</span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {moviesLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <BrainScan isActive={moviesLoading} />
                  <p className="text-gray-500 text-xs animate-pulse">Reading your mind to find the perfect therapy...</p>
                </div>
              )}

              {!moviesLoading && movies.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.span
                    className="text-5xl mb-4"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >🧠</motion.span>
                  <p className="text-gray-500 text-sm mb-2">Tell me how you feel</p>
                  <p className="text-gray-600 text-xs">I'll read your emotional state and prescribe film therapy</p>
                </div>
              )}

              {!moviesLoading && movies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showMovies ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {prescription && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-cinema-red/10 to-cinema-navy/50 border border-cinema-red/20 rounded-xl p-3 mb-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{prescription.emoji || PRESCRIPTION_EMOJIS[prescription.category] || '\u{1F3AC}'}</span>
                        <span className="text-white text-sm font-semibold">{prescription.name}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{prescription.description}</p>
                    </motion.div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                    {movies.map((item, i) => (
                      <motion.div
                        key={item.id || i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                      >
                        <MovieCard item={item} index={i} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
