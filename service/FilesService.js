const { Octokit } = require("octokit")
const uuid = require('uuid')
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN })

class FilesService {
    static async saveFile(file, savePath) {
        try {
            const content = file.buffer.toString('base64')

            const filename = uuid.v4() + '.' + file.originalname.split('.').pop()
            const path = savePath + '/' + filename
            const { data: {content: { download_url }} } = await  octokit.rest.repos.createOrUpdateFileContents({
                owner: 'maxkuch',
                repo: 'storage',
                path,
                message: 'new file',
                content
            })

            return download_url
        } catch (error) {
            throw error
        }
    }
}

module.exports = FilesService