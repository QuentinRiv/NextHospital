const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
  email: { type: String, required: true, unique: true },
  doctorName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  patients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }], // Référence aux Patients
  // Vous pouvez ajouter d'autres champs selon vos besoins
});

module.exports = mongoose.model('Doctor', DoctorSchema);
