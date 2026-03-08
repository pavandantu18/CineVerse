import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import { clearWatchHistory } from '../store/slices/userSlice';
import './ListPage.css';
import './Favorites.css';

const WatchHistory = () => {
  const dispatch = useDispatch();
  const { watchHistory, loadingHistory } = useSelector((s) => s.user);

  const items = watchHistory.map((h) => ({
    id: h.tmdbId,
    title: h.title,
    name: h.title,
    poster_path: h.posterPath,
    release_date: h.releaseDate,
    first_air_date: h.releaseDate,
    vote_average: h.voteAverage,
    media_type: h.mediaType,
  }));

  const handleClear = () => {
    if (window.confirm('Clear all watch history?')) {
      dispatch(clearWatchHistory());
    }
  };

  if (loadingHistory) return <div className="list-page"><SkeletonGrid count={12} /></div>;

  return (
    <div className="list-page">
      <div className="list-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>🕐 Watch History</h1>
          <p>{watchHistory.length} recently watched {watchHistory.length === 1 ? 'item' : 'items'}</p>
        </div>
        {watchHistory.length > 0 && (
          <button className="btn-clear-history" onClick={handleClear}>
            Clear History
          </button>
        )}
      </div>

      {watchHistory.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🕐</div>
          <h2>No watch history</h2>
          <p>Movies and shows you view will appear here.</p>
          <Link to="/" className="btn-explore">Start Exploring</Link>
        </div>
      ) : (
        <div className="movies-grid">
          {items.map((item, i) => (
            <MovieCard key={`${item.media_type}-${item.id}-${i}`} item={item} mediaType={item.media_type} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
