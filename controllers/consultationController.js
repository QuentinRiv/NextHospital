const Consultation = require('../models/Consultation');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');
const path = require('path'); // Assurez-vous que cette ligne est décommentée


exports.createConsul = async (req, res) => {
    
    async function getDoctorIdByName(doctorName) {
        try {
          const doctor = await Doctor.findOne({ doctorName: doctorName });
          if (doctor) {
            console.log("Trouvé !!");
            return doctor._id;
          } else {
            console.log('No doctor found with the name:', doctorName);
            return null;
          }
        } catch (error) {
          console.error('Error fetching doctor:', error);
          return null;
        }
      }

      async function getPatientIdByName(patientName) {
        try {
          const patient = await Patient.findOne({ patientName: patientName });
          if (patient) {
            console.log("Trouvé !!");
            return patient._id;
          } else {
            console.log('No patient found with the name:', patientName);
            return null;
          }
        } catch (error) {
          console.error('Error fetching patient:', error);
          return null;
        }
      }

    //   docId = getDoctorIdByName(req.body.doctorName);
    //   patId = getPatientIdByName(req.body.patientName);

      async function handleDoctorActions(requete) {
        const doctorId = await getDoctorIdByName(req.body.doctorName);
        const patientId = await getDoctorIdByName(req.body.patientName);
        if (doctorId && patientId) {
          console.log('Found Doctor and Patient ID:', doctorId);
          // Ici, ajoutez les fonctions ou opérations que vous souhaitez exécuter avec l'ID trouvé.
          // Exemple : sendEmail(doctorId), updateRecords(doctorId), etc.
        } else {
          console.log('Doctor not found, cannot proceed with further actions.');
        }
      }

      return "Thanks man"
  };