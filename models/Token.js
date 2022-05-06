const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema(
    {
        refreshToken:  {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }
    },
    {
        timestamps: true
    }
)

const TokenModel = mongoose.model('Token', TokenSchema)

module.exports = TokenModel

