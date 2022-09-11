const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The "name" field must be filled in'],
    minlength: [2, 'The minimum length of name is 2'],
    maxlength: [30, 'The maximum length of name is 30'],
  },
  link: {
    type: String,
    required: [true, 'The "link" filed must be filled in'],
    validate: {
      validator(v) {
        return /^(http|https):\/\/(www\.)?[a-z0-9\-/.]+/gi.test(v);
      },
      message: 'The image link should be an URL link',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'user',

  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
