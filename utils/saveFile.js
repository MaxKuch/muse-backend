const path = require('path')
const fs = require('fs')
const uuid = require('uuid')

const saveFile = (file, savePath) => {
    const filename = uuid.v4() + '.' + file.originalname.split('.').pop()
    try {
        fs.writeFileSync(path.resolve(__dirname, savePath, filename), file.buffer)
        return filename
    } catch (error) {
        throw(error)
    }
}

module.exports = saveFile