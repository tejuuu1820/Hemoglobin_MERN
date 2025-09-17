const http = require('http')
const app = require('./app')
const config = require('./config/config')
const logger = require('./config/logger')
const server = http.createServer(app)

const PORT = config.PORT
if (!module.parent) {
    app.listen(PORT, () => {
        logger.info(`Worker ${process.pid} is running on port ${PORT}`)
    })
}

module.exports = app