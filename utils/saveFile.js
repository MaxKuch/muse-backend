const path = require('path')
const fs = require('fs')
const uuid = require('uuid')

const saveFile = (file, savePath) => {
    try {
        const filename = uuid.v4() + '.' + file.originalname.split('.').pop()
        savePath = path.resolve(__dirname, savePath)
        if (!fs.existsSync(savePath)) {
            fs.mkdirSync(savePath, { recursive: true });
        }
        fs.writeFileSync(path.resolve(savePath, filename), file.buffer)
        return filename
    } catch (error) {
        throw(error)
    }
}

module.exports = saveFile