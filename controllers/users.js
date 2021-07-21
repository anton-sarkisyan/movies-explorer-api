const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationErr = require('../errors/validation-err');
const NotFoundErr = require('../errors/not-found-err');
const NoRightsErr = require('../errors/no-rights-err');
const ConflictErr = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new NotFoundErr('Пользователь по указанному _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Пользователь по указанному _id не найден') {
        next(err);
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationErr('Переданы некорректные данные при обновлении пользователя'));
      } else {
        next(err);
      }
    });
};

const creatUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => res.send({
          name: user.name,
          email: user.email,
          _id: user._id,
        }))
        .catch((err) => {
          if (err.name === 'MongoError' && err.code === 11000) {
            next(new ConflictErr('Пользователь уже существует'));
          } else if (err.name === 'CastError' || err.name === 'ValidationError') {
            next(new ValidationErr('Переданы некорректные данные при создании пользователя'));
          } else {
            next(err);
          }
        });
    });
};

const login = (req, res, next) => {
  const { password, email } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NoRightsErr('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoRightsErr('Неправильные почта или пароль');
          }

          const token = jwt.sign({ _id: user._id },
            NODE_ENV === 'production'
              ? JWT_SECRET
              : 'dev-secret', { expiresIn: '7d' });
          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: 'None',
              secure: true,
            })
            .status(200)
            .send({ message: 'успешная авторизация' });
        });
    })
    .catch((err) => {
      if (err.message === 'Неправильные почта или пароль') {
        next(err);
      } else {
        next(err);
      }
    });
};

const logOut = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then(() => res.clearCookie('jwt').send({}))
    .catch(next);
};

module.exports = {
  getCurrentUser,
  updateProfile,
  login,
  creatUser,
  logOut,
};
