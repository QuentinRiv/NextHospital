const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const path = require('path'); // Assurez-vous que cette ligne est décommentée


const bcrypt = require('bcrypt');
const saltRounds = 10; // Par exemple

exports.createPatient = (req, res, next) => {
   

  bcrypt.hash(req.body.password, saltRounds, function(err, hashedPassword) {
    if (err) {
      return res.status(500).send("Erreur lors du hashage du mot de passe");
    }

    Doctor.findOne({ 'doctorName': req.body.assignedDoctor })
    .then(doc => {
      if (!doc) {
        // Gérer le cas où le docteur n'existe pas
        return res.status(404).send("Erreur : docteur non trouvé !");
      }
      // Continuer le traitement si le docteur existe
      console.log('Success : docteur trouvé : ' + doc._id);
    })
    .catch(err => {
      // Gérer l'erreur de la recherche
      console.error(err);
      return res.status(500).send("Erreur lors de la recherche du docteur !");
    });
  

  const newpatient = new Patient({
        patientName: req.body.patientName,
        password: req.body.password, // Vous devriez hasher les mots de passe avant de les stocker !
        email: req.body.email,
        assignedDoctor: doc._id
      });
    
    newpatient.save()
    .then(patient => {
      // Création de l'utilisateur associé au docteur
      const newUser = new User({
        email: patient.email,
        password: hashedPassword, // Stocker le même mot de passe hashé
        profileType: "Patient",
        assignedDoctor: patient._id,
      });

      newUser.save()
        .then(() => res.status(201).json({ message: 'Docteur et utilisateur créés !' }))
        .catch(error => res.status(400).json({ error: "Erreur lors de la création de l'utilisateur : " + + error.message}));
    })
    .catch(err => res.status(500).send("Erreur lors de la création du docteur : " + err.message));
    });
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