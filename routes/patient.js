const express = require('express');
const path = require('path'); // Assurez-vous que cette ligne est décommentée
const router = express.Router();

const auth = require('../middleware/auth');

const Prescription = require('../models/PrescriptionM');
const patientCtrl = require('../controllers/patientC');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});
  

router.get('/prescriptions', (req, res) => {
  // Logique pour ajouter une prescription
  res.status(201).send('Prescription added');
});

// Exemple pour créer une nouvelle prescription
router.post('/prescriptions', (req, res) => {
    const newPrescription = new Prescription({
      patientName: req.body.patientName,
      doctorName: req.body.doctorName,
      medicationDetails: req.body.medicationDetails
    });
  
    newPrescription.save()
      .then((prescription) => res.status(201).send(prescription))
      .catch((error) => res.status(500).send("Erreur lors de la création de la prescription"));
  });

  // Exemple pour créer un nouvel utilisateur
router.post('/new', patientCtrl.createPatient);
router.get('/patients', auth.requireAuth, patientCtrl.getPatients);
router.get('/index', auth.requireAuth, patientCtrl.home);
router.get('/patient', auth.requireAuth, patientCtrl.patientPage);



module.exports = router;