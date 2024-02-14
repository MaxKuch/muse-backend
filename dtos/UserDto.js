module.exports = class UserDto {
    email
    id
    username

    constructor(model) {
        this.email = model.email
        this.id = model._id
        this.username = model.username
        this.favoriteSongs = model.favoriteSongs ? model.favoriteSongs : []
    }
}