const router = require('express').Router();
const { celebrate } = require('celebrate');
const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movies');
const {
  isValidateCreateMovie,
  isValidateDeleteMovie,
} = require('../middlewares/validation');

router.get('/', getAllMovies);
router.post('/', celebrate(isValidateCreateMovie), createMovie);
router.delete('/:movieId', celebrate(isValidateDeleteMovie), deleteMovie);

module.exports = router;
