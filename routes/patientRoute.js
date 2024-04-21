import { Router } from 'express';
import { join } from 'path'; // Assurez-vous que cette ligne est décommentée
const router = Router();

import { requireAuth } from '../middleware/auth.js';

import Prescription from '../models/Prescription.js';
import { create, getPatients, getInfo, patientPage, random } from '../controllers/patientController.js';

router.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'views', 'index.html'));
});
  

router.get('/prescriptions', (req, res) => {
  // Logique pour ajouter une prescription
  res.status(201).send('Prescription added');
});

// Exemple pour créer une nouvelle prescription
router.post('/prescriptions', (req, res) => {
    const newPrescription = new Prescription({
      name: req.body.name,
      doctorName: req.body.doctorName,
      medicationDetails: req.body.medicationDetails
    });
  
    newPrescription.save()
      .then((prescription) => res.status(201).send(prescription))
      .catch((error) => res.status(500).send("Erreur lors de la création de la prescription"));
  });

  // Exemple pour créer un nouvel utilisateur
router.post('/new', create);
router.get('/patients', requireAuth, getPatients);
router.get('/getInfo', getInfo);
router.get('/main', requireAuth, patientPage);
router.get('/random', random)



export default router;
