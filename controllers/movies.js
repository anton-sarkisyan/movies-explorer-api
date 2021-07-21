const Movie = require('../models/movie');
const ValidationErr = require('../errors/validation-err');
const NotFoundErr = require('../errors/not-found-err');
const NoRightsErr = require('../errors/no-rights-err');

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
        next(new ValidationErr('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => new NotFoundErr('Карточка по указанному _id не найдена'))
    .then((movie) => {
      if (String(movie.owner) !== req.user._id) {
        throw new NoRightsErr('Недостаточно прав для совершения действия');
      }
      Movie.findByIdAndRemove(movieId)
        .then(() => res.status(200).send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err.message === 'Фильм по указанному _id не найден') {
        next(err);
      } else if (err.message === 'Недостаточно прав для совершения действия') {
        next(err);
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationErr('Передан некорретный id фильма'));
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
