const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  banUser,
  deleteUser,
  addMovie,
  getAdminMovies,
  updateMovie,
  deleteMovie,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/ban', banUser);
router.delete('/users/:id', deleteUser);

// Movie management
router.get('/movies', getAdminMovies);
router.post('/movies', addMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

module.exports = router;
