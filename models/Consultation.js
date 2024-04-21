import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ConsultationSchema = new Schema({
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
    category: { type: String, required: true},
    info: { type: String, required: false }
    // Vous pouvez ajouter d'autres champs selon vos besoins
  });
  
  export default mongoose.model('Consultation', ConsultationSchema);
  