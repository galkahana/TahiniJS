const Writer = require('./Writer')

const createWriter = (inFilename) => {
    return new Writer().start(inFilename)
}

module.exports = {
    createWriter
}