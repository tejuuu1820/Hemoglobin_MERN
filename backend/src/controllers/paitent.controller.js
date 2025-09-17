const Joi = require('joi');
const { handleControllerError } = require('../../utils/helpers');
const Patient = require('../models/paitent.model');

// ✅ Validation Schema
const patientValidationSchema = Joi.object({
  name: Joi.required(),
  age: Joi.number().required(),
  gender: Joi.string().valid('M', 'F').required(),
  hemo: Joi.number().required(),
  //   category: Joi.required(),
});

// ✅ Auto classification logic
function classifyHemoglobin({ gender, hemo }) {
  if (gender === 'M') {
    if (hemo < 13.8) return 'Low';
    if (hemo > 17.2) return 'High';
    return 'Normal';
  } else {
    if (hemo < 12.1) return 'Low';
    if (hemo > 15.1) return 'High';
    return 'Normal';
  }
}

const patientCtrl = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};

module.exports = patientCtrl;

// ✅ Create new patient
async function createPatient(req) {
  try {
    const { error } = patientValidationSchema.validate(req.body);
    if (error) throw Error(error.details[0].message);

    const { age, gender, hemo, name } = req.body;

    const category = classifyHemoglobin({ gender, hemo });

    const patient = new Patient({ age, gender, hemo, category, name });
    await patient.save();

    return patient;
  } catch (e) {
    throw handleControllerError(e);
  }
}

// ✅ Fetch all patients
async function getPatients() {
  try {
    const paitents = await Patient.find();

    if (paitents.length == 0) {
      throw Error('No Data');
    }
    return await Patient.find();
  } catch (e) {
    throw handleControllerError(e);
  }
}

// ✅ Fetch single patient
async function getPatientById(req) {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) throw Error('Patient not found');
    return patient;
  } catch (e) {
    throw handleControllerError(e);
  }
}

// ✅ Update patient
async function updatePatient(req) {
  try {
    const { id } = req.params;
    const { error } = patientValidationSchema.validate(req.body);
    if (error) throw Error(error.details[0].message);

    const { age, gender, hemo } = req.body;
    const category = classifyHemoglobin({ gender, hemo });

    const patient = await Patient.findByIdAndUpdate(
      id,
      { age, gender, hemo, category },
      { new: true }
    );

    if (!patient) throw Error('Patient not found');

    return patient;
  } catch (e) {
    throw handleControllerError(e);
  }
}

// ✅ Delete patient
async function deletePatient(req) {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) throw Error('Patient not found');
    return true;
  } catch (e) {
    throw handleControllerError(e);
  }
}
