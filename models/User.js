const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        username:  {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        favoriteSongs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song' 
        }]
    },
    {
        timestamps: true
    }
)

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel

