import Appointment from '../models/Appointment.js';
import { getPatientInfo, getDocInfo } from './dbController.js'; // Ajustez le chemin relatif selon votre structure de répertoire


async function getAppointments(key, profileId) {
    const appointments = await find({ [key]: profileId });
    let correct_appointments = []

    for (let i = 0; i < appointments.length; i++) {
        let appointment = { path: appointments[i].path }; // Initiate dict

        const date = new Date(appointments[i].date);
        const docinfo = await getDocInfo('_id', appointments[i].doctor);
        const patientinfo = await getPatientInfo('_id', appointments[i].patient);

        appointment['date'] = date.toISOString().split('T')[0];
        appointment['doctor'] = docinfo.name;
        appointment['patient'] = patientinfo.name;

        correct_appointments.push(appointment);
    }
    return correct_appointments;
  };

 async function create(req, res) {

      console.log("RES = ", req.body);

      try {
        const doctor = await getDocInfo('name', req.body.doctorName);
        const patient = await getPatientInfo('name', req.body.patientName);
        if ((!doctor) || (!patient)) {
          res.status(404).json({ error: "Aucune donnée trouvée pour la clé et la valeur spécifiées" });
        }

        // Création du patient
        try {
          const newAppmt = new Appointment({
            date: new Date(req.body.date),
            doctor: doctor.id,
            patient: patient.id,
            path: "random_path"
          });
          await newAppmt.save();
        } catch (err) {
          console.error(err);
        }

        res.status(201).json({ message: 'Rendez-vous créés !' });
      } catch (error) {
          res.status(400).send("Erreur interne du serveur : ", error);
      }

  };

  const appmtCtrl = {
    create
};

export default appmtCtrl;