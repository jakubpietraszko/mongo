const express = require('express');
const { createComment, getComments, getComment, updateComment, deleteComment } = require('../controllers/commentController');

const router = express.Router();

const { verifyToken, verifyAdmin, verifyLoggedUser } = require('../middlewares/auth');


router.post('/comments', verifyLoggedUser, createComment);
router.get('/comments', verifyLoggedUser, getComments);
router.get('/comments/:id', verifyLoggedUser, getComment);
router.put('/comments/:id', verifyLoggedUser, updateComment);
router.delete('/comments/:id', verifyLoggedUser, deleteComment);

module.exports = router;