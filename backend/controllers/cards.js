const Card = require('../models/cards');
const { NOT_FOUND_ERROR_CODE, SUCCESS_CODE, ERROR_OCCURED_CODE, ERROR_OCCURED_MSG, INVALID_CODE } = require('../utils/constant');

// get all the card data
module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      const error = new Error('Can not find any card');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => res.status(SUCCESS_CODE).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message })
      } else {
        res.status(ERROR_OCCURED_CODE).send({ message: ERROR_OCCURED_MSG })
      }
    });
};

// create card
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(SUCCESS_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INVALID_CODE).send({
          message: `${Object.values(err.errors)}`
        });
      } else {
        res.status(ERROR_OCCURED_CODE).send({ message: ERROR_OCCURED_MSG });
      }
    });
};

// delete card
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .orFail(() => {
      const error = new Error('Can not find this user id on all cards');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => {
      res.status(SUCCESS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_CODE).send({ message: 'Invalid card id' });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_OCCURED_CODE).send({ message: ERROR_OCCURED_MSG });
      }
    });
};

// for like card
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Can not find this user id');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => {
      res.status(SUCCESS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_CODE).send({ message: 'Innvalid card id or user id' });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_OCCURED_CODE).send({ message: ERROR_OCCURED_MSG });
      }
    });
};

// for dislike card
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Can not find this user id');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => {
      res.status(SUCCESS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_CODE).send({ messaage: " Invalid card id or user id" });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_OCCURED_CODE).send({ message: ERROR_OCCURED_MSG });
      }
    });
};
