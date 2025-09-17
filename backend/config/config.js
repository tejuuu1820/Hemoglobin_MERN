require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    LOG_LEVEL: process.env.LOG_LEVEL,
    JWT_SECRET: process.env.JWT_SECRET,
    mail: {
        SMTP_MAIL_USER: process.env.SMTP_MAIL_USER,
        SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,
        SMTP_MAIL_SERVICE: process.env.SMTP_MAIL_SERVICE,
    }
}