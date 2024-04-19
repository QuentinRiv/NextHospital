const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AppointmentSchema = new Schema({
    date: { type: Date, required: true, unique: true },
    doctor: { 
      type: Schema.Types.ObjectId, 
      ref: 'Doctor', // Assurez-vous que 'Doctor' correspond au nom de votre modèle
      required: true 
    },
    patient: { 
      type: Schema.Types.ObjectId, 
      ref: 'Patient', // Assurez-vous que 'Patient' correspond au nom de votre modèle
      required: true 
    },
    category: { type: String, required: true},
    info: { type: String, required: false }
    // Vous pouvez ajouter d'autres champs selon vos besoins
  });
  
  module.exports = mongoose.model('Appointment', AppointmentSchema);
  