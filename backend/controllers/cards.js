const Card = require('../models/cards');
const {
  SUCCESS_CODE,
} = require('../utils/constant');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

// get all the card data
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      new NotFoundError('Cards were not found');
    })
    .then((card) => res.status(SUCCESS_CODE).send({ data: card }))
    .catch(next);
};

// create card
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(SUCCESS_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid name or link'));
      } else {
        next(err);
      }
    });
};

// delete card
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params._id)
    .orFail(() => {
      new NotFoundError('Cards were not found');
    })
    .then((card) => {
      res.status(SUCCESS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid card or user Id'));
      } else {
        next(err);
      }
    });
};

// for like card
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      new NotFoundError('Card Id not found');
    })
    .then((card) => {
      res.status(SUCCESS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid card or user Id'));
      } else {
        next(err);
      }
    });
};

// for dislike card
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      new NotFoundError('Card Id not found');
    })
    .then((card) => {
      res.status(SUCCESS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid card or user Id'));
      } else {
        next(err);
      }
    });
};
