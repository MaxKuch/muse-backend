const { TokenModel } = require('../models')
const jwt = require('jsonwebtoken')

class TokenService {
    async generateTokens(payload) {

        try {
            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '60m'})
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '60d'})
            return { accessToken, refreshToken }
        } catch (error) {
            throw error
        }
    }

    async saveToken(userId, refreshToken) {
        try {
            const tokenData = await TokenModel.findOne({ user: userId })
    
            if(tokenData) {
                tokenData.refreshToken = refreshToken
                return tokenData.save()
            }
    
            const token = await TokenModel.create({user: userId, refreshToken})
            return token
        } catch (error) {
            throw error
        }
    }

    async removeToken(refreshToken) {
        const tokenData = await TokenModel.deleteOne({ refreshToken })
        return tokenData
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (error) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (error) {
            return null
        }
    }

    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({ refreshToken })
        return tokenData
    }
}

module.exports = new TokenService()