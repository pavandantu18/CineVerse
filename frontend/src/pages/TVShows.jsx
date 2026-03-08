import { useState, useEffect, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import InfiniteScrollWrapper from '../components/InfiniteScrollWrapper';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useDebounce from '../hooks/useDebounce';
import { getPopularTVShows, getTVGenres, discoverTV, searchTVShows } from '../services/tmdbApi';
import './ListPage.css';

const TVShows = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    getTVGenres().then(({ data }) => setGenres(data.genres)).catch(() => {});
  }, []);

  const fetchFn = useCallback(
    (page) => {
      if (debouncedQuery.trim()) return searchTVShows(debouncedQuery, page);
      if (selectedGenre) return discoverTV({ with_genres: selectedGenre, sort_by: 'popularity.desc', page });
      return getPopularTVShows(page);
    },
    [debouncedQuery, selectedGenre]
  );

  const { items, loading, error, hasMore, loadMore } = useInfiniteScroll(fetchFn, [debouncedQuery, selectedGenre]);

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>📺 Popular TV Shows</h1>
        <p>Binge-worthy shows from around the world</p>
      </div>

      <div className="page-search-bar">
        <span className="page-search-icon">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search TV shows..."
          className="page-search-input"
        />
        {query && (
          <button className="page-search-clear" onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      {!debouncedQuery.trim() && genres.length > 0 && (
        <div className="genre-filters">
          <button
            className={`genre-pill ${selectedGenre === null ? 'active' : ''}`}
            onClick={() => setSelectedGenre(null)}
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              className={`genre-pill ${selectedGenre === g.id ? 'active' : ''}`}
              onClick={() => setSelectedGenre(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {error && <div className="error-msg">Failed to load TV shows. Please try again.</div>}

      <InfiniteScrollWrapper hasMore={hasMore} loading={loading} onLoadMore={loadMore}>
        {items.length === 0 && loading ? (
          <SkeletonGrid count={12} />
        ) : items.length === 0 && debouncedQuery && !loading ? (
          <div className="no-results">No TV shows found for "<strong>{debouncedQuery}</strong>"</div>
        ) : (
          <div className="movies-grid">
            {items.map((show) => (
              <MovieCard key={show.id} item={show} mediaType="tv" />
            ))}
          </div>
        )}
      </InfiniteScrollWrapper>

      {!hasMore && items.length > 0 && (
        <p className="end-msg">You've reached the end!</p>
      )}
    </div>
  );
};

export default TVShows;
