const express = require('express');
const { createRating, getRatings, getRating, updateRating, deleteRating } = require('../controllers/ratingController');

const router = express.Router();
const { verifyToken, verifyAdmin, verifyLoggedUser } = require('../middlewares/auth');

router.post('/ratings', verifyLoggedUser, createRating);
router.get('/ratings', verifyLoggedUser, getRatings);
router.get('/ratings/:id', verifyLoggedUser, getRating);
router.put('/ratings/:id', verifyLoggedUser, updateRating);
router.delete('/ratings/:id', verifyLoggedUser, deleteRating);

module.exports = router;