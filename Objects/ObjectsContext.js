const  {stringToUTF8} = require('./utf8')
const PrimitiveWriter = require('./PrimitiveWriter')

const PERCENT = stringToUTF8('%')

class ObjectsContext {
    constructor(outputStream) {
        this.outputStream = outputStream
        this.primitiveWriter = new PrimitiveWriter(this.outputStream)
    }

    endLine() {
        this.primitiveWriter.endLine()
    }

    writeComment(comment) {
        this.outputStream.write(PERCENT)
        this.outputStream.write(stringToUTF8(comment))
        this.endLine();
    }

    startFreeContext() {
        return this.outputStream
    }

    endFreeContext() {}
}

module.exports = ObjectsContext