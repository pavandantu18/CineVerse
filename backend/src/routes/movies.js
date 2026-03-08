const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Public: list all admin-added movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: get an admin-added movie by its TMDB ID (must be before /:id)
router.get('/tmdb/:tmdbId', async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: Number(req.params.tmdbId) });
    if (!movie) return res.status(404).json({ message: 'Not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: get a single admin-added movie by MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
