import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
const router = Router();

import { create, getInfo, doctorPage, random } from '../controllers/doctorController.js';


// TODO
router.get('/prescriptions', (req, res) => {
  // Logique pour ajouter une prescription
  res.status(201).send('Prescription added');
});


router.post('/new', create);
router.get('/getinfo', getInfo);
router.get('/main', requireAuth, doctorPage);
router.get('/random', random);


export default router;
