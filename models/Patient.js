const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const PatientSchema = new Schema({
  patientname: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Vous pouvez ajouter d'autres champs selon vos besoins
});

PatientSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Patient', PatientSchema);
