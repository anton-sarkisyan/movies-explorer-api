const { Joi } = require('celebrate');
const validator = require('validator');

const handleUrl = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

const isValidateSignup = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
};

const isValidateSignin = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
};

const isValidateUpdateProfile = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
};

const isValidateCreateMovie = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(handleUrl),
    trailer: Joi.string().required().custom(handleUrl),
    thumbnail: Joi.string().required(),
    movieId: Joi.string().min(1).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
};

const isValidateDeleteMovie = {
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
};

module.exports = {
  isValidateSignup,
  isValidateSignin,
  isValidateUpdateProfile,
  isValidateCreateMovie,
  isValidateDeleteMovie,
};
