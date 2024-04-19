const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const path = require('path'); // Assurez-vous que cette ligne est décommentée


const bcrypt = require('bcrypt');
const saltRounds = 10; // Par exemple

exports.create = async (req, res) => {
  try {
    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Recherche du docteur
    const doc = await Doctor.findOne({ 'name': req.body.assignedDoctor });
    if (!doc) {
      return res.status(404).send("Erreur : docteur non trouvé !");
    }
    console.log('Success : docteur trouvé : ' + doc._id);

    // Création du patient
    const newPatient = new Patient({
      name: req.body.name,
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


exports.random = (req, res) => {

  async function getRandomDoctorId() {
    try {
      const doctors = await Doctor.find({});
      const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
      return randomDoctor.name;
    } catch (error) {
      console.error('Failed to retrieve doctor IDs:', error);
      return null;
    }
  };

  async function createRandomPatient() {
    const names = [
      'Max Lee', 'Bob Zin', 'Joe Kim', 'Tim Fox', 'Sam Tao',
      'Liz Ray', 'Amy Joe', 'Ron Kay', 'Eva Sun', 'Mia Pao',
      'Dan Roy', 'Sue Ivy', 'Tom Day', 'Ann May', 'Leo Tay'
    ];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const [firstName, lastName] = randomName.split(' ');

    const email = `${lastName.toLowerCase()}.${firstName.toLowerCase()}@email.com`;
    const password = '1234';
    const image = `pat_${firstName.toLowerCase()}.jpg`;
    const assignedDoctorId = await getRandomDoctorId();

    if (!assignedDoctorId) {
      console.log('No doctor available to assign');
      return;
    }

  // Créer un faux objet req et res pour simuler une requête
  const fakeReq = {
    body: {
      name: `${firstName} ${lastName}`,
      email,
      password,
      assignedDoctor: assignedDoctorId,
      image
    }
  };

  const fakeRes = {
    status: function(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    send: function(data) {
      console.log('Send:', data);
    },
    json: function(data) {
      console.log('JSON:', data);
    }
  };

  try {
    // Appeler la fonction createPatient avec les objets fakeReq et fakeRes
    console.log(fakeReq);
    await exports.create(fakeReq, fakeRes);
  } catch (err) {
      console.error('Error generating random patient:', err);
    }
  };

  createRandomPatient();

  res.status(200).send("Tout bon ! ");

};


exports.getInfo = async (req, res) => {
  const key = req.query.key;
  const value = req.query.value;
  if (value) {
      try {
          // Correction de la valeur pour remplacer '%20' par des espaces
          const adjustedValue = value.replace(/%20/g, " ");
          // Assumons que vous cherchez par 'name', corriger la requête pour utiliser la clé correcte
          const patient = await Patient.findOne({ [key]: value });

          if (patient) {
              console.log(patient);
              res.status(202).json({
                  id: patient._id,
                  email: patient.email,
                  name: patient.name,
                  assignedDoctor: patient.assignedDoctor,
                  image: patient.image || "no image so far",
              });
          } else {
              // Aucun utilisateur trouvé avec ce nom
              res.status(404).json({ message: "Aucun patient trouvé avec ce nom." });
          }
      } catch (error) {
          // Gestion des erreurs de la requête à la base de données
          console.error('Erreur lors de la recherche du patient:', error);
          res.status(500).json({ message: "Erreur interne du serveur lors de la recherche du patient." });
      }
  } else {
      res.status(400).json({ message: "Aucune valeur spécifiée pour la recherche." });
  }
};

