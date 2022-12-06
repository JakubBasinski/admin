const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'active',
    },
    isAdmins: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastLogin: {
      type: Date,
      reguired: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
