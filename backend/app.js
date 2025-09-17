const express = require('express')
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('./config/mongoose')
const routes = require('./src/routes/index.routes');
const logger = require('./config/logger');
const passport = require('./config/passport')


const app = express()
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} - Params: ${JSON.stringify(req.params)}`)
    next();
})

// CORS middleware
app.use(cors());

app.use(helmet())

app.use(express.json())
app.use(morgan('dev'))

app.use(passport.initialize());


app.use('/api', routes)


module.exports = app