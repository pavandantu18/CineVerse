import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getProfile = () => api.get('/auth/profile');

// Favorites
export const getFavorites = () => api.get('/users/favorites');
export const addFavorite = (data) => api.post('/users/favorites', data);
export const removeFavorite = (tmdbId) => api.delete(`/users/favorites/${tmdbId}`);

// Watch history
export const getWatchHistory = () => api.get('/users/history');
export const addToHistory = (data) => api.post('/users/history', data);
export const clearHistory = () => api.delete('/users/history');

// Watchlist
export const getWatchlistApi = () => api.get('/users/watchlist');
export const addToWatchlistApi = (data) => api.post('/users/watchlist', data);
export const removeFromWatchlistApi = (tmdbId) => api.delete(`/users/watchlist/${tmdbId}`);

// Ratings
export const getRatingsApi = () => api.get('/users/ratings');
export const rateItemApi = (data) => api.post('/users/ratings', data);
export const removeRatingApi = (tmdbId) => api.delete(`/users/ratings/${tmdbId}`);

// Admin - Users
export const adminGetUsers = () => api.get('/admin/users');
export const adminBanUser = (id) => api.patch(`/admin/users/${id}/ban`);
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`);

// Public movies
export const getPublicMovies = () => api.get('/movies');
export const getPublicMovieById = (id) => api.get(`/movies/${id}`);
export const getMovieByTmdbId = (tmdbId) => api.get(`/movies/tmdb/${tmdbId}`);

// Admin - Movies
export const adminGetMovies = () => api.get('/admin/movies');
export const adminAddMovie = (data) => api.post('/admin/movies', data);
export const adminUpdateMovie = (id, data) => api.put(`/admin/movies/${id}`, data);
export const adminDeleteMovie = (id) => api.delete(`/admin/movies/${id}`);

export default api;
