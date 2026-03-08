import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import useDebounce from '../hooks/useDebounce';
import { searchMulti } from '../services/tmdbApi';
import './ListPage.css';
import './Search.css';

const FILTERS = ['All', 'Movie', 'TV', 'Person'];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filter, setFilter] = useState('All');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const debouncedQuery = useDebounce(query, 400);

  const search = useCallback(async (q, p = 1, reset = true) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const { data } = await searchMulti(q, p);
      const items = data.results || [];
      setResults((prev) => reset ? items : [...prev, ...items]);
      setTotalPages(data.total_pages);
      setPage(p);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {});
    search(debouncedQuery, 1, true);
  }, [debouncedQuery]); // eslint-disable-line

  const filtered = filter === 'All'
    ? results
    : results.filter((r) => r.media_type === filter.toLowerCase());

  const loadMore = () => {
    if (page < totalPages) search(debouncedQuery, page + 1, false);
  };

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>🔍 Search</h1>
        <p>Find movies, TV shows, and people</p>
      </div>

      <div className="search-page-bar">
        <div className="search-input-wrapper">
          <span>🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, shows, people..."
            className="search-page-input"
            autoFocus
          />
          {query && (
            <button className="clear-btn" onClick={() => setQuery('')}>✕</button>
          )}
        </div>
      </div>

      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && results.length === 0 ? (
        <SkeletonGrid count={12} />
      ) : filtered.length === 0 && debouncedQuery ? (
        <div className="no-results">
          <p>No results found for "<strong>{debouncedQuery}</strong>"</p>
          <p>Try different keywords or check the spelling.</p>
        </div>
      ) : (
        <>
          {filtered.length > 0 && (
            <p className="results-count">{filtered.length}+ results for "{debouncedQuery}"</p>
          )}
          <div className="movies-grid">
            {filtered.map((item) => (
              <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
          {page < totalPages && !loading && (
            <div className="load-more-wrapper">
              <button className="btn-load-more" onClick={loadMore}>
                Load More
              </button>
            </div>
          )}
          {loading && results.length > 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="spinner" />
            </div>
          )}
        </>
      )}

      {!debouncedQuery && (
        <div className="search-empty">
          <p>Start typing to search for movies, shows & people</p>
        </div>
      )}
    </div>
  );
};

export default Search;
