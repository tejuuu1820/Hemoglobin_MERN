const passport = require('passport')
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const config = require('./config');
const User = require('../src/models/user.model');


const localLogin = new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    let user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
        return done(null, false, { error: 'Your login details could not be verified. Please try again.' })
    }

    user = user.toObject();
    delete user.hashedPassword;
    done(null, user)
})

const jwtLogin = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() || ExtractJwt.fromHeader('authorization') || ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
    if (payload.role === 'admin') {
        let user = await User.findById(payload.id);
        if (!user) {
            return done(null, false);
        }
        user = user.toJSON();
        delete user.hashedPassword;
        return done(null, user);
    }

    let user = await User.findById(payload.id);
    if (!user) {
        return done(null, false)
    }
    user = user.toJSON();
    delete user.hashedPassword;
    done(null, user);
})

passport.use(jwtLogin);
passport.use(localLogin)

module.exports = passport