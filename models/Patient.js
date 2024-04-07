const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  patientname: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Vous pouvez ajouter d'autres champs selon vos besoins
});

module.exports = mongoose.model('Patient', PatientSchema);
