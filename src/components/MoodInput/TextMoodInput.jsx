import { useState } from 'react'
import { useMoodAnalyzer } from '../../hooks/useMoodAnalyzer'
import { useMoodStore } from '../../store/useMoodStore'

export default function TextMoodInput() {
  const [text, setText] = useState('')
  const { analyzeText } = useMoodAnalyzer()
  const { loading } = useMoodStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || loading) return
    await analyzeText(text)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-gray-300 text-sm font-medium block mb-2">
          How are you feeling right now?
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell me about your mood... e.g., 'I just got a promotion and I'm over the moon!'"
          className="w-full bg-cinema-dark border border-cinema-mid/50 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cinema-red transition-colors resize-none h-28"
          maxLength={500}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="bg-cinema-red hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-cinema-red/20"
        >
          {loading ? 'Analyzing...' : 'Analyze Mood'}
        </button>
      </div>
    </form>
  )
}
