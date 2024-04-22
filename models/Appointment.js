import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const AppointmentSchema = new Schema({
    date: { type: Date, required: true, unique: false },
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
    about: { type: String, required: true}
  });
  
  export default mongoose.model('Appointment', AppointmentSchema);
  