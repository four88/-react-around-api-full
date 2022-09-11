const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NOT_FOUND_ERROR_CODE, ERROR_OCCURED_CODE, ERROR_OCCURED_MSG, INVALID_CODE, SUCCESS_CODE } = require('../utils/constant');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error('Can not find this user id');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_CODE).send({ message: 'Invalid user id' });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_OCCURED_CODE).send({ message: ERROR_OCCURED_MSG });
      }
    });
};


// get all the user data
module.exports.getUser = (req, res) => {
  User.find({})
    .orFail(() => {
      const error = new Error('Can not find any user');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message })
      } else {
        res.status(ERROR_OCCURED_CODE).send({ message: ERROR_OCCURED_MSG })
      }

    });
};

// get the user data by id
module.exports.getProfile = (req, res) => {
  User.findById(req.params._id)
    .orFail(() => {
      const error = new Error('Can not find this user id');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_CODE).send({ message: 'Invalid user id' });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_OCCURED_CODE).send({ message: ERROR_OCCURED_MSG });
      }
    });
};

// create user
module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
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
            res.status(INVALID_CODE).send({
              message: `${Object.values(err.errors)}`,
            });
          } else {
            res.status(ERROR_OCCURED_CODE).send({ message: ERROR_OCCURED_MSG });
          }
        });
    })
};

// edit user profile
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  console.log(req.user)
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .orFail(() => {
      const error = new Error('Can not find this specific id');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_CODE).send({ messge: 'Invalid user id' });
      }
      else if (err.name === 'ValidationError') {
        res.status(INVALID_CODE).send({
          message: `${Object.values(err.errors)}`,
        });
      }
      else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_OCCURED_CODE).send({ message: ERROR_OCCURED_MSG });
      }
    });
};



// edit user avatar
module.exports.updateProfileAvatar = (req, res) => {
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
        res.status(INVALID_CODE).send({ messge: 'Invalid user id' });
      }
      else if (err.name === 'ValidationError') {
        res.status(INVALID_CODE).send({
          message: `${Object.values(err.errors)}`,
        });
      }
      else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_OCCURED_CODE).send({ message: ERROR_OCCURED_MSG });
      }
    });
};

// login
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.status(SUCCESS_CODE).send({
        token: jwt.sign({ _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' }),
        name: user.name,
        email: user.email,
        _id: user._id
      })
    })
    .catch((err) => {
      res.status(INVALID_CODE).send({ message: err.message })
    });
};


