const express = require('express');
const router = express.Router();

// Controller
const userCtrl = require('../controllers/userController');

// Routes
router.get('/connect', userCtrl.connect);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;