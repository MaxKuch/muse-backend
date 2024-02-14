const express = require('express')
const cors = require('cors')
const http = require('http')
const createRoutes = require('./core/routes')
const cookieParser = require('cookie-parser')
const { ErrorMiddleware } =  require('./middlewares')

require('./core/db')

const HOST = process.env.NODE_ENV == 'production' ? process.env.HOST_PROD : process.env.HOST_DEV
const PORT = process.env.NODE_ENV == 'production' ? '' : ':'+process.env.PORT

const app = express()

const corsConfig = {
    origin: process.env.ORIGIN,
    credentials: true
}

app.use(
    express.json(), 
    express.urlencoded({ extended: true }), 
    cookieParser(), 
    cors(corsConfig), 
    express.static(__dirname + '/static/build', {setHeaders: (res) => { res.set('**Accept-Encoding', 'gzip, compress, br') }})
)

createRoutes(app)

app.use(ErrorMiddleware)

const server = http.createServer(app)

server.listen(process.env.PORT, () => {
    console.log(`Server started on ${HOST}${PORT}`)
})