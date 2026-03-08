import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { clearUserData } from '../store/slices/userSlice';
import './Navbar.css';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUserData());
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">🎬</span>
          <span className="logo-text">CineVerse</span>
        </Link>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </button>

        {/* Nav links */}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/"       className={isActive('/')}       onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/movies" className={isActive('/movies')} onClick={() => setMenuOpen(false)}>Movies</Link></li>
          <li><Link to="/tv"     className={isActive('/tv')}     onClick={() => setMenuOpen(false)}>TV Shows</Link></li>
          <li><Link to="/people" className={isActive('/people')} onClick={() => setMenuOpen(false)}>People</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/favorites" className={isActive('/favorites')} onClick={() => setMenuOpen(false)}>Favorites</Link></li>
              <li><Link to="/watchlist"  className={isActive('/watchlist')}  onClick={() => setMenuOpen(false)}>Watchlist</Link></li>
              <li><Link to="/history"   className={isActive('/history')}   onClick={() => setMenuOpen(false)}>History</Link></li>
            </>
          )}
          {user?.role === 'admin' && (
            <li><Link to="/admin" className={`${isActive('/admin')} admin-link`} onClick={() => setMenuOpen(false)}>Admin</Link></li>
          )}

          {/* Mobile-only: Search + Auth */}
          <li className="mobile-search-item">
            <Link to="/search" className="mobile-search-link" onClick={() => setMenuOpen(false)}>
              <SearchIcon /> Search
            </Link>
          </li>
          {isAuthenticated ? (
            <li className="mobile-auth-item">
              <button className="mobile-logout-btn" onClick={handleLogout}>Sign out · {user?.username}</button>
            </li>
          ) : (
            <li className="mobile-auth-item">
              <Link to="/login"  className="mobile-login-link"  onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="mobile-signup-link" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </li>
          )}
        </ul>

        {/* Right-side actions */}
        <div className="navbar-actions">
          {/* Search icon */}
          <button
            className={`nav-icon-btn ${location.pathname === '/search' ? 'active' : ''}`}
            onClick={() => navigate('/search')}
            title="Search"
            aria-label="Search"
          >
            <SearchIcon />
          </button>

          {/* Theme toggle */}
          <button className="nav-icon-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Light mode' : 'Dark mode'} aria-label="Toggle theme">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-avatar" title={user?.username}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <button className="btn-logout" onClick={handleLogout}>Sign out</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login"  className="btn-login"  onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn-signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
