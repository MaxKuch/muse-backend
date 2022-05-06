const mongoose = require('mongoose')

const AlbumSchema = new mongoose.Schema(
    {
        name: String,
        thumbnail: String,
        description: String,
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artist'
        }
    },
    {
        timestamps: true
    }
)

const AlbumModel = mongoose.model('Album', AlbumSchema)

module.exports = AlbumModel

