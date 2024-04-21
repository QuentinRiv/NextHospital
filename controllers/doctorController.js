import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { join } from 'path'; // Assurez-vous que cette ligne est décommentée
import { getDocInfo } from './dbController.js'; // Ajustez le chemin relatif selon votre structure de répertoire




import { hash } from 'bcrypt';
const saltRounds = 10; // Par exemple

export function create(req, res, next) {
  // Hashage du mot de passe
  hash(req.body.password, saltRounds, function(err, hashedPassword) {
    if (err) {
      return res.status(500).send("Erreur lors du hashage du mot de passe");
    }

    const newDoctor = new Doctor({
      name: req.body.doctorName,
      password: hashedPassword,
      email: req.body.email,
      image: req.body.image
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
}



export function doctorPage(req, res) {
  res.sendFile(join(__dirname, '..', 'views', 'doctorV.html'));
}


export async function random(req, res) {

  async function createRandomDoc() {
    const names = [
      'Ben Fox', 'Ada Ray', 'Ian Low', 'Zoe May', 'Leo Max',
      'Nia Jay', 'Eli Sol', 'Ida Fay', 'Uma Lee', 'Ava Zed',
      'Ora Tai', 'Eva Joy', 'Rex Tao', 'Sky Dai', 'Gil Day'
    ];
    
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const [firstName, lastName] = randomName.split(' ');

    const email = `${lastName.toLowerCase()}.${firstName.toLowerCase()}@email.com`;
    const password = '1234';
    const image = `doc_${firstName}.jpg`;

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
    create(fakeReq, fakeRes);

    return fakeReq.body;
  } catch (err) {
      console.error('Error generating random doctor:', err);
    }
  };

  const docc = await createRandomDoc();

  const doctorData = {
      doctorName: docc.doctorName,  // Remplacez par les données réelles
      email: docc.email,
      image: "/images/doc_Rex.jpg"  // Assurez-vous que le chemin est correct
  };
  res.render('random', doctorData);

}



export async function getInfo(req, res) {
  try {
    const data = await getDocInfo(req.query.key, req.query.value);
    if (!data) {
      return res.status(404).json({ error: "Aucune donnée trouvée pour la clé et la valeur spécifiées" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Erreur interne du serveur : ", error);
  }
}

