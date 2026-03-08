import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Search movies, shows, people...' }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {query && (
        <button type="button" className="clear-btn" onClick={() => setQuery('')}>✕</button>
      )}
    </form>
  );
};

export default SearchBar;
