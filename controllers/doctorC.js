const Doctor = require('../models/Doctor');
const User = require('../models/User');
const path = require('path'); // Assurez-vous que cette ligne est décommentée


const bcrypt = require('bcrypt');
const saltRounds = 10; // Par exemple

exports.createDoctor = (req, res, next) => {
  // Hashage du mot de passe
  bcrypt.hash(req.body.password, saltRounds, function(err, hashedPassword) {
    if (err) {
      return res.status(500).send("Erreur lors du hashage du mot de passe");
    }

    const newDoctor = new Doctor({
      doctorName: req.body.doctorName,
      password: hashedPassword,
      email: req.body.email
    });

    newDoctor.save()
      .then(doctor => {
        // Création de l'utilisateur associé au docteur
        const newUser = new User({
          email: doctor.email,
          password: hashedPassword, // Stocker le même mot de passe hashé
          profileType: "Doctor",
          profileId: doctor._id,
        });

        newUser.save()
          .then(() => res.status(201).json({ message: 'Docteur et utilisateur créés !' }))
          .catch(error => res.status(400).json({ error: "Erreur lors de la création de l'utilisateur : " + + error.message}));
      })
      .catch(err => res.status(500).send("Erreur lors de la création du docteur : " + err.message));
  });
};


exports.getDoctors = (req, res) => {
  Doctor.find({}).then(doctors => {
      res.render('Doctors', { doctors: doctors });
  }).catch(err => {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération des Doctors');
  });
};

exports.home = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
};

exports.doctorPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'doctorV.html'));
};