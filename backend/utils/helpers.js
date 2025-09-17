

/**
 * 
 * @param {Object} res 
 * @param {Number} status 
 * @param {String} error 
 * @param {Object|Array} payload
 * @param {Object} other 
 */

exports.createResponse = (
    res,
    status,
    msg,
    payload,
    other = undefined
) => {
    return res.status(status).json({
        status,
        message: msg,
        data: payload,
        ...other
    })
}

exports.createError = (res, status, error, options = undefined) => {
    if (!options) options = {};
    if (!options.other) options.other = {};
    const message = (error && error.message) || (isString(error) && error) || options.message || 'Error Occurred';

    const stackTrace = error || message;

    console.error("ERROR:", message, stackTrace);

    res.locals.errorStr = message;

    const other = {
        ...options.other,
        ...(options.returnStackTrace ? { error: error.message } : {})
    }

    return exports.createResponse(
        res,
        status,
        message,
        other,
    )
}

/**
* @param {Object} error
*/
exports.handleControllerError = (error) => {
    if (error.details && error.details.length > 0) {
        for (const err of error.details) {
            err.message = err.message.replace(/\"/g, "");
            return err;
        }
    } else
        return error;
};

exports.generateString = (length = 4) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let string = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        string += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return string;
}

exports.isValidObjectId = (string) => {
    const mongoose = require('mongoose')
    if (mongoose.isValidObjectId(string)) {
        return true
    }
}