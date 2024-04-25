import { Router } from 'express';
const router = Router();

import { requireAuth } from '../middleware/auth.js';
import { create, getInfo, patientPage, random } from '../controllers/patientController.js';


  
router.post('/new', create);
router.get('/getInfo', getInfo);
router.get('/main', requireAuth, patientPage);
router.get('/random', random)



export default router;
