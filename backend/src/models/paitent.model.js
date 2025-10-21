const mongoose = require('mongoose');

const customSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required:true,
      unique: true,
    },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['M', 'F'], required: true },
    hemo: { type: Number, required: true },
    category: { type: String, enum: ['Low', 'Normal', 'High'], required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model('paitents', customSchema);
module.exports = Patient;
