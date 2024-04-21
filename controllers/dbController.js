import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Consultation from '../models/Consultation.js';


async function getPatientInfo(key, value) {
    try {
        // Correction de la valeur pour remplacer '%20' par des espaces
        // const adjustedValue = value.replace(/%20/g, " ");
        const patient = await Patient.findOne({ [key]: value });

        if (patient) {
            const data = ({
                id: patient._id,
                email: patient.email,
                name: patient.name,
                assignedDoctor: patient.assignedDoctor,
                image: patient.image || "no image so far",
            });
            return data;
        } else {
            console.log("Aucun utilisateur trouvé avec ce nom");
            return false
        }
    } catch (error) {
        // Gestion des erreurs de la requête à la base de données
        console.error('Erreur lors de la recherche du patient:', error);
        return false
    }

  };

async function getDocInfo(key, value) {
    try {
    //   const adjustedValue = value.replace(/%20/g, " ");
      const doctor = await Doctor.findOne({ [key]: value });
  
      if (doctor) {
          const data = ({
              id: doctor._id,
              email: doctor.email,
              name: doctor.name,
              image: doctor.image || "no image so far"
          });
          return data;
      } else {
          // res.status(404).json({ message: "Aucun doctor trouvé avec ce nom." });
          return false;
      }
  } catch (error) {
      // Gestion des erreurs de la requête à la base de données
      console.error('Erreur lors de la recherche du doctor:', error);
      return false;
  }
  };

  async function getUserInfo(key, value) {
    console.log('getUserInfo', key, value);
    try {
        // Correction de la valeur pour remplacer '%20' par des espaces
        const adjustedValue = value.replace(/%20/g, " ");
        const user = await User.findOne({ [key]: value });

        if (user) {
            const userInfo = {
                id: user._id,
                email: user.email,
                profileType: user.profileType,
                profileId: user.profileId
            };

            let profileType = {};
            if (user.profileType === 'Patient') {
                profileType = await getPatientInfo( '_id', userInfo.profileId);
            } else {
                profileType = await getDocInfo( '_id', userInfo.profileId);
            }

            const data = {userInfo, profileType};

            return data;
        } else {
            // res.status(404).json({ message: "Aucun user trouvé avec ce nom." });
            return false
        }
    } catch (error) {
        console.error('Erreur lors de la recherche du user:', error);
        return false;
    }
  };


  async function getConsultations(profileId) {
    const consultations = await Consultation.find({ patient: profileId });
    let correct_consultations = []

    for (let i = 0; i < consultations.length; i++) {
        let consultation = {category : consultations[i].category, info: consultations[i].info}; // Initiate dict

        const date = new Date(consultations[i].date);
        const docinfo = await getDocInfo('_id', consultations[i].doctor);
        const patientinfo = await getPatientInfo('_id', consultations[i].patient);

        consultation['date'] = date.toISOString().split('T')[0];
        consultation['doctor'] = docinfo.name;
        consultation['doctorImg'] = docinfo.image;
        consultation['patient'] = patientinfo.name;

        correct_consultations.push(consultation);
    }
    return correct_consultations;
  };

  const _getUserInfo = getUserInfo;
export { _getUserInfo as getUserInfo };
  const _getDocInfo = getDocInfo;
export { _getDocInfo as getDocInfo };
  const _getPatientInfo = getPatientInfo;
export { _getPatientInfo as getPatientInfo };
  const _getConsultations = getConsultations;
export { _getConsultations as getConsultations };