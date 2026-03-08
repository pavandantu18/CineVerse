import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TrailerModal from '../components/TrailerModal';
import { getPublicMovieById } from '../services/backendApi';
import './MovieDetail.css';

const extractYouTubeId = (urlOrId) => {
  if (!urlOrId) return null;
  const match = urlOrId.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : urlOrId;
};

const FeaturedDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getPublicMovieById(id);
        setMovie(data);
      } catch {
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-skeleton">
          <div className="skeleton-backdrop shimmer" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="detail-page">
        <div className="detail-error">
          <p>{error || 'Movie not found.'}</p>
          <button onClick={() => navigate(-1)} className="btn-back">← Go Back</button>
        </div>
      </div>
    );
  }

  const trailerKey = extractYouTubeId(movie.trailerUrl);
  const genres = Array.isArray(movie.genre) ? movie.genre : (movie.genre ? [movie.genre] : []);
  const categoryLabel = movie.category === 'tv' ? 'TV Show' : 'Movie';

  return (
    <div className="detail-page">
      <div className="detail-content">
        <button onClick={() => navigate(-1)} className="btn-back">← Back</button>

        <div className="detail-main">
          <div className="detail-poster">
            <img
              src={movie.posterUrl || '/placeholder-poster.svg'}
              alt={movie.title}
              onError={(e) => { e.target.src = '/placeholder-poster.svg'; }}
            />
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{movie.title}</h1>

            <div className="detail-meta">
              {movie.releaseDate && (
                <span className="meta-item">📅 {movie.releaseDate.slice(0, 4)}</span>
              )}
              {movie.voteAverage > 0 && (
                <span className="meta-item meta-rating">★ {Number(movie.voteAverage).toFixed(1)}</span>
              )}
              <span className="meta-badge">{categoryLabel}</span>
              <span className="meta-badge" style={{ background: '#e5760a' }}>Featured</span>
            </div>

            {genres.length > 0 && (
              <div className="detail-genres">
                {genres.map((g, i) => <span key={i} className="genre-tag">{g}</span>)}
              </div>
            )}

            <p className="detail-overview">
              {movie.description && movie.description.trim()
                ? movie.description
                : 'Description not available.'}
            </p>

            <div className="detail-actions">
              {trailerKey ? (
                <button className="btn-trailer" onClick={() => setShowTrailer(true)}>
                  ▶ Watch Trailer
                </button>
              ) : (
                <button className="btn-trailer disabled" disabled>
                  Trailer Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showTrailer && (
        <TrailerModal
          trailerKey={trailerKey}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};

export default FeaturedDetail;
