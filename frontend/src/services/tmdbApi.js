import axios from 'axios';

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

export const POSTER_SIZES = {
  small: `${IMAGE_BASE}/w185`,
  medium: `${IMAGE_BASE}/w342`,
  large: `${IMAGE_BASE}/w500`,
  original: `${IMAGE_BASE}/original`,
};

export const BACKDROP_SIZES = {
  small: `${IMAGE_BASE}/w300`,
  medium: `${IMAGE_BASE}/w780`,
  large: `${IMAGE_BASE}/w1280`,
  original: `${IMAGE_BASE}/original`,
};

const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { api_key: API_KEY, language: 'en-US' },
});

export const getTrending = (mediaType = 'all', timeWindow = 'week', page = 1) =>
  tmdb.get(`/trending/${mediaType}/${timeWindow}`, { params: { page } });

export const getPopularMovies = (page = 1) =>
  tmdb.get('/movie/popular', { params: { page } });

export const getPopularTVShows = (page = 1) =>
  tmdb.get('/tv/popular', { params: { page } });

export const getTopRatedMovies = (page = 1) =>
  tmdb.get('/movie/top_rated', { params: { page } });

export const getUpcomingMovies = (page = 1) =>
  tmdb.get('/movie/upcoming', { params: { page } });

export const getNowPlayingMovies = (page = 1) =>
  tmdb.get('/movie/now_playing', { params: { page } });

export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits,similar,recommendations,images' } });

export const getTVDetails = (id) =>
  tmdb.get(`/tv/${id}`, { params: { append_to_response: 'videos,credits,similar,recommendations,images' } });

export const getPersonDetails = (id) =>
  tmdb.get(`/person/${id}`, { params: { append_to_response: 'movie_credits,tv_credits,images' } });

export const getPopularPeople = (page = 1) =>
  tmdb.get('/person/popular', { params: { page } });

export const searchMulti = (query, page = 1) =>
  tmdb.get('/search/multi', { params: { query, page } });

export const searchMovies = (query, page = 1) =>
  tmdb.get('/search/movie', { params: { query, page } });

export const searchTVShows = (query, page = 1) =>
  tmdb.get('/search/tv', { params: { query, page } });

export const searchPeople = (query, page = 1) =>
  tmdb.get('/search/person', { params: { query, page } });

export const getMovieGenres = () => tmdb.get('/genre/movie/list');
export const getTVGenres = () => tmdb.get('/genre/tv/list');

export const discoverMovies = (params) => tmdb.get('/discover/movie', { params });
export const discoverTV = (params) => tmdb.get('/discover/tv', { params });

export const getMovieVideos = (id) => tmdb.get(`/movie/${id}/videos`);
export const getTVVideos = (id) => tmdb.get(`/tv/${id}/videos`);

export const getPosterUrl = (path, size = 'medium') => {
  if (!path) return null;
  return `${POSTER_SIZES[size]}${path}`;
};

export const getBackdropUrl = (path, size = 'large') => {
  if (!path) return null;
  return `${BACKDROP_SIZES[size]}${path}`;
};

export default tmdb;
