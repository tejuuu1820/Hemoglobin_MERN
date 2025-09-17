const express = require('express');
const asyncHandler = require('express-async-handler');
const { createResponse, createError } = require('../../utils/helpers');
const { resStatusCode, resMsg } = require('../../config/constants');
const authCtrl = require('../controllers/auth.controller');

const router = express.Router()

module.exports = router;


router.post('/sign-up', signUp)

router.post('/login', login)

/**
 * @route POST api/v1/auth/forget-password
 * @description forget password
 * @returns JSON
 * @access public
 */

router.post('/forget-password', asyncHandler(forgetPassword));

/**
 * @route POST api/v1/auth/reset-password
 * @description reset password
 * @returns JSON
 * @access public
 */

router.post('/reset-password', asyncHandler(resetPassword));

async function signUp(req, res, next) {
    try {
        const response = await authCtrl.signUp(req);
        if (response) return createResponse(res, resStatusCode.CREATED, resMsg.CREATED, response);
        return createError(res, resStatusCode.UNABLE_CREATE, { message: resMsg.UNABLE_CREATE })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

async function login(req, res, next) {
    try {
        const response = await authCtrl.login(req);
        if (response) return createResponse(res, resStatusCode.LOGIN, resMsg.LOGIN, response);
        return createError(res, resStatusCode.UNABLE_CREATE, { message: resMsg.UNABLE_CREATE })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

async function forgetPassword(req, res, next) {
    try {
        let response = await authCtrl.forgetPassword(req);
        if (response) return createResponse(res, resStatusCode.SUCCESS, resMsg.SUCCESS, response);
        else
            return createError(res, resStatusCode.BAD_REQUEST, { message: resMsg.BAD_REQUEST })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

async function resetPassword(req, res, next) {
    try {
        let response = await authCtrl.resetPassword(req);
        if (response) return createResponse(res, resStatusCode.SUCCESS, resMsg.SUCCESS, response);
        else
            return createError(res, resStatusCode.BAD_REQUEST, { message: resMsg.BAD_REQUEST })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}