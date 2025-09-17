const Joi = require("joi");
const { handleControllerError } = require("../../utils/helpers");
const User = require("../models/user.model");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const config = require("../../config/config");
const uuid = require('uuid');
const sendMail = require("../../config/mail");


const signUpValidationSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    confirm_password: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .label("Confirm password")
})

const loginValidationSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})

const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required()
})

const resetPasswordSchema = Joi.object({
    token: Joi.string().required().label("token"),
    password: Joi.string().required(),
    confirm_password: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .label("Confirm password")
});

const authCtrl = {
    signUp,
    login,
    forgetPassword,
    resetPassword
}

module.exports = authCtrl

async function signUp(req) {
    try {
        const { error } = signUpValidationSchema.validate(req.body)
        if (error) {
            throw Error(error.details[0].message)
        }
        const { username, email, password, role } = req.body;
        const exisitngUser = await User.findOne({ email })

        if (exisitngUser) {
            throw Error("User already exists")
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt)


        const user = new User({
            username,
            email,
            password: hashedPassword,
            role
        })

        await user.save()

        return user
    } catch (e) {
        throw handleControllerError(e)
    }
}

async function login(req) {
    try {
        const { error } = loginValidationSchema.validate(req.body)
        if (error) {
            throw Error(error.details[0].message)
        }
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw Error("Invalid email or password")
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            config.JWT_SECRET,
            { expiresIn: '1d' }
        )

        return token
    } catch (e) {
        throw handleControllerError(e)
    }
}

async function forgetPassword(req) {
    try {
        let { error } = forgetPasswordSchema.validate(req.body);
        if (error) {
            throw Error(error.details[0].message)
        }

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw Error('Email dosent Exist')
        }

        const resetToken = uuid.v4();

        user.reset_password_token = resetToken;
        user.reset_password_token_expiration = Date.now() + 3600000 // token valid for 1 hour

        await user.save();

        const verificationLink = `http://localhost:3000/auth/reset-password/${resetToken}`;
        const mailOptions = {
            to: email,
            subject: 'Verify your email',
            html: `<p>Click on the following link to reset your password: ${verificationLink}</p>`,
        }
        await sendMail(mailOptions)
        return true
    } catch (e) {
        throw handleControllerError(e)
    }
}

async function resetPassword(req) {
    try {
        const { error } = resetPasswordSchema.validate(req.body);
        if (error) {
            throw Error(error.details[0].message)
        }

        const { token, password } = req.body;
        const user = await User.findOne({
            reset_password_token: token,
            reset_password_token_expiration: { $gt: Date.now() },
        })

        if (!user) {
            throw Error('Invalid or expired reset token')
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the users password and reset token
        user.password = hashedPassword;
        user.reset_password_token = undefined;
        user.reset_password_token_expiration = undefined;
        await user.save();

        return true
    } catch (e) {
        throw handleControllerError(e)
    }
}

