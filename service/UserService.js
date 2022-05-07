const genUsername = require("unique-username-generator")
const bcrypt = require('bcrypt')
const { UserModel } = require('../models')
const { UserDto } = require('../dtos')
const { ApiError } = require('../exceptions')
const tokenService = require('./TokenService')

class UserService {
    async registration(email, password, username) {
        const candidate = await UserModel.findOne({email})
        if(candidate) {
            throw ApiError.BadRequest(`Пользователь с адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        if(!username) username = genUsername.generateUsername()
        const user = await UserModel.create({email, password: hashPassword, username})

        const userDto = new UserDto(user)
        const tokens = await tokenService.generateTokens({email: userDto.email, id: userDto.id})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async login(email, password) {
        try {
            const user = await UserModel.findOne({ email }).populate({path: 'favoriteSongs', populate: ['album', 'artist']})
            if(!user) {
                throw ApiError.BadRequest(`Пользователь с адресом ${email} не зарегистрирован`)
            }
            const isPassEquals = await bcrypt.compare(password, user.password)
            if(!isPassEquals) {
                throw ApiError.BadRequest(`Неверный пароль`)
            }
            const userDto = new UserDto(user)
            const tokens = await tokenService.generateTokens({email: userDto.email, id: userDto.id})
            await tokenService.saveToken(userDto.id, tokens.refreshToken)
    
            return {...tokens, user: userDto}
        } catch (error) {
            throw error
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if(!refreshToken)  throw ApiError.UnauthorizedError()
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        console.log(userData, tokenFromDB)
        if(!userData || !tokenFromDB) throw ApiError.UnauthorizedError()

        const user = await UserModel.findById(userData.id).populate({path: 'favoriteSongs', populate: ['album', 'artist']})
        const userDto = new UserDto(user)
        const tokens = await tokenService.generateTokens({email: userDto.email, id: userDto.id})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }
    
    async getUser(id) {
        try {
            const user = await UserModel.findById(id).populate({path: 'favoriteSongs', populate: ['album', 'artist']}).exec()
            const userDto = new UserDto(user)
            return userDto
        } catch (error) {
            throw error
        }
    }

    async addSongToFavorites(userId, songId) {
        try {
            await UserModel.findByIdAndUpdate(userId, { $push: { favoriteSongs: songId } })
        } catch (error) {
            throw (error)
        }
    }

    async removeSongFromFavorites(userId, songId) {
        try {
            await UserModel.findByIdAndUpdate(userId, { $pull: { favoriteSongs: songId } })
        } catch (error) {
            throw (error)
        }
    }
}

module.exports = new UserService()