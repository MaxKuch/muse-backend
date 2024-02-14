const { userService } = require('../service')
const UserService = require('../service/UserService')

class UserController {
    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 60 * 24 * 60 * 60, httpOnly: true})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.json(token)
        } catch (error) {
            next(error)
        }
    }

    async registration(req, res, next) {
        try {
            const {email, password, username} = req.body
            const userData = await userService.registration(email, password, username)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async getUser(req, res, next) {
        const { id } = req.user
        try {
            const user = await UserService.getUser(id)
            res.json(user)
        } catch (error) {
            next(error)
        }
    }

    async addSongToFavorites(req, res, next) {
        const { id } = req.user
        const songId = req.body.songId
        try {
            await userService.addSongToFavorites(id, songId)
            res.end()
        } catch (error) {
            next(error)
        }

    }

    async removeSongFromFavorites(req, res, next) {
        const { id } = req.user
        const songId = req.body.songId
        try {
            await userService.removeSongFromFavorites(id, songId)
            res.end()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController