import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';
import { toggleFavorite, recordWatch, toggleWatchlist, rateItem, removeRating } from '../store/slices/userSlice';
import StarRating from '../components/StarRating';
import {
  getMovieDetails,
  getTVDetails,
  getPosterUrl,
  getBackdropUrl,
} from '../services/tmdbApi';
import { getMovieByTmdbId } from '../services/backendApi';
import { PLACEHOLDER_POSTER, safeText } from '../utils/constants';
import './MovieDetail.css';

const extractYouTubeId = (urlOrId) => {
  if (!urlOrId) return null;
  const match = urlOrId.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : urlOrId;
};

const MovieDetail = ({ mediaType = 'movie' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const favorites = useSelector((s) => s.user.favorites);
  const watchlist = useSelector((s) => s.user.watchlist);
  const ratings = useSelector((s) => s.user.ratings);

  const [detail, setDetail] = useState(null);
  const [customTrailerKey, setCustomTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchFn = mediaType === 'movie' ? getMovieDetails : getTVDetails;
        const { data } = await fetchFn(id);
        setDetail(data);

        // Try to get admin-added custom trailerUrl as fallback
        try {
          const { data: adminMovie } = await getMovieByTmdbId(data.id);
          if (adminMovie?.trailerUrl) {
            setCustomTrailerKey(extractYouTubeId(adminMovie.trailerUrl));
          }
        } catch {
          // No admin entry — fine, fall through
        }

        // Record watch history on page open
        if (isAuthenticated) {
          dispatch(recordWatch({
            tmdbId: data.id,
            mediaType,
            title: data.title || data.name,
            posterPath: data.poster_path || '',
            releaseDate: data.release_date || data.first_air_date || '',
            voteAverage: data.vote_average || 0,
          }));
        }
      } catch (err) {
        setError('Failed to load details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, mediaType]); // eslint-disable-line

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-skeleton">
          <div className="skeleton-backdrop shimmer" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <div className="detail-error">
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="btn-back">← Go Back</button>
        </div>
      </div>
    );
  }

  if (!detail) return null;

  const title = detail.title || detail.name || 'Unknown';
  const overview = safeText(detail.overview, 'Description not available');
  const releaseDate = detail.release_date || detail.first_air_date || '';
  const rating = detail.vote_average ? detail.vote_average.toFixed(1) : 'N/A';
  const posterUrl = detail.poster_path ? getPosterUrl(detail.poster_path, 'large') : PLACEHOLDER_POSTER;
  const backdropUrl = detail.backdrop_path ? getBackdropUrl(detail.backdrop_path, 'large') : null;
  const genres = detail.genres || [];
  const cast = detail.credits?.cast?.slice(0, 8) || [];
  const similar = (detail.similar?.results || detail.recommendations?.results || []).slice(0, 10);

  // Get trailer key — prefer TMDB, fall back to admin-added custom URL
  const tmdbTrailer = detail.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  ) || detail.videos?.results?.find(
    (v) => v.site === 'YouTube'
  );
  const trailerKey = tmdbTrailer?.key || customTrailerKey;

  const isFavorited = favorites.some((f) => f.tmdbId === detail.id);
  const isInWatchlist = watchlist.some((w) => w.tmdbId === detail.id);
  const userRating = ratings.find((r) => r.tmdbId === detail.id)?.rating || 0;

  const mediaPayload = {
    tmdbId: detail.id, mediaType, title,
    posterPath: detail.poster_path || '',
    releaseDate, voteAverage: detail.vote_average || 0,
  };

  const handleFavorite = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(toggleFavorite(mediaPayload));
  };

  const handleWatchlist = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(toggleWatchlist(mediaPayload));
  };

  const handleRate = (star) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (star === 0) dispatch(removeRating(detail.id));
    else dispatch(rateItem({ tmdbId: detail.id, mediaType, rating: star }));
  };

  return (
    <div className="detail-page">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="detail-backdrop" style={{ backgroundImage: `url(${backdropUrl})` }}>
          <div className="backdrop-overlay" />
        </div>
      )}

      <div className="detail-content">
        <button onClick={() => navigate(-1)} className="btn-back">← Back</button>

        <div className="detail-main">
          <div className="detail-poster">
            <img src={posterUrl} alt={title} onError={(e) => { if (e.target.src !== PLACEHOLDER_POSTER) e.target.src = PLACEHOLDER_POSTER; }} />
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{title}</h1>

            <div className="detail-meta">
              {releaseDate && <span className="meta-item">📅 {releaseDate.slice(0, 4)}</span>}
              <span className="meta-item meta-rating">★ {rating}</span>
              {detail.runtime && <span className="meta-item">⏱ {detail.runtime} min</span>}
              {detail.number_of_seasons && (
                <span className="meta-item">📺 {detail.number_of_seasons} Season{detail.number_of_seasons > 1 ? 's' : ''}</span>
              )}
              <span className="meta-badge">{mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
            </div>

            {genres.length > 0 && (
              <div className="detail-genres">
                {genres.map((g) => <span key={g.id} className="genre-tag">{g.name}</span>)}
              </div>
            )}

            <p className="detail-overview">{overview}</p>

            <div className="detail-actions">
              {trailerKey ? (
                <button className="btn-trailer" onClick={() => {
                  setShowTrailer(true);
                  if (isAuthenticated) {
                    dispatch(recordWatch({
                      tmdbId: detail.id,
                      mediaType,
                      title,
                      posterPath: detail.poster_path || '',
                      releaseDate,
                      voteAverage: detail.vote_average || 0,
                    }));
                  }
                }}>
                  ▶ Watch Trailer
                </button>
              ) : (
                <button className="btn-trailer disabled" disabled>
                  Trailer Unavailable
                </button>
              )}
              <button
                className={`btn-fav ${isFavorited ? 'favorited' : ''}`}
                onClick={handleFavorite}
              >
                {isFavorited ? '♥ Favorited' : '♡ Favorite'}
              </button>
              <button
                className={`btn-watchlist ${isInWatchlist ? 'in-watchlist' : ''}`}
                onClick={handleWatchlist}
              >
                {isInWatchlist ? '🔖 In Watchlist' : '+ Watchlist'}
              </button>
            </div>

            {isAuthenticated && (
              <div className="detail-rating">
                <span className="rating-prompt">Your rating:</span>
                <StarRating rating={userRating} onRate={handleRate} />
              </div>
            )}
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="detail-section">
            <h2>Cast</h2>
            <div className="cast-scroll">
              {cast.map((member) => (
                <div
                  key={member.id}
                  className="cast-card"
                  onClick={() => navigate(`/person/${member.id}`)}
                >
                  <img
                    src={member.profile_path
                      ? getPosterUrl(member.profile_path, 'small')
                      : PLACEHOLDER_POSTER
                    }
                    alt={member.name}
                    onError={(e) => { if (e.target.src !== PLACEHOLDER_POSTER) e.target.src = PLACEHOLDER_POSTER; }}
                  />
                  <p className="cast-name">{member.name}</p>
                  <p className="cast-char">{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Images Gallery */}
        {detail.images?.backdrops?.length > 0 && (
          <section className="detail-section">
            <h2>Images</h2>
            <div className="images-scroll">
              {detail.images.backdrops.slice(0, 12).map((img, i) => (
                <div key={i} className="gallery-thumb">
                  <img
                    src={getBackdropUrl(img.file_path, 'small')}
                    alt={`${title} backdrop ${i + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="detail-section">
            <h2>Similar {mediaType === 'tv' ? 'Shows' : 'Movies'}</h2>
            <div className="scroll-row">
              {similar.map((item) => (
                <div key={item.id} className="scroll-item">
                  <MovieCard item={item} mediaType={mediaType} />
                </div>
              ))}
            </div>
          </section>
        )}
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

export default MovieDetail;
