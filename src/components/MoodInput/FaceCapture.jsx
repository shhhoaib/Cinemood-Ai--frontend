import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { useMoodAnalyzer } from '../../hooks/useMoodAnalyzer'
import { useMoodStore } from '../../store/useMoodStore'

export default function FaceCapture() {
  const webcamRef = useRef(null)
  const [cameraReady, setCameraReady] = useState(false)
  const { analyzeImage } = useMoodAnalyzer()
  const { loading } = useMoodStore()

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) return
    const base64 = imageSrc.split(',')[1]
    await analyzeImage(base64)
  }, [analyzeImage])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
          onUserMedia={() => setCameraReady(true)}
          className="rounded-xl border-2 border-cinema-mid/50 w-full max-w-sm"
          mirrored
        />
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-cinema-dark/80 rounded-xl">
            <p className="text-gray-400">Loading camera...</p>
          </div>
        )}
      </div>
      <button
        onClick={capture}
        disabled={!cameraReady || loading}
        className="bg-cinema-red hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-cinema-red/20 flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <span>📸</span>
            Scan My Mood
          </>
        )}
      </button>
    </div>
  )
}
