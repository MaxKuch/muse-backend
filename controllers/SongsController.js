const { SongModel } = require('../models')
const { FilesService } = require('../service')

class SongsController {
    async getSongs(req, res) {
        const offset = req.query.offset
        const sortByListens = req.query.sortByListens === 'true'
        const sortByDate = req.query.sortByDate  === 'true'
        const query = req.query.query
        const regExp = new RegExp(query, 'i')
        
        const sortObj = {}
        if(sortByListens) sortObj.listens = -1
        if(sortByDate) sortObj.createdAt = -1
        try {
            const songs = Array.from(await SongModel
                .find({name: regExp})
                .sort(sortObj)
                .populate(['artist', 'album'])
                .exec())
                .splice(offset || 0, offset !== undefined ? 5 : Infinity)
            SongModel.count((err, count) => {
                if(err) {
                    res.status(500).json(err)
                    return
                }
                res.json({songs, songsAmount: count})
            })
        } catch (error) {
            res.status(500).json(error)
        } 
    }

    async getArtistsSongs(req, res) {
        const limit = req.query.limit ? req.query.limit : Infinity
        const sortByListens = req.query.sortByListens ? req.query.sortByListens : false

        const sortObj = {}
        if(sortByListens) sortObj.listens = -1

        try {
            const songs = await SongModel
                .find({ artist: req.params.id })
                .sort(sortObj)
                .limit(limit)
                .populate(['artist', 'album'])
                .exec()
            res.json(songs)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async getAlbumsSongs(req, res) {
        try {
            const songs = await SongModel.find({ album: req.params.id }).populate(['artist', 'album']).exec()
            res.json(songs)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async addSong(req, res) {
        const { name, artist, album } = req.body
        try {
            
            const audioUrl = await FilesService.saveFile(req.files['audio'][0], 'songs')

            const songObj = {
                name,
                artist,
                album,
                src: audioUrl
            }

            if(req.files['thumbnail']) {
                const thumbnailUrl = await FilesService.saveFile(req.files['thumbnail'][0], 'pictures')
                songObj.thumbnail = thumbnailUrl
            }

            const songModel = new SongModel(songObj)
            const song = await songModel.save()
            res.json({ song })
        } catch (error) {
            res.status(500).json({ error })
        }
    }

    async incrementListens(req, res) {
        const songId = req.body.songId
        try {
            await SongModel.findByIdAndUpdate(songId, { $inc: { listens: 1 } })
            res.end()
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = SongsController