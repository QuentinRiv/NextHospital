import Appointment from '../models/Appointment.js';
import { getPatientInfo, getDocInfo } from './dbController.js'; // Ajustez le chemin relatif selon votre structure de répertoire


async function getAppointments(key, profileId) {
    const appointments = await Appointment.find({ [key]: profileId }).sort('date');
    let correct_appointments = []

    for (let i = 0; i < appointments.length; i++) {
        let appointment = { }; // Initiate dict

        const date = new Date(appointments[i].date);
        const docinfo = await getDocInfo('_id', appointments[i].doctor);
        const patientinfo = await getPatientInfo('_id', appointments[i].patient);
        // console.log("Date :", date, " - Maintenant :", Date());
        let dateToCompare = new Date(date);
        let currentDate = new Date(); 
        let timeline = (dateToCompare < currentDate) ? 'past' : 'future';

        appointment['date'] = date.toISOString().split('T')[0];
        appointment['doctor'] = docinfo.name;
        appointment['patient'] = patientinfo.name;
        appointment['about'] = appointments[i].about;
        appointment['timeline'] = timeline;

        correct_appointments.push(appointment);
    }
    return correct_appointments;
  };

 async function create(req, res) {

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
            about: req.body.about
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
    create,
    getAppointments
};

export default appmtCtrl;