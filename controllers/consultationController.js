import Consultation from '../models/Consultation.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';


// Création d'un consultation
export async function create(req, res) {

    // Obtentin des ID des docteur et patient
    const doctorId = await getDoctorIdByName(req.body.doctorName);
    const patientId = await getPatientIdByName(req.body.patientName);

    if (!doctorId || !patientId) {
        console.log('Doctor or patient not found, cannot proceed with further actions.');
        return res.status(404).json({ message: 'Doctor or patient not found' });
    }

    // Création d'une nouvelle consultation
    try {
        const newConsultation = new Consultation({
            date: req.body.date,
            doctor: doctorId,
            patient: patientId,
            category: req.body.category,
            info: req.body.info
        });
        await newConsultation.save();
        res.status(201).json({ message: 'Consultation créée !' });
    } catch (error) {
        console.error('Error creating Consultation:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la consultation' });
    }
}

// Obtient l'ID d'un docteur en sachant le nom
async function getDoctorIdByName(doctorName) {
    try {
        const doctor = await Doctor.findOne({ doctorName });
        if (!doctor) {
            console.log('No doctor found with the name:', doctorName);
            return null;
        }
        return doctor._id;
    } catch (error) {
        console.error('Error fetching doctor:', error);
        return null;
    }
}

// Obtient l'ID d'un patient en sachant le nom
async function getPatientIdByName(patientName) {
    try {
        const patient = await Patient.findOne({ patientName });
        if (!patient) {
            console.log('No patient found with the name:', patientName);
            return null;
        }
        return patient._id;
    } catch (error) {
        console.error('Error fetching patient:', error);
        return null;
    }
}

// Création aléatoire d'un RDV
export async function random(req, res) {
    try {
        const doctorName = await getRandomDoctorName();
        const patientName = await getRandomPatientName();
        const categories = ['Checkup', 'Conseil', 'Urgence'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const info = "Nothing interesting here";
        let today = new Date();
        const date = today.toISOString().split('T')[0];

        await create({
            body: {
                date,
                doctorName,
                patientName,
                category,
                info
            }
        }, res);
    } catch (err) {
        console.error('Error generating random consultation:', err);
        res.status(500).json({ message: 'Erreur lors de la création d\'une consultation aléatoire' });
    }
}

// Obtient le nom d'un docteur au hasard
async function getRandomDoctorName() {
    try {
        const doctors = await Doctor.find({});
        const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
        return randomDoctor.doctorName;
    } catch (error) {
        console.error('Failed to retrieve doctors:', error);
        return null;
    }
}

// Obtient le nom d'un patient au hasard
async function getRandomPatientName() {
    try {
        const patients = await Patient.find({});
        const randomPatient = patients[Math.floor(Math.random() * patients.length)];
        return randomPatient.patientName;
    } catch (error) {
        console.error('Failed to retrieve patients:', error);
        return null;
    }
}
