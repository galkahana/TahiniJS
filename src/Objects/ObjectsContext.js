const  {stringToCodes} = require('./stringUtils')
const {PrimitiveWriter} = require('./PrimitiveWriter')
const IndirectObjectsReferenceRegistry = require('./IndirectObjectsReferenceRegistry')
const DictionaryContext = require('./DictionaryContext')

const PERCENT = stringToCodes('%')

class ObjectsContext {
    constructor(outputStream) {
        this.outputStream = outputStream
        this.primitiveWriter = new PrimitiveWriter(this.outputStream)
        this.referencesRegistry = new IndirectObjectsReferenceRegistry()
        this.dictionaries = []
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

    endIndirectObject() {
        this.primitiveWriter.writeKeyword('endobj')
    }

    startDictionary() {
        const newDictionary = new DictionaryContext(this,this.dictionaries.length)
        this.dictionaries.push(newDictionary)

        newDictionary.writeDictStart()    
        return newDictionary
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

    writeName(name, seperator) {
        this.primitiveWriter.writeName(name, seperator)
        return this
    }
    
}

module.exports = ObjectsContext