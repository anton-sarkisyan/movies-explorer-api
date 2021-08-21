const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationErr = require('../errors/validation-err');
const NotFoundErr = require('../errors/not-found-err');
const NoRightsErr = require('../errors/no-rights-err');
const ConflictErr = require('../errors/conflict-err');
const {
  NOT_FOUND_ID_USER_ERR,
  VALIDATION_UPDATE_USER_ERR,
  VALIDATION_CREATE_USER_ERR,
  CREATE_USER_CONFLICT_ERR,
  INVALID_LOGIN_ERR,
} = require('../utils/const');

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
    .orFail(() => new NotFoundErr(NOT_FOUND_ID_USER_ERR))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === NOT_FOUND_ID_USER_ERR) {
        next(err);
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationErr(VALIDATION_UPDATE_USER_ERR));
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
            next(new ConflictErr(CREATE_USER_CONFLICT_ERR));
          } else if (err.name === 'CastError' || err.name === 'ValidationError') {
            next(new ValidationErr(VALIDATION_CREATE_USER_ERR));
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
        throw new NoRightsErr(INVALID_LOGIN_ERR);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoRightsErr(INVALID_LOGIN_ERR);
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
      if (err.message === INVALID_LOGIN_ERR) {
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
