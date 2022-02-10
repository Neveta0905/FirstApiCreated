const mongoose = require('mongoose');
const unique_validator = require('mongoose-unique-validator')

const UserSchema = mongoose.Schema({
  email: { type: String, required: true,unique:true },
  password: { type: String, required: true },
});

UserSchema.plugin(unique_validator)
module.exports = mongoose.model('User', UserSchema);