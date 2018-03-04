const  {stringToUTF8} = require('./utf8')

const NEW_LINE = stringToUTF8('\r\n')

class PrimitiveWriter {
    constructor(outputStream) {
        this.outputStream = outputStream
    }

    endLine() {
        this.outputStream.write(NEW_LINE)
    }
}

module.exports = PrimitiveWriter