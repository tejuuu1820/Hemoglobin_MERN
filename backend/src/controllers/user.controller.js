const { handleControllerError } = require('../../utils/helpers');
const User = require('../models/user.model');

const userCtrl = {
  getUseryId,
  deleteUserEmail
};

async function getUseryId(req) {
  try {
    const { userId } = req.params;
    const patient = await User.findById(userId);
    if (!patient) throw Error('user not found');
    return patient;
  } catch (e) {
    throw handleControllerError(e);
  }
}

async function deleteUserEmail(req) {
  try {
    const { email } = req.params;
    const patient = await User.findOneAndDelete({email});
    if (!patient) throw Error('user not found');
    return patient;
  } catch (e) {
    throw handleControllerError(e);
  }
}

module.exports = userCtrl;
