import Appointment from '../models/Appointment.js';
import { getPatientInfo, getDocInfo } from './dbController.js'; // Ajustez le chemin relatif selon votre structure de répertoire


async function getAppointments(key, profileId) {
    const appointments = await Appointment.find({ [key]: profileId }).sort('date'); // Selecte tous les RDV d'un patient, trié par date
    let correct_appointments = []

    for (let i = 0; i < appointments.length; i++) {
        let appointment = { }; // Initiate dict

        const date = new Date(appointments[i].date);
        const docinfo = await getDocInfo('_id', appointments[i].doctor);
        const patientinfo = await getPatientInfo('_id', appointments[i].patient);
        
        // Pour voir si c'est un RDV déjà passé
        let dateToCompare = new Date(date);
        let currentDate = new Date(); 
        let timeline = (dateToCompare < currentDate) ? 'past' : 'future';

        // Met toutes les infos utiles dans un dico à renvoyer
        appointment['date'] = date.toISOString().split('T')[0];
        appointment['doctor'] = docinfo.name;
        appointment['patient'] = patientinfo.name;
        appointment['about'] = appointments[i].about;
        appointment['timeline'] = timeline;

        correct_appointments.push(appointment); // Rajoute dans un array le RDV en question
    }
    return correct_appointments;
  };

// Création d'un nouveau document Appointment dans la DB
 async function create(req, res) {

      try {
        // Récupération de l'ID des patient et docteurs en lien avec le RDV
        const doctor = await getDocInfo('name', req.body.doctorName);
        const patient = await getPatientInfo('name', req.body.patientName);
        if ((!doctor) || (!patient)) {
          res.status(404).json({ error: "Aucune donnée trouvée pour la clé et la valeur spécifiées" });
        }

        // Création du RDV
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

        res.status(201).json({ message: 'SUCCESS : Rendez-vous créés !' });
      } catch (error) {
          res.status(400).send("Erreur interne du serveur : ", error);
      }

  };

const appmtCtrl = {
  create,
  getAppointments
};

export default appmtCtrl;