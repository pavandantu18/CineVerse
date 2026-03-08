const User = require('../models/User');
const Movie = require('../models/Movie');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ban user
const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot ban an admin' });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`, isBanned: user.isBanned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete an admin' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add movie (admin)
const addMovie = async (req, res) => {
  try {
    const { title, posterUrl, description, tmdbId, releaseDate, trailerUrl, genre, category, voteAverage } = req.body;

    const movie = await Movie.create({
      title,
      posterUrl,
      description,
      tmdbId,
      releaseDate,
      trailerUrl,
      genre: genre ? genre.split(',').map((g) => g.trim()) : [],
      category,
      voteAverage,
      addedBy: req.user._id,
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all admin-added movies
const getAdminMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update movie
const updateMovie = async (req, res) => {
  try {
    const { title, posterUrl, description, tmdbId, releaseDate, trailerUrl, genre, category, voteAverage } = req.body;

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title,
        posterUrl,
        description,
        tmdbId,
        releaseDate,
        trailerUrl,
        genre: genre ? (Array.isArray(genre) ? genre : genre.split(',').map((g) => g.trim())) : [],
        category,
        voteAverage,
      },
      { new: true, runValidators: true }
    );

    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete movie
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, banUser, deleteUser, addMovie, getAdminMovies, updateMovie, deleteMovie };
