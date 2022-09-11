const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// set controller
router.get('/', getCards);
router.post('/', createCard);
router.delete('/:_id', deleteCard);
router.put('/:_id/likes', likeCard);
router.delete('/:_id/likes', dislikeCard);

module.exports = router;
