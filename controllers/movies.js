const Movie = require('../models/movie');
const ValidationErr = require('../errors/validation-err');
const NotFoundErr = require('../errors/not-found-err');
const NoRightsErr = require('../errors/no-rights-err');
const {
  VALIDATION_CREATE_FILM_ERR,
  NOT_FOUND_ID_FILM_ERR,
  VALIDATION_ID_FILM_ERR,
  NO_RIGHTS_TEXT_ERR,
} = require('../utils/const');

const getAllMovies = (req, res, next) => {
  const id = req.user._id;

  Movie.find({ owner: id }).select('-owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU,
    nameEN, thumbnail, movieId,
  } = req.body;
  const id = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationErorr') {
        next(new ValidationErr(VALIDATION_CREATE_FILM_ERR));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => new NotFoundErr(NOT_FOUND_ID_FILM_ERR))
    .then((movie) => {
      if (String(movie.owner) !== req.user._id) {
        throw new NoRightsErr(NO_RIGHTS_TEXT_ERR);
      }
      Movie.findByIdAndRemove(movieId)
        .then(() => res.status(200).send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err.message === NOT_FOUND_ID_FILM_ERR) {
        next(err);
      } else if (err.message === NO_RIGHTS_TEXT_ERR) {
        next(err);
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationErr(VALIDATION_ID_FILM_ERR));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllMovies,
  createMovie,
  deleteMovie,
};
