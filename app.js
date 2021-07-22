const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, errors } = require('celebrate');
const corsMiddleware = require('./middlewares/cors');
const limiter = require('./middlewares/limiter');
const { login, creatUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/errors');
const { isValidateSignup, isValidateSignin } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

const { MONGO_ADDRESS } = require('./utils/const');

const { PORT = 3000 } = process.env;
const app = express();
const { NODE_ENV, DB_ADDRESS } = process.env;

mongoose.connect(NODE_ENV === 'production'
  ? DB_ADDRESS
  : MONGO_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(limiter);
app.use(corsMiddleware);

app.post('/signin', celebrate(isValidateSignin), login);
app.post('/signup', celebrate(isValidateSignup), creatUser);

app.use(auth);
app.use('/', require('./routes/index'));

app.get('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
});
