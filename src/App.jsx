import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Recommend from './pages/Recommend'
import MovieDetail from './pages/MovieDetail'
import MovieListing from './pages/MovieListing'
import TVSeries from './pages/TVSeries'
import TrendingPage from './pages/TrendingPage'
import GenrePage from './pages/GenrePage'
import GenresPage from './pages/GenresPage'
import IndustryPage from './pages/IndustryPage'
import PersonPage from './pages/PersonPage'
import UpcomingPage from './pages/UpcomingPage'
import ForYou from './pages/ForYou'
import PakistaniDramas from './pages/PakistaniDramas'
import TopRated from './pages/TopRated'
import SearchPage from './pages/SearchPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
export default function App() {
  return (
    <div className="bg-cinema-dark min-h-screen font-body relative">
      <div className="spotlight" />
      <div className="film-grain" />
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/tv/:id" element={<MovieDetail />} />
          <Route path="/movies" element={<MovieListing />} />
          <Route path="/tv" element={<TVSeries />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/genre/:id/:name" element={<GenrePage />} />
          <Route path="/industry/:id" element={<IndustryPage />} />
          <Route path="/upcoming" element={<UpcomingPage />} />
          <Route path="/dramas" element={<PakistaniDramas />} />
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/top-rated" element={<TopRated />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/person/:id" element={<PersonPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  )
}
