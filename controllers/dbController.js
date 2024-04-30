import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import Consultation from "../models/Consultation.js";

// Obtient toutes les infos d'un patient, selon le type de clef
export async function getPatientInfo(key, value) {
  try {
    const patient = await Patient.findOne({ [key]: value });

    if (!patient) {
      throw new Error(
        "Erreur de base de données lors de la recherche du Patient: "
      );
    }

    const data = {
      id: patient._id,
      email: patient.email,
      name: patient.name,
      assignedDoctor: patient.assignedDoctor,
      image: patient.image || "no image so far",
    };

    return data;
  } catch (error) {
    // Gestion des erreurs de la requête à la base de données
    throw new Error(
      "Erreur de base de données lors de la recherche du doctor: " +
        error.message
    );
  }
}

// Obtient toutes les infos d'un docteur, selon le type de clef
export async function getDoctorInfo(key, value) {
  try {
    const doctor = await Doctor.findOne({ [key]: value });

    if (!doctor) {
      throw new Error(
        "Erreur (getDoctorInfo) : Aucun docteur trouvé avec la clé " +
          key +
          " et la valeur " +
          value
      );
    }

    const data = {
      id: doctor._id,
      email: doctor.email,
      name: doctor.name,
      image: doctor.image || "no image so far",
    };

    return data;
  } catch (error) {
    // Log de l'erreur pour le débogage interne
    console.error("Erreur lors de la recherche du doctor:", error);
    // Propagation de l'erreur pour gestion externe
    throw new Error(
      "Erreur de base de données lors de la recherche du doctor: " +
        error.message
    );
  }
}

// Obtient toutes les infos d'un user, selon le type de clef
export async function getUserInfo(key, value) {
  console.log("getUserInfo", key, value);
  try {
    // Correction de la valeur pour remplacer '%20' par des espaces
    const adjustedValue = value.replace(/%20/g, " ");
    const user = await User.findOne({ [key]: value });

    if (user) {
      const userInfo = {
        id: user._id,
        email: user.email,
        profileType: user.profileType,
        profileId: user.profileId,
      };

      let profileType = {};
      if (user.profileType === "Patient") {
        profileType = await getPatientInfo("_id", userInfo.profileId);
      } else {
        profileType = await getDoctorInfo("_id", userInfo.profileId);
      }

      const data = { userInfo, profileType };

      return data;
    } else {
      // res.status(404).json({ message: "Aucun user trouvé avec ce nom." });
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la recherche du user:", error);
    return false;
  }
}

// Obtient toutes les consultations d'un oatient, selon l'ID
export async function getConsultations(profileId) {
  const consultations = await Consultation.find({ patient: profileId });
  let correct_consultations = [];

  for (let i = 0; i < consultations.length; i++) {
    let consultation = {
      category: consultations[i].category,
      info: consultations[i].info,
    }; // Initiate dict

    const date = new Date(consultations[i].date);

    try {
      var doctorinfo = await getDoctorInfo("_id", consultations[i].doctor);
      var patientinfo = await getPatientInfo("_id", consultations[i].patient);
    } catch (err) {
      throw new Error(
        "Erreur de base de données lors de la recherche du doctor ou patient: " +
          err.message
      );
    }

    consultation["date"] = date.toISOString().split("T")[0];
    consultation["doctor"] = doctorinfo.name;
    consultation["doctorImg"] = doctorinfo.image;
    consultation["patient"] = patientinfo.name;

    correct_consultations.push(consultation);
  }
  return correct_consultations;
}

// Obtient le nom d'un docteur au hasard
export async function getRandomDoctor(info) {
  try {
    const doctors = await Doctor.find({});
    if (!doctors) throw new Error("Erreur : pas de Docteur dans la DB");

    // On en prend un au hasard
    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];

    if (info === "all") return randomDoctor;
    else {
      return randomDoctor[info];
    }
  } catch (error) {
    throw new Error(
      "Erreur de base de données lors de la recherche du doctor: " +
        error.message
    );
  }
}

const dbCtrl = {
  getPatientInfo,
  getDoctorInfo,
  getUserInfo,
  getConsultations,
  getRandomDoctor,
};

export default dbCtrl;
