import { requireAuth } from '../middleware/auth.js';
import { Router } from 'express';
const router = Router();

// import Consultation from '../models/Consultation';
import appmtCtrl from '../controllers/appointmentController.js';

router.post('/new', requireAuth, appmtCtrl.create); // il faudra rajouter auth.requireAuth
// router.get('/random', random); // il faudra rajouter auth.requireAuth


export default router;