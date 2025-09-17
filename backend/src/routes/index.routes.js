const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const passport = require('passport');
const paitents = require('./paitent.routes');
const router = express.Router();

router.use('/auth', authRoutes);

router.use(
  '/user',
  passport.authenticate('jwt', { session: false }),
  userRoutes
);

router.use('/patients', paitents);

module.exports = router;
