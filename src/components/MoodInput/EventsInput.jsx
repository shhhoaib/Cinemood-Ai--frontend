import { useState } from 'react'
import { useMoodAnalyzer } from '../../hooks/useMoodAnalyzer'
import { useMoodStore } from '../../store/useMoodStore'

export default function EventsInput() {
  const [events, setEvents] = useState('')
  const [text, setText] = useState('')
  const { analyzeText } = useMoodAnalyzer()
  const { loading } = useMoodStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!events.trim() || loading) return
    await analyzeText(text || 'Based on these events', events)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-gray-300 text-sm font-medium block mb-2">
          Share what's been happening in your life
        </label>
        <textarea
          value={events}
          onChange={(e) => setEvents(e.target.value)}
          placeholder="Describe recent events... e.g., 'I just moved to a new city and started a new job'"
          className="w-full bg-cinema-dark border border-cinema-mid/50 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cinema-red transition-colors resize-none h-32"
          maxLength={1000}
        />
      </div>
      <div>
        <label className="text-gray-400 text-xs font-medium block mb-1">
          Optional: How would you sum it up?
        </label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., I'm feeling excited but nervous"
          className="w-full bg-cinema-dark border border-cinema-mid/50 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cinema-red transition-colors"
          maxLength={200}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!events.trim() || loading}
          className="bg-cinema-red hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-cinema-red/20"
        >
          {loading ? 'Analyzing...' : 'Analyze My Mood'}
        </button>
      </div>
    </form>
  )
}
