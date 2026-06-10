import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore'

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const userMenuRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, dna, logout } = useAuthStore()

  useEffect(() => { setMobileMenu(false); setSearchOpen(false); setUserMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery)}`); setSearchQuery(''); setSearchOpen(false) }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-cinema-dark/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 flex-shrink-0 group">
            <span className="text-cinema-red font-cinema text-xl sm:text-2xl font-black tracking-[0.15em]"
              style={{ textShadow: '0 0 10px rgba(229,9,20,0.5), 0 2px 4px rgba(0,0,0,0.5), 0 4px 8px rgba(229,9,20,0.2)' }}>
              CINEMOOD
            </span>
            <span className="text-[9px] font-bold text-gray-400 bg-white/5 px-1.5 py-0.5 rounded mt-1 leading-none">AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" label="Home" active={location.pathname === '/'} />
            <NavLink to="/movies" label="Movies" active={location.pathname === '/movies'} />
            <NavLink to="/genres" label="Genres" active={location.pathname === '/genres'} />
            <NavLink to="/tv" label="TV Series" active={location.pathname === '/tv'} />
            <NavLink to="/industry/bollywood" label="Industries" active={location.pathname.startsWith('/industry/')} />
            <NavLink to="/upcoming" label="Upcoming" active={location.pathname === '/upcoming'} />
            <NavLink to="/recommend" label="AI Therapist" active={location.pathname === '/recommend'} />
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-300 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-cinema-navy border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <form onSubmit={handleSearch} className="p-3">
                      <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search movies & TV..."
                        className="w-full bg-cinema-dark text-white text-sm rounded-lg px-4 py-2.5 border border-white/10 focus:outline-none focus:border-cinema-red transition-colors" />
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              {user ? (
                <>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="text-lg">{dna?.primary?.emoji || '👤'}</span>
                    <span className="hidden sm:block text-sm text-gray-300 max-w-[100px] truncate">{user.name}</span>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-cinema-navy border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        <div className="p-2 space-y-0.5">
                          <Link to="/profile" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5">🎬 My Profile</Link>
                          <Link to="/for-you" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5">🎯 For You</Link>
                          <hr className="border-white/5 my-1" />
                          <button onClick={() => { logout(); navigate('/') }}
                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 rounded-lg hover:bg-white/5">Sign Out</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-sm text-gray-300 hover:text-white px-3 py-1.5 transition-colors">Sign In</Link>
                  <Link to="/register"
                    className="hidden sm:flex items-center gap-1.5 bg-cinema-red hover:bg-red-600 text-white text-sm px-4 py-2 rounded-full font-medium transition-all shadow-lg shadow-cinema-red/20">
                    Join
                  </Link>
                </div>
              )}
            </div>

            {/* AI Therapist Button */}
            {!user && (
              <Link to="/recommend"
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-cinema-red to-purple-600 hover:from-red-600 hover:to-purple-700 text-white text-sm px-4 py-2 rounded-full font-medium transition-all shadow-lg shadow-cinema-red/20 ml-2">
                <span>🧠</span>
                <span>AI Therapist</span>
              </Link>
            )}

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-gray-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenu ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-cinema-dark/95">
            <div className="px-4 py-3 space-y-1">
              <MobileLink to="/" label="Home" />
              <MobileLink to="/movies" label="Movies" />
              <MobileLink to="/genres" label="Genres" />
              <MobileLink to="/tv" label="TV Series" />
              <MobileLink to="/industry/bollywood" label="🌍 Industries" />
              <MobileLink to="/upcoming" label="Upcoming" />
              <MobileLink to="/recommend" label="🧠 AI Therapist" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function NavLink({ to, label, active }) {
  return <Link to={to} className={`px-3 py-2 text-sm rounded-lg transition-colors ${active ? 'text-cinema-red bg-cinema-red/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>{label}</Link>
}
function MobileLink({ to, label }) {
  return <Link to={to} className="block px-3 py-2.5 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5">{label}</Link>
}
