import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import SearchBar from '../components/SearchBar';
import { getTrending, getPopularMovies, getPopularTVShows, getBackdropUrl } from '../services/tmdbApi';
import { getPublicMovies } from '../services/backendApi';
import './Home.css';

const SectionRow = ({ title, items, mediaType, linkTo }) => (
  <section className="home-section">
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      <Link to={linkTo} className="see-all">See All →</Link>
    </div>
    <div className="scroll-row">
      {items.map((item) => (
        <div key={item.id} className="scroll-item">
          <MovieCard item={item} mediaType={mediaType} />
        </div>
      ))}
    </div>
  </section>
);

const normalizeAdminMovie = (m) => ({
  id: m.tmdbId || null,
  _adminId: m._id,
  title: m.title,
  posterUrl: m.posterUrl || null,
  poster_path: null,
  vote_average: m.voteAverage || 0,
  release_date: m.releaseDate || '',
  media_type: m.category === 'tv' ? 'tv' : 'movie',
  overview: m.description || '',
  _noTmdb: !m.tmdbId,
});

const TABS = ['Browse', 'Featured'];

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Browse');
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendingRes, moviesRes, tvRes] = await Promise.all([
          getTrending('all', 'week'),
          getPopularMovies(),
          getPopularTVShows(),
        ]);

        const trendingData = trendingRes.data.results;
        setTrending(trendingData.slice(0, 10));
        setPopularMovies(moviesRes.data.results.slice(0, 10));
        setPopularTV(tvRes.data.results.slice(0, 10));

        const heroItem = trendingData.find((t) => t.backdrop_path);
        setHero(heroItem);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }

      try {
        const { data } = await getPublicMovies();
        if (data.length > 0) setFeaturedMovies(data.map(normalizeAdminMovie));
      } catch {
        // Backend may not be running — silently skip
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="home-page">
        <div className="hero-skeleton shimmer" />
        <div className="home-content">
          <SkeletonGrid count={10} />
        </div>
      </div>
    );
  }

  const heroBackdrop = hero?.backdrop_path ? getBackdropUrl(hero.backdrop_path, 'original') : null;
  const heroTitle = hero?.title || hero?.name || 'Welcome to CineVerse';
  const heroYear = hero?.release_date?.slice(0, 4) || hero?.first_air_date?.slice(0, 4);
  const heroRating = hero?.vote_average ? hero.vote_average.toFixed(1) : null;
  const heroType = hero?.media_type === 'tv' ? 'TV Show' : hero ? 'Movie' : null;
  const heroLink = hero ? `/${hero.media_type || (hero.title ? 'movie' : 'tv')}/${hero.id}` : null;

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero" style={heroBackdrop ? { backgroundImage: `url(${heroBackdrop})` } : {}}>
        <div className="hero-gradient" />
        <div className="hero-content">
          {heroType && <span className="hero-genre-badge">{heroType}</span>}
          <h1 className="hero-title">{heroTitle}</h1>

          {hero && (
            <div className="hero-meta">
              {heroRating && (
                <span className="hero-meta-item hero-rating">
                  <span className="hero-meta-icon">★</span> {heroRating}
                </span>
              )}
              {heroYear && (
                <span className="hero-meta-item">
                  <span className="hero-meta-icon">📅</span> {heroYear}
                </span>
              )}
              {hero.original_language && (
                <span className="hero-meta-item">
                  <span className="hero-meta-icon">🌐</span> {hero.original_language.toUpperCase()}
                </span>
              )}
            </div>
          )}

          <p className="hero-overview">
            {hero?.overview
              ? hero.overview.slice(0, 220) + (hero.overview.length > 220 ? '...' : '')
              : 'Discover the most popular movies, TV shows, and more.'}
          </p>

          <div className="hero-actions">
            {heroLink && <Link to={heroLink} className="btn-primary">▶ Watch Now</Link>}
            <Link to="/search" className="btn-secondary">+ My List</Link>
          </div>
        </div>
      </section>

      {/* ── Search ── */}
      <div className="home-search">
        <SearchBar />
      </div>

      {/* ── Tabs ── */}
      <div className="home-tabs-wrapper">
        <div className="home-tabs">
          {TABS.map((tab) => (
            // Only show Featured tab if there are admin movies
            (tab === 'Featured' && featuredMovies.length === 0) ? null : (
              <button
                key={tab}
                className={`home-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'Featured' && '⭐ '}{tab}
                {tab === 'Featured' && featuredMovies.length > 0 && (
                  <span className="tab-count">{featuredMovies.length}</span>
                )}
              </button>
            )
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="home-content">

        {/* Browse tab */}
        {activeTab === 'Browse' && (
          <>
            {trending.length > 0 && <SectionRow title="🔥 Trending This Week" items={trending} linkTo="/movies" />}
            {popularMovies.length > 0 && <SectionRow title="🎬 Popular Movies" items={popularMovies} mediaType="movie" linkTo="/movies" />}
            {popularTV.length > 0 && <SectionRow title="📺 Popular TV Shows" items={popularTV} mediaType="tv" linkTo="/tv" />}
          </>
        )}

        {/* Featured tab — admin-added movies */}
        {activeTab === 'Featured' && (
          <section className="home-section">
            {featuredMovies.length === 0 ? (
              <div className="featured-empty">
                <p>No featured movies added yet.</p>
              </div>
            ) : (
              <div className="featured-grid">
                {featuredMovies.map((item) => (
                  <div
                    key={item._adminId}
                    className="featured-card-static clickable"
                    onClick={() => navigate(`/featured/${item._adminId}`)}
                  >
                    <img
                      src={item.posterUrl || '/placeholder-poster.svg'}
                      alt={item.title}
                      onError={(e) => { e.target.src = '/placeholder-poster.svg'; }}
                    />
                    <div className="featured-card-info">
                      <p className="featured-card-title">{item.title}</p>
                      {item.release_date && (
                        <span className="featured-card-year">{item.release_date.slice(0, 4)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
};

export default Home;
