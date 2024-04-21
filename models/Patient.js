import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import uniqueValidator from 'mongoose-unique-validator';

const PatientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  assignedDoctor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Doctor', // Assurez-vous que 'Doctor' correspond au nom de votre modèle
    required: true 
  },
  image: { type: String, required: false }
  // Vous pouvez ajouter d'autres champs selon vos besoins
});

PatientSchema.plugin(uniqueValidator);

export default mongoose.model('Patient', PatientSchema);
