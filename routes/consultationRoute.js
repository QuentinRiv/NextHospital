import { Router } from 'express';
const router = Router();

// import auth from '../middleware/auth.js';

// import Consultation from '../models/Consultation';
import { create, random } from '../controllers/consultationController.js';

// Exemple pour créer une nouvelle prescription


  // Exemple pour créer un nouvel utilisateur
router.post('/new', create); // il faudra rajouter auth.requireAuth
router.get('/random', random); // il faudra rajouter auth.requireAuth


export default router;