import { useState, useEffect } from 'react';
import {
  adminGetUsers,
  adminBanUser,
  adminDeleteUser,
  adminGetMovies,
  adminAddMovie,
  adminUpdateMovie,
  adminDeleteMovie,
} from '../services/backendApi';
import './Admin.css';

const TABS = ['Movies', 'Users'];

const emptyMovie = {
  title: '', posterUrl: '', description: '', tmdbId: '', releaseDate: '',
  trailerUrl: '', genre: '', category: 'movie', voteAverage: '',
};

const Admin = () => {
  const [tab, setTab] = useState('Movies');
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState(emptyMovie);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (tab === 'Users') loadUsers();
    if (tab === 'Movies') loadMovies();
  }, [tab]);

  const showMsg = (m, isErr = false) => {
    if (isErr) setError(m); else setMsg(m);
    setTimeout(() => { setMsg(''); setError(''); }, 3000);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminGetUsers();
      setUsers(data);
    } catch { showMsg('Failed to load users', true); }
    finally { setLoading(false); }
  };

  const loadMovies = async () => {
    setLoading(true);
    try {
      const { data } = await adminGetMovies();
      setMovies(data);
    } catch { showMsg('Failed to load movies', true); }
    finally { setLoading(false); }
  };

  const handleBan = async (id) => {
    try {
      const { data } = await adminBanUser(id);
      setUsers(users.map((u) => u._id === id ? { ...u, isBanned: data.isBanned } : u));
      showMsg(`User ${data.isBanned ? 'banned' : 'unbanned'} successfully`);
    } catch { showMsg('Failed to update user', true); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await adminDeleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      showMsg('User deleted');
    } catch { showMsg('Failed to delete user', true); }
  };

  const openAddMovie = () => {
    setEditingMovie(null);
    setMovieForm(emptyMovie);
    setShowMovieForm(true);
  };

  const openEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      posterUrl: movie.posterUrl || '',
      description: movie.description || '',
      tmdbId: movie.tmdbId || '',
      releaseDate: movie.releaseDate || '',
      trailerUrl: movie.trailerUrl || '',
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || '',
      category: movie.category || 'movie',
      voteAverage: movie.voteAverage || '',
    });
    setShowMovieForm(true);
  };

  const handleMovieFormChange = (e) => {
    setMovieForm({ ...movieForm, [e.target.name]: e.target.value });
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingMovie) {
        const { data } = await adminUpdateMovie(editingMovie._id, movieForm);
        setMovies(movies.map((m) => m._id === editingMovie._id ? data : m));
        showMsg('Movie updated successfully');
      } else {
        const { data } = await adminAddMovie(movieForm);
        setMovies([data, ...movies]);
        showMsg('Movie added successfully');
      }
      setShowMovieForm(false);
      setMovieForm(emptyMovie);
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to save movie', true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await adminDeleteMovie(id);
      setMovies(movies.filter((m) => m._id !== id));
      showMsg('Movie deleted');
    } catch { showMsg('Failed to delete movie', true); }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage movies and users</p>
      </div>

      {msg && <div className="admin-msg success">{msg}</div>}
      {error && <div className="admin-msg error">{error}</div>}

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`admin-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'Movies' ? '🎬' : '👥'} {t}
          </button>
        ))}
      </div>

      {/* Movies Tab */}
      {tab === 'Movies' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Movies ({movies.length})</h2>
            <button className="btn-add" onClick={openAddMovie}>+ Add Movie</button>
          </div>

          {loading ? (
            <div className="admin-loading">Loading...</div>
          ) : movies.length === 0 ? (
            <div className="admin-empty">No movies added yet. Add your first movie!</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Release</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <tr key={movie._id}>
                      <td className="movie-title-cell">
                        {movie.posterUrl && (
                          <img src={movie.posterUrl} alt={movie.title} className="admin-poster" onError={(e) => { e.target.style.display = 'none'; }} />
                        )}
                        <span>{movie.title}</span>
                      </td>
                      <td><span className="badge">{movie.category}</span></td>
                      <td>{movie.releaseDate || '—'}</td>
                      <td>{movie.voteAverage || '—'}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-edit" onClick={() => openEditMovie(movie)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'Users' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Users ({users.length})</h2>
          </div>

          {loading ? (
            <div className="admin-loading">Loading...</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className={user.isBanned ? 'banned-row' : ''}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td><span className={`badge ${user.role === 'admin' ? 'admin-badge' : ''}`}>{user.role}</span></td>
                      <td>
                        <span className={`status-dot ${user.isBanned ? 'banned' : 'active'}`}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td>
                        {user.role !== 'admin' && (
                          <div className="table-actions">
                            <button
                              className={user.isBanned ? 'btn-unban' : 'btn-ban'}
                              onClick={() => handleBan(user._id)}
                            >
                              {user.isBanned ? 'Unban' : 'Ban'}
                            </button>
                            <button className="btn-delete" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Movie Form Modal */}
      {showMovieForm && (
        <div className="modal-backdrop" onClick={() => setShowMovieForm(false)}>
          <div className="admin-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h2>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
              <button className="modal-close" onClick={() => setShowMovieForm(false)}>✕</button>
            </div>
            <form onSubmit={handleMovieSubmit} className="movie-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input name="title" value={movieForm.title} onChange={handleMovieFormChange} required placeholder="Movie title" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={movieForm.category} onChange={handleMovieFormChange}>
                    <option value="movie">Movie</option>
                    <option value="tv">TV Show</option>
                    <option value="trending">Trending</option>
                    <option value="popular">Popular</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Poster Image URL</label>
                  <input name="posterUrl" value={movieForm.posterUrl} onChange={handleMovieFormChange} placeholder="https://..." />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea name="description" value={movieForm.description} onChange={handleMovieFormChange} placeholder="Movie description..." rows={3} />
                </div>
                <div className="form-group">
                  <label>TMDB ID</label>
                  <input type="number" name="tmdbId" value={movieForm.tmdbId} onChange={handleMovieFormChange} placeholder="12345" />
                </div>
                <div className="form-group">
                  <label>Release Date</label>
                  <input name="releaseDate" value={movieForm.releaseDate} onChange={handleMovieFormChange} placeholder="2024-01-01" />
                </div>
                <div className="form-group full-width">
                  <label>Trailer YouTube Link</label>
                  <input name="trailerUrl" value={movieForm.trailerUrl} onChange={handleMovieFormChange} placeholder="https://youtube.com/watch?v=... or just the video ID" />
                </div>
                <div className="form-group">
                  <label>Genre (comma-separated)</label>
                  <input name="genre" value={movieForm.genre} onChange={handleMovieFormChange} placeholder="Action, Drama, Sci-Fi" />
                </div>
                <div className="form-group">
                  <label>Rating (0-10)</label>
                  <input type="number" name="voteAverage" value={movieForm.voteAverage} onChange={handleMovieFormChange} min="0" max="10" step="0.1" placeholder="7.5" />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowMovieForm(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Saving...' : editingMovie ? 'Update Movie' : 'Add Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
