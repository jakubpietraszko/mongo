const express = require('express');
const { createVisit, getVisits, getVisit, updateVisit, deleteVisit } = require('../controllers/visitController');

const router = express.Router();
const { verifyToken, verifyAdmin, verifyLoggedUser } = require('../middlewares/auth');

router.post('/visits', verifyLoggedUser, createVisit);
router.get('/visits', verifyLoggedUser, getVisits);
router.get('/visits/:id', verifyLoggedUser, getVisit);
router.put('/visits/:id', verifyLoggedUser, updateVisit);
router.delete('/visits/:id', verifyLoggedUser, deleteVisit);

module.exports = router;