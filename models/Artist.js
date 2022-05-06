const mongoose = require('mongoose')

const ArtistSchema = new mongoose.Schema(
    {
        thumbnail: String,
        name: String,
        description: String
    },
    {
        timestamps: true
    }
)

const ArtistModel = mongoose.model('Artist', ArtistSchema)

module.exports = ArtistModel