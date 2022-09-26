const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { NOT_FOUND_ERROR_CODE, SUCCESS_CODE } = require('../utils/constant');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      new NotFoundError('User ID not found');
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch(next);
};

// get all the user data
module.exports.getUser = (req, res, next) => {
  console.log(req.user._id);
  User.find({})
    .orFail(() => {
      new NotFoundError('User ID not found');
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch(next);
};

// get the user data by id
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
    .catch(next);
};

// create user
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
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
        .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Missing or Invalid email or password'));
          } else {
            next(err);
          }
        });
    });
};

// edit user profile
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
        next(new BadRequestError('Invalid user ID'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid name or description'));
      } else {
        next(err);
      }
    });
};

// edit user avatar
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
        next(new BadRequestError('Invalid user ID'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid name or description'));
      } else {
        next(err);
      }
    });
};

// login
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
      next(new UnauthorizedError('Incorrect email or password'));
    });
};
