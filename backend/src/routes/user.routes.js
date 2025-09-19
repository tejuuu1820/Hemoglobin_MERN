const express = require('express');
const userCtrl = require('../controllers/user.controller');
const asyncHandler = require('express-async-handler');
const { createResponse, createError } = require('../../utils/helpers');
const { resStatusCode, resMsg } = require('../../config/constants');
const router = express.Router();

/**
 * @route GET /api/v1/user/:id
 * @desc Get patient by ID
 */
router.get('/:userId', asyncHandler(getUserById));

async function getUserById(req, res) {
  try {
    const response = await userCtrl.getUseryId(req);
    return createResponse(res, resStatusCode.SUCCESS, resMsg.SUCCESS, response);
  } catch (e) {
    return createError(res, resStatusCode.BAD_REQUEST, e);
  }
}

module.exports = router;
