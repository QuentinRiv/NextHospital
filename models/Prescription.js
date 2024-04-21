import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PrescriptionSchema = new Schema({
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  medicationDetails: { type: String, required: true },
  dateIssued: { type: Date, default: Date.now }
});

// Exporter le modèle
export default mongoose.model('Prescription', PrescriptionSchema);
