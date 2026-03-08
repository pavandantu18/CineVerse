const User = require('../models/User');

// Add to favorites
const addFavorite = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, releaseDate, voteAverage } = req.body;
    const user = await User.findById(req.user._id);

    const alreadyFavorited = user.favorites.find((f) => f.tmdbId === tmdbId);
    if (alreadyFavorited) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    user.favorites.push({ tmdbId, mediaType, title, posterPath, releaseDate, voteAverage });
    await user.save();

    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from favorites
const removeFavorite = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter((f) => f.tmdbId !== Number(tmdbId));
    await user.save();

    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to watch history
const addToWatchHistory = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, releaseDate, voteAverage } = req.body;
    const user = await User.findById(req.user._id);

    // Remove existing entry for same item to avoid duplicates
    user.watchHistory = user.watchHistory.filter((h) => h.tmdbId !== tmdbId);

    // Add to beginning
    user.watchHistory.unshift({
      tmdbId,
      mediaType,
      title,
      posterPath,
      releaseDate,
      voteAverage,
      watchedAt: new Date(),
    });

    // Keep only last 50 items
    if (user.watchHistory.length > 50) {
      user.watchHistory = user.watchHistory.slice(0, 50);
    }

    await user.save();
    res.json({ message: 'Added to watch history', watchHistory: user.watchHistory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get watch history
const getWatchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('watchHistory');
    res.json(user.watchHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear watch history
const clearWatchHistory = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { watchHistory: [] });
    res.json({ message: 'Watch history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get watchlist
const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('watchlist');
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, releaseDate, voteAverage } = req.body;
    const user = await User.findById(req.user._id);
    if (user.watchlist.find((w) => w.tmdbId === tmdbId)) {
      return res.status(400).json({ message: 'Already in watchlist' });
    }
    user.watchlist.push({ tmdbId, mediaType, title, posterPath, releaseDate, voteAverage });
    await user.save();
    res.json({ message: 'Added to watchlist', watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const user = await User.findById(req.user._id);
    user.watchlist = user.watchlist.filter((w) => w.tmdbId !== Number(tmdbId));
    await user.save();
    res.json({ message: 'Removed from watchlist', watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ratings
const getRatings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('ratings');
    res.json(user.ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add or update a rating
const rateItem = async (req, res) => {
  try {
    const { tmdbId, mediaType, rating } = req.body;
    const user = await User.findById(req.user._id);
    const existing = user.ratings.find((r) => r.tmdbId === tmdbId);
    if (existing) {
      existing.rating = rating;
    } else {
      user.ratings.push({ tmdbId, mediaType, rating });
    }
    await user.save();
    res.json({ message: 'Rating saved', ratings: user.ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a rating
const removeRating = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const user = await User.findById(req.user._id);
    user.ratings = user.ratings.filter((r) => r.tmdbId !== Number(tmdbId));
    await user.save();
    res.json({ message: 'Rating removed', ratings: user.ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
