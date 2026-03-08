const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        tmdbId: Number,
        mediaType: { type: String, enum: ['movie', 'tv'] },
        title: String,
        posterPath: String,
        releaseDate: String,
        voteAverage: Number,
      },
    ],
    watchHistory: [
      {
        tmdbId: Number,
        mediaType: { type: String, enum: ['movie', 'tv'] },
        title: String,
        posterPath: String,
        releaseDate: String,
        voteAverage: Number,
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    watchlist: [
      {
        tmdbId: Number,
        mediaType: { type: String, enum: ['movie', 'tv'] },
        title: String,
        posterPath: String,
        releaseDate: String,
        voteAverage: Number,
      },
    ],
    ratings: [
      {
        tmdbId: Number,
        mediaType: { type: String, enum: ['movie', 'tv'] },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
