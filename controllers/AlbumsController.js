const mongoose = require('mongoose')
const { AlbumModel } = require('../models')
const { FilesService } = require('../service')

class AlbumsController {
    async getAlbum(req, res) {
        try {
            const album = await AlbumModel.findById(req.params.id).populate('artist').exec()
            res.json(album)
        } catch (error) {
            res.status(404).json(error)
        } 
    }

    async getAlbums(req, res) {
        const offset = req.query.offset
        const query = req.query.query
        const regExp = new RegExp(query, 'i')
        try {
            const albums = await AlbumModel.find({name: regExp}).sort([['updatedAt', 'descending']]).skip(offset || 0).limit(offset ? 2 : Infinity).populate('artist').exec()
            AlbumModel.count((err, count) => {
                if(err) {
                    res.status(500).json(err)
                    return
                }
                res.json({albums, albumsAmount: count})
            })
        } catch (error) {
            res.status(500).json(error)
        } 
    }

    async getArtistsAlbums(req, res) {
        const query = req.query.query
        const regExp = new RegExp(query || '', 'i')
        try {
            const albums = await AlbumModel.find({ artist: req.params.id, name: regExp }).populate('artist').exec()
            res.json(albums)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async addAlbum(req, res) {
        const { name, description, artist } = req.body
        try {
            const albumThumbUrl = await FilesService.saveFile(req.file, 'pictures')

            const albumModel = new AlbumModel({
                artist: new mongoose.Types.ObjectId(artist),
                name,
                description,
                thumbnail: albumThumbUrl
            })
            const album = await albumModel.save()
            res.json(album)
        } catch (error) {
            res.status(500).json({ error })
        }
    }
}

module.exports = AlbumsController