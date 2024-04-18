const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  patients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }], // Référence aux Patients
  image: { type: String, required: false }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
