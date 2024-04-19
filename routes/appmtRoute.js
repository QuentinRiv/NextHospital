const express = require('express');
const path = require('path'); // Assurez-vous que cette ligne est décommentée
const router = express.Router();

const auth = require('../middleware/auth');

const Appointment = require('../models/Appointment');
const appointmentCtrl = require('../controllers/appmtController');

// Exemple pour créer une nouvelle prescription


  // Exemple pour créer un nouvel utilisateur
router.post('/new', appointmentCtrl.create); // il faudra rajouter auth.requireAuth
router.get('/random', appointmentCtrl.random); // il faudra rajouter auth.requireAuth


module.exports = router;