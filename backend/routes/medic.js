const express = require('express');
const { createMedic, getMedics, getMedic, updateMedic, deleteMedic } = require('../controllers/medicController');

const router = express.Router();
const { verifyToken, verifyAdmin, verifyLoggedUser } = require('../middlewares/auth');

router.post('/medics', verifyLoggedUser, createMedic);
router.get('/medics', verifyLoggedUser, getMedics);
router.get('/medics/:id', verifyLoggedUser, getMedic);
router.put('/medics/:id', verifyLoggedUser, updateMedic);
router.delete('/medics/:id', verifyLoggedUser, deleteMedic);

module.exports = router;