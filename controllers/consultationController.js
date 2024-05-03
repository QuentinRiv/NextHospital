import Consultation from "../models/Consultation.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

// Création d'un consultation
export async function create(req, res) {
  // Obtentin des ID des docteur et patient
  try {
    var doctorId = await getDoctorIdByName(req.body.doctorName);
    var patientId = await getPatientIdByName(req.body.patientName);
  } catch (error) {
    return res.status(400).json({
      message: "Error (create) : Doctor or patient not found =>" + error,
    });
  }

  // Création d'une nouvelle consultation
  try {
    const newConsultation = new Consultation({
      date: req.body.date,
      doctor: doctorId,
      patient: patientId,
      category: req.body.category,
      info: req.body.info,
    });
    await newConsultation.save();
    res.status(201).json({ message: "Consultation créée !" });
  } catch (error) {
    console.error("Error creating Consultation:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la consultation" });
  }
}

// Obtient l'ID d'un docteur en sachant le nom
async function getDoctorIdByName(doctorName) {
  try {
    const doctor = await Doctor.findOne({ name: doctorName });
    if (!doctor) {
      throw new Error(
        "Erreur (getDoctorIdByName) : pas de docteur avec le nom " + doctorName
      );
    }
    return doctor._id;
  } catch (error) {
    throw new Error(
      "Erreur (getDoctorIdByName) : erreur pour récupérer le docteur => " +
        error
    );
  }
}

// Obtient l'ID d'un patient en sachant le nom
async function getPatientIdByName(patientName) {
  try {
    const patient = await Patient.findOne({ name: patientName });
    if (!patient) {
      throw new Error(
        "Erreur (getPatientIdByName) : pas de patient avec le nom " +
          patientName
      );
    }
    return patient._id;
  } catch (error) {
    throw new Error(
      "Erreur (getPatientIdByName) : erreur pour récupérer le patient => " +
        error
    );
  }
}

// Création aléatoire d'un RDV
export async function random(req, res) {
  try {
    try {
      var doctorName = await getRandomDoctor("name");
      var patientName = await getRandomPatient("name");
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }

    const categories = ["Checkup", "Conseil", "Urgence"];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const info = "Nothing interesting here";
    let today = new Date();
    const date = today.toISOString().split("T")[0];

    await create(
      {
        body: {
          date,
          doctorName,
          patientName,
          category,
          info,
        },
      },
      res
    );
  } catch (err) {
    console.error("Error generating random consultation:", err);
    res.status(500).json({
      message: "Erreur lors de la création d'une consultation aléatoire",
    });
  }
}

// Obtient le nom d'un docteur au hasard
async function getRandomDoctor(info) {
  try {
    const doctors = await Doctor.find({});
    if (!doctors)
      throw new Error("Erreur (getRandomDoctor) : pas de Docteur dans la DB");

    // On en prend un au hasard
    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];

    if (info === "all") return randomDoctor;
    else {
      return randomDoctor[info];
    }
  } catch (error) {
    throw new Error(
      "Erreur (getRandomDoctor) de base de données lors de la recherche du doctor: " +
        error.message
    );
  }
}

// Obtient le nom d'un patient au hasard
async function getRandomPatient(info) {
  try {
    const patient = await Patient.find({});
    if (!patient)
      throw new Error("Erreur (getRandomPatient) : pas de Patient dans la DB");

    // On en prend un au hasard
    const randomPatient = patient[Math.floor(Math.random() * patient.length)];

    if (info === "all") return randomPatient;
    else {
      return randomPatient[info];
    }
  } catch (error) {
    throw new Error(
      "Erreur (getRandomPatient) de base de données lors de la recherche du patient: " +
        error.message
    );
  }
}
