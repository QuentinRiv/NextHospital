import User from '../models/User.js';
import Patient from '../models/Patient.js';
import { getPatientInfo, getDocInfo, getUserInfo, getConsultations } from './dbController.js'; 
import appmtCtrl from './appointmentController.js'

import { hash } from 'bcrypt';
const saltRounds = 10; // Par exemple

export async function create(req, res) {
  try {
    // Hashage du mot de passe
    const hashedPassword = await hash(req.body.password, saltRounds);

    // Recherche du docteur
    const doc = await Patient.findOne({ '_id': req.body.assignedDoctor });
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
}



export async function patientPage(req, res) {
  const user = await getUserInfo('_id', req.user);
  
  if (user.userInfo.profileType != 'Patient') {
    return res.status(403).send('Not authorised : you are not a patient...');
  }


  const consuls = await getConsultations(user.profileType.id); // Consultation
  const appointments = await appmtCtrl.getAppointments('patient', user.profileType.id); 

  res.render('patient', {
    consultations: consuls, appointments: appointments  // Envoyer l'ID utilisateur à la vue EJS
  });
}


export async function random(req, res) {

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
  const assignedDoctor = await getDocInfo();
  const assignedDoctorId = assignedDoctor.id;

  if (!assignedDoctorId) {
    return null;
  }

  // Simuler une requête pour la création d'un patient
  const fakeReq = {
    body: {
      name: `${firstName} ${lastName}`,
      email,
      password,
      assignedDoctor: assignedDoctorId
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

  await create(fakeReq, fakeRes);

    return fakeReq.body;

};


  const randompatient = await createRandomPatient();
  console.log("\n-", randompatient);

  const patientData = {
      doctorName: randompatient.name,  // Remplacez par les données réelles
      email: randompatient.email,
      image: "/images/doc_Rex.jpg"  // Assurez-vous que le chemin est correct
  };
  res.render('random', patientData);
}


export async function getInfo(req, res) {
  try {
    const data = await getPatientInfo(req.query.key, req.query.value);
    if (!data) {
      return res.status(404).json({ error: "Aucune donnée trouvée pour la clé et la valeur spécifiées" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Erreur interne du serveur : ", error);
  }
}