const  {stringToCodes} = require('./stringUtils')

const NEW_LINE = stringToCodes('\r\n')

class PrimitiveWriter {
    constructor(outputStream) {
        this.outputStream = outputStream
    }

    endLine() {
        this.outputStream.write(NEW_LINE)
        return this
    }

    writeInteger(num, seperator=' ') {
        this.outputStream.write(stringToCodes(`${num}${seperator}`))
        return this
    }

    writeKeyword(keyword) {
        this.outputStream.write(stringToCodes(keyword))
        return this.endLine()
    }
}

module.exports = PrimitiveWriter