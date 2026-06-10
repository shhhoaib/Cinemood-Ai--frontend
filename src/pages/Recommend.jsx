import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatBot from '../components/ChatBot/ChatBot'
import BrainScan from '../components/UI/BrainScan'
import { useMoodStore } from '../store/useMoodStore'

export default function Recommend() {
  const { setMood, setMovies, mood } = useMoodStore()
  const [scanning, setScanning] = useState(false)

  const handleMoodUpdate = (moodData) => {
    setMood(moodData)
  }

  return (
    <div className="relative z-10 min-h-screen">
      {/* Animated background particles during scan */}
      {scanning && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cinema-red/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                y: [null, Math.random() * -200 - 100],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.span
            className="text-5xl block mb-3"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🧠
          </motion.span>
          <h1 className="text-3xl md:text-4xl font-cinema text-white">AI Therapist</h1>
          <p className="text-gray-400 mt-2 max-w-lg mx-auto">
            I read your emotional state and prescribe the perfect movie therapy.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {scanning ? (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <div className="bg-cinema-navy/80 backdrop-blur-sm rounded-2xl border border-cinema-red/20 p-8 w-full max-w-md">
                <BrainScan isActive={scanning} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <ChatBot onMoodUpdate={handleMoodUpdate} onScanningChange={setScanning} />
      </div>
    </div>
  )
}
