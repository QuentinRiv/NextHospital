// models/Prescription.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PrescriptionSchema = new Schema({
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  medicationDetails: { type: String, required: true },
  dateIssued: { type: Date, default: Date.now }
});

// Exporter le modèle
module.exports = mongoose.model('Prescription', PrescriptionSchema);
