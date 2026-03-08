import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from './store/slices/authSlice';
import { fetchFavorites, fetchWatchHistory, fetchWatchlist, fetchRatings } from './store/slices/userSlice';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import People from './pages/People';
import MovieDetail from './pages/MovieDetail';
import PersonDetail from './pages/PersonDetail';
import Search from './pages/Search';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Favorites from './pages/Favorites';
import WatchHistory from './pages/WatchHistory';
import Admin from './pages/Admin';
import FeaturedDetail from './pages/FeaturedDetail';
import Watchlist from './pages/Watchlist';

function App() {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
      dispatch(fetchWatchHistory());
      dispatch(fetchWatchlist());
      dispatch(fetchRatings());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TVShows />} />
          <Route path="/people" element={<People />} />
          <Route path="/movie/:id" element={<MovieDetail mediaType="movie" />} />
          <Route path="/tv/:id" element={<MovieDetail mediaType="tv" />} />
          <Route path="/person/:id" element={<PersonDetail />} />
          <Route path="/featured/:id" element={<FeaturedDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/favorites"
            element={<ProtectedRoute><Favorites /></ProtectedRoute>}
          />
          <Route
            path="/history"
            element={<ProtectedRoute><WatchHistory /></ProtectedRoute>}
          />
          <Route
            path="/watchlist"
            element={<ProtectedRoute><Watchlist /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>}
          />
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#888' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
                <p>Page not found</p>
              </div>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
