const MONGO_ADDRESS = 'mongodb://localhost:27017/bitfilmsdb';

const NOT_FOUND_PAGE = 'Запрашиваемый ресурс не найден';
const NO_RIGHTS_TEXT_ERR = 'Недостаточно прав для совершения действия';

// Константы ошибок для обработки роутов movies
const VALIDATION_CREATE_FILM_ERR = 'Переданы некорректные данные при создании фильма';
const NOT_FOUND_ID_FILM_ERR = 'Фильм по указанному _id не найден';
const VALIDATION_ID_FILM_ERR = 'Передан некорретный id фильма';

// Константы ошибок для обработки роутов users
const NOT_FOUND_ID_USER_ERR = 'Пользователь по указанному _id не найден';
const VALIDATION_UPDATE_USER_ERR = 'Переданы некорректные данные при обновлении пользователя';
const VALIDATION_CREATE_USER_ERR = 'Переданы некорректные данные при создании пользователя';
const CREATE_USER_CONFLICT_ERR = 'Переданы некорректные данные при создании пользователя';
const INVALID_LOGIN_ERR = 'Неправильные почта или пароль';

module.exports = {
  MONGO_ADDRESS,
  NOT_FOUND_PAGE,

  VALIDATION_CREATE_FILM_ERR,
  NOT_FOUND_ID_FILM_ERR,
  VALIDATION_ID_FILM_ERR,
  NO_RIGHTS_TEXT_ERR,

  NOT_FOUND_ID_USER_ERR,
  VALIDATION_UPDATE_USER_ERR,
  VALIDATION_CREATE_USER_ERR,
  CREATE_USER_CONFLICT_ERR,
  INVALID_LOGIN_ERR,
};
