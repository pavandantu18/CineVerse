import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import './ListPage.css';
import './Favorites.css';

const Favorites = () => {
  const { favorites, loadingFavorites } = useSelector((s) => s.user);

  // Convert stored format to card-compatible format
  const items = favorites.map((f) => ({
    id: f.tmdbId,
    title: f.title,
    name: f.title,
    poster_path: f.posterPath,
    release_date: f.releaseDate,
    first_air_date: f.releaseDate,
    vote_average: f.voteAverage,
    media_type: f.mediaType,
  }));

  if (loadingFavorites) return <div className="list-page"><SkeletonGrid count={12} /></div>;

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>♥ My Favorites</h1>
        <p>{favorites.length} saved {favorites.length === 1 ? 'item' : 'items'}</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <h2>No favorites yet</h2>
          <p>Start exploring and add movies or shows you love!</p>
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

export default Favorites;
