const { handleControllerError } = require('../../utils/helpers');
const User = require('../models/user.model');

const userCtrl = {
  getUseryId,
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

module.exports = userCtrl;
