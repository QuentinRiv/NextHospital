const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const path = require('path'); // Assurez-vous que cette ligne est décommentée


const bcrypt = require('bcrypt');
const saltRounds = 10; // Par exemple

exports.createPatient = async (req, res) => {
  try {
    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Recherche du docteur
    const doc = await Doctor.findOne({ 'doctorName': req.body.assignedDoctor });
    if (!doc) {
      return res.status(404).send("Erreur : docteur non trouvé !");
    }
    console.log('Success : docteur trouvé : ' + doc._id);

    // Création du patient
    const newPatient = new Patient({
      patientName: req.body.patientName,
      password: hashedPassword,
      email: req.body.email,
      assignedDoctor: doc._id
    });

    const savedPatient = await newPatient.save();

    // Création de l'utilisateur associé au patient
    const newUser = new User({
      email: savedPatient.email,
      password: hashedPassword,
      profileType: "Patient",
      profileId: savedPatient._id, // Lier le patient au User
    });

    await newUser.save();
    res.status(201).json({ message: 'Patient et utilisateur créés !' });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la création du patient ou de l'utilisateur : " + err.message);
  }
};


exports.getPatients = (req, res) => {
  Patient.find({}).then(patients => {
      res.render('patients', { patients: patients });
  }).catch(err => {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération des patients');
  });
};

exports.home = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
};

exports.patientPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'patient.html'));
};