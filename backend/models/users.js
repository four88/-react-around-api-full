const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    reqired: [true, 'The "name" field must ve filled in'],
    minlength: [2, 'The minimum length of name is 2'],
    maxlength: [30, 'The maximum length of name is 30'],
    default: 'Jacques Cousteau',
  },

  about: {
    type: String,
    required: [true, 'The "about" field must be filled in'],
    minlength: [2, 'The minimum length of about is 2'],
    maxlength: [30, 'The maximum length of about is 30'],
    default: 'Explorer',
  },

  avatar: {
    type: String,
    required: [true, 'The "link" filed must be filled in'],
    validate: {
      validator(v) {
        return /^(http|https):\/\/(www\.)?[a-z0-9\-/.]+/gi.test(v);
      },
      message: 'The avatar link should be an URL link',
    },
    default: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },

  email: {
    type: String,
    unique: [true, 'This email is already used'],
    required: [true, 'The email filed must be filled in'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Wrong email format',
    },
  },

  password: {
    type: String,
    required: [true, 'The password must be filled in'],
    minlength: [8, 'The minimum length of password is 8'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect password or email'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect password or email'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
