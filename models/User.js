const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  username: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  }
});

UserSchema.plugin(timestamp);
const User = mongoose.model('User', UserSchema);
module.exports = User;
