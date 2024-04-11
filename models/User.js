const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
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

module.exports = mongoose.model('User', userSchema);