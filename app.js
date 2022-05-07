const express = require('express')
const cors = require('cors')
const http = require('http')
const createRoutes = require('./core/routes')
const cookieParser = require('cookie-parser')
const { ErrorMiddleware } =  require('./middlewares')

require('./core/db')

const HOST = process.env.HOST_PROD
const PORT = ''

const app = express()

const corsConfig = {
    origin: process.env.ORIGIN,
    credentials: true
}

app.use(express.json(), express.urlencoded({ extended: true }), cookieParser(), cors(corsConfig), express.static(__dirname + '/static/'))

createRoutes(app)

app.use(ErrorMiddleware)

const server = http.createServer(app)

server.listen(process.env.PORT, () => {
    console.log(`Server started on ${HOST}${PORT}`)
})