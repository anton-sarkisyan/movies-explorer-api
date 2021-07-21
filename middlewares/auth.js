const jwt = require('jsonwebtoken');
const NoRightsErr = require('../errors/no-rights-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.cookie;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production'
      ? JWT_SECRET
      : 'dev-secret');
  } catch (error) {
    next(new NoRightsErr('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
