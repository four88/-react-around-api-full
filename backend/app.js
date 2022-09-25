const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const validator = require('validator');
const { celebrate, Joi, errors } = require('celebrate');
const cardRoutes = require('./routes/card');
const usersRoutes = require('./routes/users');
const auth = require('./middleware/auth');
const { NotFoundError } = require('./errors/notFoundError');

const { PORT = 3000, BASE_PATH } = process.env;
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();
const dbUri = 'mongodb://0.0.0.0:27017/aroundb';
const dbConfig = {
  useNewUrlParser: true,
};
mongoose.Promise = global.Promise;

// localhost not on my device I change it to 0.0.0.0
mongoose.connect(dbUri, dbConfig)
  .then(
    () => {
      console.log('DB connected');
    },
    (error) => {
      console.log(`cannot connect to DB:${error}`);
    },
  );

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

app.use(cors());
app.use(errors());
// for security
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

// using routes
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
}), login);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardRoutes);

app.get('*', () => {
  throw new NotFoundError('Requested resource not found');
})

app.use(errorLogger);

// for Non-exestent address
app.use((err, req, res, next) => {
  res
    .status(err.statusCode ? err.statusCode : 500)
    .send({
      message: err.message ? err.message : 'An error occurred on the server',
    });
});

app.listen(PORT, () => {
  console.log(`Link to server ${BASE_PATH}`);
  console.log(`Conntect to PORT ${PORT}`);
});