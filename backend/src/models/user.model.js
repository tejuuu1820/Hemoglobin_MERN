const mongoose = require('mongoose');

const customSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    reset_password_token: {
      type: String,
      required: false,
    },
    reset_password_token_expiration: {
      type: Number,
      required: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', customSchema);
module.exports = User;
