import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate('/')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-cinema-navy/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-cinema font-bold text-white mb-6 text-center">Welcome Back</h1>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
              <span>{error}</span>
              <button onClick={clearError} className="text-red-300 hover:text-white ml-2">✕</button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-cinema-dark text-white rounded-lg px-4 py-2.5 border border-white/10 focus:outline-none focus:border-cinema-red transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full bg-cinema-dark text-white rounded-lg px-4 py-2.5 border border-white/10 focus:outline-none focus:border-cinema-red transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-cinema-red hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-gray-500 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-cinema-red hover:text-red-400">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
