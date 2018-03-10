const  {stringToCodes} = require('./stringUtils')
const PrimitiveWriter = require('./PrimitiveWriter')
const IndirectObjectsReferenceRegistry = require('./IndirectObjectsReferenceRegistry')

const PERCENT = stringToCodes('%')

class ObjectsContext {
    constructor(outputStream) {
        this.outputStream = outputStream
        this.primitiveWriter = new PrimitiveWriter(this.outputStream)
        this.referencesRegistry = new IndirectObjectsReferenceRegistry()
    }

    startFreeContext() {
        return this.outputStream
    }

    endFreeContext() {}

    startNewIndirectObject(inObjectId) {
        const newObjectId = inObjectId === undefined ? this.referencesRegistry.allocateNewObjectId(): inObjectId
        this.referencesRegistry.markObjectAsWritten(newObjectId, this.outputStream.getCurrentPosition())
        this.primitiveWriter
            .writeInteger(newObjectId)
            .writeInteger(0)
            .writeKeyword('obj')
        return newObjectId
    }


    endLine() {
        this.primitiveWriter.endLine()
        return this
    }

    writeComment(comment) {
        this.outputStream.write(PERCENT)
        this.outputStream.write(stringToCodes(comment))
        this.endLine()
        return this
    }
    
}

module.exports = ObjectsContext