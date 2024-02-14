const mongoose = require('mongoose')

const SongSchema = new mongoose.Schema(
    {
        name: String,
        src: String,
        thumbnail: String,
        listens:  Number,
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artist'
        },
        album: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Album'
        },
    },
    {
        timestamps: true
    }
)

const Song = mongoose.model('Song', SongSchema)

module.exports = Song