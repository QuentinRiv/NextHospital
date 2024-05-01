import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import {
  getPatientInfo,
  getRandomDoctor,
  getUserInfo,
  getConsultations,
} from "./dbController.js";
import { getAppointments } from "./appointmentController.js";

import { hash } from "bcrypt";
const saltRounds = 10; // Par exemple

export async function create(req, res) {
  try {
    // Hashage du mot de passe
    const hashedPassword = await hash(req.body.password, saltRounds);

    // Recherche du docteur
    const doc = await Doctor.findOne({ _id: req.body.assignedDoctor });
    if (!doc) {
      return res.status(500).send("Erreur : docteur non trouvé !");
    }
    console.log("Success : docteur trouvé : " + doc._id);

    // Création du patient
    const newPatient = new Patient({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
      assignedDoctor: doc._id,
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
    res.status(201).json({ message: "Patient et utilisateur créés !" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send(
        "Erreur lors de la création du patient ou de l'utilisateur : " +
          err.message
      );
  }
}

export async function patientPage(req, res) {
  const user = await getUserInfo("_id", req.user);

  if (user.userInfo.profileType != "Patient") {
    // Pas un patient ?
    return res.status(403).send("Not authorised : you are not a patient...");
  }

  try {
    var consultations = await getConsultations(user.profileType.id); // Consultation
    var appointments = await getAppointments("patient", user.profileType.id);
    var doctors = await Doctor.find({});
  } catch (error) {
    res.status(403).send(error.message);
  }

  res.render("patient", {
    user: user.profileType,
    consultations: consultations,
    appointments: appointments, // Envoyer l'ID utilisateur à la vue EJS
    doctors: doctors,
  });
}

export async function random(req, res) {
  async function createRandomPatient() {
    const names = [
      "Max Lee",
      "Bob Zin",
      "Joe Kim",
      "Tim Fox",
      "Sam Tao",
      "Liz Ray",
      "Amy Joe",
      "Ron Kay",
      "Eva Sun",
      "Mia Pao",
      "Dan Roy",
      "Sue Ivy",
      "Tom Day",
      "Ann May",
      "Leo Tay",
    ];

    // Choisi prénom-nom au hasard
    const randomName = names[Math.floor(Math.random() * names.length)];
    const [firstName, lastName] = randomName.split(" ");

    const email = `${lastName.toLowerCase()}.${firstName.toLowerCase()}@email.com`;
    const password = "1234";
    try {
      var assignedDoctorId = await getRandomDoctor("_id");
    } catch (error) {
      res.status(500).send({ error: error.message });
    }

    var data = {
      name: `${firstName} ${lastName}`,
      email,
      password,
      assignedDoctor: assignedDoctorId,
    };

    // POST à l'API
    await fetch(process.env.URL + "/patient/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response.json());
          throw new Error("Échec de la connexion");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Erreur :", error);
      });

    return data; // Si success
  }

  try {
    const randompatient = await createRandomPatient();
    const patientData = {
      doctorName: randompatient.name, // Remplacez par les données réelles
      email: randompatient.email,
      image: "/image/doc_Rex.jpg", // Assurez-vous que le chemin est correct
    };
    return res.render("random", patientData);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

export async function getInfo(req, res) {
  try {
    const data = await getPatientInfo(req.query.key, req.query.value);
    if (!data) {
      return res.status(404).json({
        error: "Aucune donnée trouvée pour la clé et la valeur spécifiées",
      });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Erreur interne du serveur : ", error);
  }
}
