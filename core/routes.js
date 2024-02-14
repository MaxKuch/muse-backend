const multer  = require('multer')
const { SongsController, AlbumsController, ArtistsController, UserController } = require('../controllers')
const { AuthMiddleware } = require('../middlewares')
const path = require('path')

const upload = multer()

const createRoutes = (app) => {
    const songsController = new SongsController()
    const albumsController = new AlbumsController()
    const artistsController = new ArtistsController()
    const userController = new UserController()

    app.get('/songs', songsController.getSongs)
    app.get('/songs/artist/:id', songsController.getArtistsSongs)
    app.get('/songs/album/:id', songsController.getAlbumsSongs)
    app.post('/songs', upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), songsController.addSong)
    app.put('/increment-listens', songsController.incrementListens)

    app.get('/artists', artistsController.getArtists)
    app.get('/artists/:id', artistsController.getArtist)
    app.post('/artists', upload.single('thumbnail'), artistsController.addArtist)

    app.get('/albums/:id', albumsController.getAlbum)
    app.get('/albums', albumsController.getAlbums)
    app.get('/albums/artist/:id', albumsController.getArtistsAlbums)
    app.post('/albums', upload.single('thumbnail'), albumsController.addAlbum)

    app.post('/login', userController.login)
    app.post('/registration', userController.registration)
    app.post('/logout', userController.logout)
    app.get('/refresh', userController.refresh)
    app.put('/add-song-to-favorites', AuthMiddleware, userController.addSongToFavorites)
    app.put('/remove-song-from-favorites', AuthMiddleware, userController.removeSongFromFavorites)
    app.get('/user', AuthMiddleware, userController.getUser)
}

module.exports = createRoutes