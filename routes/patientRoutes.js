const express = require('express');
const path = require('path'); // Assurez-vous que cette ligne est décommentée
const router = express.Router();

const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
router.post('/patients', (req, res) => {
    const newpatient = new Patient({
      patientname: req.body.patientname,
      password: req.body.password, // Vous devriez hasher les mots de passe avant de les stocker !
      email: req.body.email
    });
  
    newpatient.save()
      .then(patient => res.status(201).send(patient))
      .catch(err => res.status(500).send("Erreur lors de la création de l'utilisateur : " + err.message));
  });
  
  router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});


router.get('/patients', (req, res) => {
    Patient.find({}).then(patients => {
        res.render('patients', { patients: patients });
    }).catch(err => {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des patients');
    });
});



module.exports = router;
