const { ApiError } = require('../exceptions')
const { tokenService } = require('../service')

module.exports = async function (req, _, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader) throw ApiError.UnauthorizedError()

        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken) throw ApiError.UnauthorizedError()

        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData) throw ApiError.UnauthorizedError()

        req.user = userData
        next()
    } catch (error) {
        next(error)
    }
}