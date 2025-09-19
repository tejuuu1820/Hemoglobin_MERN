const express = require('express');
const asyncHandler = require('express-async-handler');
const { createResponse, createError } = require('../../utils/helpers');
const { resStatusCode, resMsg } = require('../../config/constants');
const patientCtrl = require('../controllers/paitent.controller');

const router = express.Router();

module.exports = router;

/**
 * @route POST /api/v1/patients
 * @desc Add a new patient
 */
router.post('/', asyncHandler(createPatient));

/**
 * @route GET /api/v1/patients
 * @desc Get all patients
 */
router.get('/', asyncHandler(getPatients));

/**
 * @route GET /api/v1/patients/me/:userId
 * @desc Get patients by userId
 */
router.get('/me/:userId', asyncHandler(getPatientsByUserId));

/**
 * @route GET /api/v1/patients/:id
 * @desc Get patient by ID
 */
router.get('/:id', asyncHandler(getPatientById));

/**
 * @route PUT /api/v1/patients/:id
 * @desc Update patient
 */
router.put('/:id', asyncHandler(updatePatient));

/**
 * @route DELETE /api/v1/patients/:id
 * @desc Delete patient
 */
router.delete('/:id', asyncHandler(deletePatient));

// -------------------- Controllers with helpers --------------------

async function createPatient(req, res) {
  try {
    const response = await patientCtrl.createPatient(req);
    if (response) {
      return createResponse(
        res,
        resStatusCode.CREATED,
        resMsg.CREATED,
        response
      );
    }
    return createError(res, resStatusCode.UNABLE_CREATE, {
      message: resMsg.UNABLE_CREATE,
    });
  } catch (e) {
    return createError(res, resStatusCode.BAD_REQUEST, e);
  }
}

async function getPatients(req, res) {
  try {
    const response = await patientCtrl.getPatients();
    return createResponse(res, resStatusCode.SUCCESS, resMsg.SUCCESS, response);
  } catch (e) {
    return createError(res, resStatusCode.BAD_REQUEST, e);
  }
}

async function getPatientsByUserId(req, res) {
  try {
    const response = await patientCtrl.getPatientByUserId(req);
    return createResponse(res, resStatusCode.SUCCESS, resMsg.SUCCESS, response);
  } catch (e) {
    return createError(res, resStatusCode.BAD_REQUEST, e);
  }
}

async function getPatientById(req, res) {
  try {
    const response = await patientCtrl.getPatientById(req);
    return createResponse(res, resStatusCode.SUCCESS, resMsg.SUCCESS, response);
  } catch (e) {
    return createError(res, resStatusCode.BAD_REQUEST, e);
  }
}

async function updatePatient(req, res) {
  try {
    const response = await patientCtrl.updatePatient(req);
    return createResponse(res, resStatusCode.SUCCESS, resMsg.UPDATED, response);
  } catch (e) {
    return createError(res, resStatusCode.BAD_REQUEST, e);
  }
}

async function deletePatient(req, res) {
  try {
    const response = await patientCtrl.deletePatient(req);
    return createResponse(res, resStatusCode.SUCCESS, resMsg.DELETED, response);
  } catch (e) {
    return createError(res, resStatusCode.BAD_REQUEST, e);
  }
}
