import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;


const userSchema = Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'] },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  profileType: { type: String, required: true, enum: ['Patient', 'Doctor'] }
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);