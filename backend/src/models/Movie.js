const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    posterUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: 'Description not available',
    },
    tmdbId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    releaseDate: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    genre: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: ['movie', 'tv', 'trending', 'popular'],
      default: 'movie',
    },
    voteAverage: {
      type: Number,
      default: 0,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
