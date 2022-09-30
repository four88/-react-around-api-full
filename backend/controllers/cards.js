const Card = require('../models/cards');
const {
  SUCCESS_CODE,
} = require('../utils/constant');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

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
  const id = req.params.cardId;
  Card.findById(id)
    .then((card) => {
      console.log(card);
      if (!card) {
        throw new NotFoundError('Could not find a card with that id');
      }
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(id, () => {
          res.status(200).send({ message: 'Card deleted' });
        });
      } else if (id === undefined) {
        throw new NotFoundError('Could not find a card with that id');
      } else {
        throw new ForbiddenError('Authorization required for this action');
      }
    })
    .catch(next);
};

// for like card
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
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
      } if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Cards were not found'));
      } else {
        next(err);
      }
    });
};

// for dislike card
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
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
      } if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Cards were not found'));
      } else {
        next(err);
      }
    });
};
