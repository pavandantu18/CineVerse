import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, toggleWatchlist } from '../store/slices/userSlice';
import { getPosterUrl } from '../services/tmdbApi';
import { PLACEHOLDER_POSTER } from '../utils/constants';
import './MovieCard.css';

const MovieCard = ({ item, mediaType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const favorites = useSelector((s) => s.user.favorites);
  const watchlist = useSelector((s) => s.user.watchlist);

  const id = item.id || item.tmdbId;
  const type = mediaType || item.media_type || (item.title ? 'movie' : 'tv');
  const title = item.title || item.name || 'Unknown';
  const posterPath = item.poster_path || item.profile_path;
  const posterUrl = item.posterUrl || (posterPath ? getPosterUrl(posterPath, 'medium') : null) || PLACEHOLDER_POSTER;
  const releaseDate = item.release_date || item.first_air_date || '';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

  const isFavorited = favorites.some((f) => f.tmdbId === id);
  const isBookmarked = type !== 'person' && watchlist.some((w) => w.tmdbId === id);

  const handleClick = () => {
    if (type === 'person') {
      navigate(`/person/${id}`);
    } else {
      navigate(`/${type}/${id}`);
    }
  };

  const mediaPayload = {
    tmdbId: id, mediaType: type, title,
    posterPath: item.poster_path || item.profile_path || '',
    releaseDate, voteAverage: item.vote_average || 0,
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(toggleFavorite(mediaPayload));
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(toggleWatchlist(mediaPayload));
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="card-poster">
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          onError={(e) => { if (e.target.src !== PLACEHOLDER_POSTER) e.target.src = PLACEHOLDER_POSTER; }}
        />
        <div className="card-overlay">
          <div className="card-actions">
            <button
              className={`fav-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={handleFavorite}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorited ? '♥' : '♡'}
            </button>
            {type !== 'person' && (
              <button
                className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={handleBookmark}
                title={isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {isBookmarked ? '🔖' : '🏷'}
              </button>
            )}
          </div>
          <span className="card-type">{type === 'tv' ? 'TV' : type === 'person' ? 'Person' : 'Movie'}</span>
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{title}</h3>
        <div className="card-meta">
          {releaseDate && <span className="card-year">{releaseDate.slice(0, 4)}</span>}
          {rating !== 'N/A' && (
            <span className="card-rating">
              <span className="star">★</span> {rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
