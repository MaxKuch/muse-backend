const { ArtistModel } = require('../models')
const path = require('path')
const fs = require('fs')
const uuid = require('uuid')

class ArtistsController {
    async getArtists(req, res) {
        const offset = req.query.offset
        const query = req.query.query
        const regExp = new RegExp(query || '', 'i')
        try {
            const artists = await ArtistModel.find({ name: regExp }).sort([['updatedAt', 'descending']]).skip(offset ?? 0).limit(offset ? 2 : Infinity).exec()
            ArtistModel.count((err, count) => {
                if(err) {
                    res.status(500).json(err)
                    return
                }
                res.json({artists, artistsAmount: count})
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async getArtist(req, res) {
        try {
            const artist = await ArtistModel.findById(req.params.id).exec()
            res.json(artist)
        } catch (error) {
            res.status(404).json(error)
        }
    }

    async addArtist(req, res) {
        const {name, description} = req.body
        const filename = uuid.v4() + '.' + req.file.originalname.split('.').pop()
        try {
            fs.writeFileSync(path.resolve(__dirname, '../static/pictures', filename), req.file.buffer)
            
        } catch (error) {
            res.status(500).json({ error })
        }
        try {
            const artistModel = new ArtistModel({
                name,
                description,
                thumbnail: `${process.env.HOST}:${process.env.PORT}/pictures/${filename}`
            })
            const artist = await artistModel.save()
            res.json(artist)
        } catch (error) {
            res.status(500).json({ error })
        }
    }
}

module.exports = ArtistsController