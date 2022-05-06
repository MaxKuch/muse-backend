const { ApiError } = require('../exceptions')
const TokenService = require('../service/TokenService')

module.exports = async function (req, _, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader) throw ApiError.UnauthorizedError()

        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken) throw ApiError.UnauthorizedError()

        const userData = TokenService.validateAccessToken(accessToken)
        if(!userData) throw ApiError.UnauthorizedError()

        req.user = userData
        next()
    } catch (error) {
        next(error)
    }
}