const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');
const path = require('path');

exports.create = async (req, res) => {
    const doctorId = await getDoctorIdByName(req.body.doctorName);
    const patientId = await getPatientIdByName(req.body.patientName);

    if (!doctorId || !patientId) {
        console.log('Doctor or patient not found, cannot proceed with further actions.');
        return res.status(404).json({ message: 'Doctor or patient not found' });
    }

    try {
        const newAppointment = new Appointment({
            date: req.body.date,
            doctor: doctorId,
            patient: patientId,
            category: req.body.category,
            info: req.body.info
        });
        await newAppointment.save();
        res.status(201).json({ message: 'Consultation créée !' });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la consultation' });
    }
};

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

exports.random = async (req, res) => {
    try {
        const doctorName = await getRandomDoctorName();
        const patientName = await getRandomPatientName();
        const categories = ['Checkup', 'Conseil', 'Urgence'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const info = "Nothing interesting here";
        let today = new Date();
        const date = today.toISOString().split('T')[0];

        await exports.create({
            body: {
                date,
                doctorName,
                patientName,
                category,
                info
            }
        }, res);
    } catch (err) {
        console.error('Error generating random appointment:', err);
        res.status(500).json({ message: 'Erreur lors de la création d\'une consultation aléatoire' });
    }
};

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
