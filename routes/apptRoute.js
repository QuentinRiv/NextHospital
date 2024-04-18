const express = require('express');
const path = require('path'); // Assurez-vous que cette ligne est décommentée
const router = express.Router();

const auth = require('../middleware/auth');

const Consultation = require('../models/Consultation');
const consultationCtrl = require('../controllers/consultationController');

// Exemple pour créer une nouvelle prescription


  // Exemple pour créer un nouvel utilisateur
router.post('/new', consultationCtrl.createConsul); // il faudra rajouter auth.requireAuth
// router.post('/random', consultationCtrl.random); // il faudra rajouter auth.requireAuth




module.exports = router;
