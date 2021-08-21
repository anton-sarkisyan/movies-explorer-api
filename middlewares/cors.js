const cors = require('cors');

const whitelist = [
  'http://localhost:3001',
  'http://movie.project.nomoredomains.club',
  'https://movie.project.nomoredomains.club',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  credentials: true,
};

module.exports = cors(corsOptions);
