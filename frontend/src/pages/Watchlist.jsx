import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import './ListPage.css';
import './Favorites.css';

const Watchlist = () => {
  const { watchlist } = useSelector((s) => s.user);

  const items = watchlist.map((w) => ({
    id: w.tmdbId,
    title: w.title,
    name: w.title,
    poster_path: w.posterPath,
    release_date: w.releaseDate,
    first_air_date: w.releaseDate,
    vote_average: w.voteAverage,
    media_type: w.mediaType,
  }));

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>🎯 My Watchlist</h1>
        <p>{watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} to watch</p>
      </div>

      {watchlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h2>Your watchlist is empty</h2>
          <p>Add movies and shows you want to watch later!</p>
          <Link to="/movies" className="btn-explore">Explore Movies</Link>
        </div>
      ) : (
        <div className="movies-grid">
          {items.map((item) => (
            <MovieCard key={`${item.media_type}-${item.id}`} item={item} mediaType={item.media_type} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
