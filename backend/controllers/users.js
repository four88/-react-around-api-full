const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { NOT_FOUND_ERROR_CODE, SUCCESS_CODE } = require('../utils/constant');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');
const ConflictError = require('../errors/conflictError');

// eslint-disable-next-line
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      new NotFoundError('User ID not found');
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch(next);
};

// get all the user data
// eslint-disable-next-line
module.exports.getUser = (req, res, next) => {
  User.find({})
    .orFail(() => {
      new NotFoundError('Cannot find any user');
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Cannot find any user'));
      } else {
        // eslint-disable-next-line
        next(err);
      }
    });
};

// get the user data by id
// eslint-disable-next-line
module.exports.getProfile = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(() => {
      new NotFoundError('User ID not found');
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User ID not found');
      }
      res.status(SUCCESS_CODE).send({ data: user });
    })
    // eslint-disable-next-line
    .catch(next);
};

// create user
// eslint-disable-next-line
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(SUCCESS_CODE).send({
          data: {
            name: user.name,
            about: user.about,
            email: user.email,
            avatar: user.avatar,
          },
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            // eslint-disable-next-line
            next(new BadRequestError('Missing or Invalid email or password'));
          } if (err.name === 'MongoServerError') {
            // eslint-disable-next-line
            next(new ConflictError('This email is already exits'));
          } else {
            // eslint-disable-next-line
            next(err);
          }
        });
    });
};

// edit user profile
// eslint-disable-next-line
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  console.log(req.user);
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .orFail(() => {
      const error = new Error('Can not find this specific id');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        // eslint-disable-next-line
        next(new BadRequestError('Invalid user ID'));
      } else if (err.name === 'ValidationError') {
        // eslint-disable-next-line
        next(new BadRequestError('Invalid name or description'));
      } else {
        // eslint-disable-next-line
        next(err);
      }
    });
};

// edit user avatar
// eslint-disable-next-line
module.exports.updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail(() => {
      const error = new Error('Can not find this specific id');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        // eslint-disable-next-line
        next(new BadRequestError('Invalid user ID'));
      } else if (err.name === 'ValidationError') {
        // eslint-disable-next-line
        next(new BadRequestError('Invalid name or description'));
      } else {
        // eslint-disable-next-line
        next(err);
      }
    });
};

// login
// eslint-disable-next-line
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.status(SUCCESS_CODE).send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        ),
        name: user.name,
        email: user.email,
      });
    })
    .catch(() => {
      // eslint-disable-next-line
      next(new UnauthorizedError('Incorrect email or password'));
    });
};
