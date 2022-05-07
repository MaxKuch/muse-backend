const path = require('path')
const fs = require('fs')
const uuid = require('uuid')

const saveFile = (file, savePath) => {
    const filename = uuid.v4() + '.' + file.originalname.split('.').pop()
    const savePath = path.resolve(__dirname, savePath)
    if (!path.existsSync(savePath)) {
        fs.mkdirSync(savePath, 0744);
    }
    try {
        fs.writeFileSync(path.resolve(savePath, filename), file.buffer)
        return filename
    } catch (error) {
        throw(error)
    }
}

module.exports = saveFile