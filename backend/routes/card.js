const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// set controller
router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp(/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/)),
  }),
}), createCard);

router.delete('/:_id', celebrate({
  [Segments.PARAMS]: Joi.object({
    cardId: Joi.string().required().hex(),
  }),
}), deleteCard);

router.put(
  '/:_id/likes',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      cardId: Joi.string().required().hex(),
    }),
  }),
  likeCard,
);

router.delete(
  '/:_id/likes',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      cardId: Joi.string().required().hex(),
    }),
  }),
  dislikeCard,
);

module.exports = router;
