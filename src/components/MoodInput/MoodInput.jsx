import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TextMoodInput from './TextMoodInput'
import FaceCapture from './FaceCapture'
import EventsInput from './EventsInput'

const TABS = [
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'face', label: 'Face Scan', icon: '📷' },
  { id: 'events', label: 'Events', icon: '📝' },
]

export default function MoodInput() {
  const [tab, setTab] = useState('chat')

  return (
    <div className="bg-cinema-navy/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 max-w-2xl mx-auto border border-cinema-mid/30">
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-cinema-red text-white shadow-lg shadow-cinema-red/30'
                : 'bg-cinema-deep text-gray-400 hover:text-white hover:bg-cinema-mid'
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'chat' && <TextMoodInput />}
          {tab === 'face' && <FaceCapture />}
          {tab === 'events' && <EventsInput />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
