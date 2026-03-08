import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkeletonGrid } from '../components/SkeletonCard';
import InfiniteScrollWrapper from '../components/InfiniteScrollWrapper';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useDebounce from '../hooks/useDebounce';
import { getPopularPeople, searchPeople, getPosterUrl } from '../services/tmdbApi';
import { PLACEHOLDER_PERSON } from '../utils/constants';
import './ListPage.css';
import './People.css';

const PersonCard = ({ person }) => {
  const navigate = useNavigate();
  const photo = person.profile_path
    ? getPosterUrl(person.profile_path, 'medium')
    : PLACEHOLDER_PERSON;

  return (
    <div className="person-card" onClick={() => navigate(`/person/${person.id}`)}>
      <div className="person-photo">
        <img
          src={photo}
          alt={person.name}
          loading="lazy"
          onError={(e) => { if (e.target.src !== PLACEHOLDER_PERSON) e.target.src = PLACEHOLDER_PERSON; }}
        />
      </div>
      <div className="person-info">
        <h3>{person.name}</h3>
        <p>{person.known_for_department || 'Acting'}</p>
        {person.known_for?.length > 0 && (
          <span className="known-for">{person.known_for[0].title || person.known_for[0].name}</span>
        )}
      </div>
    </div>
  );
};

const People = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  const fetchFn = useCallback(
    (page) => debouncedQuery.trim() ? searchPeople(debouncedQuery, page) : getPopularPeople(page),
    [debouncedQuery]
  );

  const { items, loading, error, hasMore, loadMore } = useInfiniteScroll(fetchFn, [debouncedQuery]);

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>🎭 Popular People</h1>
        <p>Discover the most popular actors, directors & more</p>
      </div>

      <div className="page-search-bar">
        <span className="page-search-icon">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people..."
          className="page-search-input"
        />
        {query && (
          <button className="page-search-clear" onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      {error && <div className="error-msg">Failed to load people. Please try again.</div>}

      <InfiniteScrollWrapper hasMore={hasMore} loading={loading} onLoadMore={loadMore}>
        {items.length === 0 && loading ? (
          <SkeletonGrid count={12} />
        ) : items.length === 0 && debouncedQuery && !loading ? (
          <div className="no-results">No people found for "<strong>{debouncedQuery}</strong>"</div>
        ) : (
          <div className="movies-grid">
            {items.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </InfiniteScrollWrapper>

      {!hasMore && items.length > 0 && <p className="end-msg">You've reached the end!</p>}
    </div>
  );
};

export default People;
