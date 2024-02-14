const { ArtistModel } = require('../models')
const { FilesService } = require('../service')

const HOST = process.env.NODE_ENV == 'production' ? process.env.HOST_PROD : process.env.HOST_DEV
const PORT = process.env.NODE_ENV == 'production' ? '' : ':'+process.env.PORT

class ArtistsController {
    async getArtists(req, res, next) {
        const offset = req.query.offset
        const query = req.query.query
        const regExp = new RegExp(query || '', 'i')
        try {
            const artists = await ArtistModel.find({ name: regExp }).sort([['updatedAt', 'descending']]).skip(offset ? offset : 0).limit(offset ? 2 : Infinity).exec()
            ArtistModel.count((err, count) => {
                if(err) {
                    res.status(500).json(err)
                    return
                }
                res.json({artists, artistsAmount: count})
            })
        } catch (error) {
            next(error)
        }
    }

    async getArtist(req, res, next) {
        try {
            const artist = await ArtistModel.findById(req.params.id).exec()
            res.json(artist)
        } catch (error) {
            next(error)
        }
    }

    async addArtist(req, res, next) {
        const {name, description} = req.body
        try {
            const artistThumbUrl = await FilesService.saveFile(req.file, 'pictures')
            const artistModel = new ArtistModel({
                name,
                description,
                thumbnail: artistThumbUrl
            })
            const artist = await artistModel.save()
            res.json(artist)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ArtistsController