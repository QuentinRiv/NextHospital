import { Router } from 'express';
const router = Router();

import { create, random } from '../controllers/consultationController.js';

router.post('/new', create); // il faudra rajouter auth.requireAuth
router.get('/random', random);


export default router;