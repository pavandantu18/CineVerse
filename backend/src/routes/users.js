const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  addToWatchHistory,
  getWatchHistory,
  clearWatchHistory,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getRatings,
  rateItem,
  removeRating,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:tmdbId', removeFavorite);

router.get('/history', getWatchHistory);
router.post('/history', addToWatchHistory);
router.delete('/history', clearWatchHistory);

router.get('/watchlist', getWatchlist);
router.post('/watchlist', addToWatchlist);
router.delete('/watchlist/:tmdbId', removeFromWatchlist);

router.get('/ratings', getRatings);
router.post('/ratings', rateItem);
router.delete('/ratings/:tmdbId', removeRating);

module.exports = router;
