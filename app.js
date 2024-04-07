const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/ma_base_de_donnees'; // Remplacez ma_base_de_donnees par le nom de votre base de données
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());
app.use(express.static('public'));

// Route optionnelle pour servir index.html en tant que page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  

app.get('/prescriptions', (req, res) => {
  // Logique pour ajouter une prescription
  res.status(201).send('Prescription added');
});

const Prescription = require('./models/Prescription');

// Exemple pour créer une nouvelle prescription
app.post('/prescriptions', (req, res) => {
  const newPrescription = new Prescription({
    patientName: req.body.patientName,
    doctorName: req.body.doctorName,
    medicationDetails: req.body.medicationDetails
  });

  newPrescription.save()
    .then((prescription) => res.status(201).send(prescription))
    .catch((error) => res.status(500).send("Erreur lors de la création de la prescription"));
});


const patient = require('./models/Patient');

// Exemple pour créer un nouvel utilisateur
app.post('/patients', (req, res) => {
  const newpatient = new patient({
    patientname: req.body.patientname,
    password: req.body.password, // Vous devriez hasher les mots de passe avant de les stocker !
    email: req.body.email
  });

  newpatient.save()
    .then(patient => res.status(201).send(patient))
    .catch(err => res.status(500).send("Erreur lors de la création de l'utilisateur : " + err.message));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });