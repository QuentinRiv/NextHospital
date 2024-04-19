const Doctor = require('../models/Doctor');
const User = require('../models/User');
const path = require('path'); // Assurez-vous que cette ligne est décommentée


const bcrypt = require('bcrypt');
const saltRounds = 10; // Par exemple

exports.create = (req, res, next) => {
  // Hashage du mot de passe
  bcrypt.hash(req.body.password, saltRounds, function(err, hashedPassword) {
    if (err) {
      return res.status(500).send("Erreur lors du hashage du mot de passe");
    }

    const newDoctor = new Doctor({
      name: req.body.doctorName,
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

exports.getinfo = (req, res) => {
  
};

exports.doctorPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'doctorV.html'));
};


exports.random = (req, res) => {

  async function createRandomPatient() {
    const names = [
      'Ben Fox', 'Ada Ray', 'Ian Low', 'Zoe May', 'Leo Max',
      'Nia Jay', 'Eli Sol', 'Ida Fay', 'Uma Lee', 'Ava Zed',
      'Ora Tai', 'Eva Joy', 'Rex Tao', 'Sky Dai', 'Gil Day'
    ];
    
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const [firstName, lastName] = randomName.split(' ');

    const email = `${lastName.toLowerCase()}.${firstName.toLowerCase()}@email.com`;
    const password = '1234';
    const image = `doc_${firstName.toLowerCase()}.jpg`;

  // Créer un faux objet req et res pour simuler une requête
  const fakeReq = {
    body: {
      doctorName: `${firstName} ${lastName}`,
      email,
      password,
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
      console.error('Error generating random doctor:', err);
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
          const doctor = await Doctor.findOne({ [key]: value });

          if (doctor) {
              console.log(doctor);
              res.status(202).json({
                  id: doctor._id,
                  email: doctor.email,
                  name: doctor.name,
                  image: doctor.image || "no image so far"
              });
          } else {
              // Aucun utilisateur trouvé avec ce nom
              res.status(404).json({ message: "Aucun doctor trouvé avec ce nom." });
          }
      } catch (error) {
          // Gestion des erreurs de la requête à la base de données
          console.error('Erreur lors de la recherche du doctor:', error);
          res.status(500).json({ message: "Erreur interne du serveur lors de la recherche du doctor." });
      }
  } else {
      res.status(400).json({ message: "Aucune valeur spécifiée pour la recherche." });
  }
};

