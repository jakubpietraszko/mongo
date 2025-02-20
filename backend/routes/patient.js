const express = require('express');
const { createPatient, getPatients, getPatient, updatePatient, deletePatient } = require('../controllers/patientController');

const router = express.Router();
const { verifyToken, verifyAdmin, verifyLoggedUser } = require('../middlewares/auth');

router.post('/patients', verifyLoggedUser, createPatient);
router.get('/patients', verifyLoggedUser, getPatients);
router.get('/patients/:id', verifyLoggedUser, getPatient);
router.put('/patients/:id', verifyLoggedUser, updatePatient);
router.delete('/patients/:id', verifyLoggedUser, deletePatient);

module.exports = router;