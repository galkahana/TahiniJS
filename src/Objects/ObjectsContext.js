const  {stringToCodes} = require('./stringUtils')
const {PrimitiveWriter, SPACE} = require('./PrimitiveWriter')
const IndirectObjectsReferenceRegistry = require('./IndirectObjectsReferenceRegistry')
const DictionaryContext = require('./DictionaryContext')

const PERCENT = stringToCodes('%')
const REFERENCE_KEYWORD = stringToCodes('R')

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

    endDictionary(dict) {
        if(this.dictionaries.length > 0) {
            if(this.dictionaries[this.dictionaries.length-1] === dict) {
                this.dictionaries.pop().writeDictEnd()
            }
            else
                throw new Error('Nesting violation. Trying to close a dictionary while one of it\'s children is still open. First End the children')
            
        }
        else
            throw new Error('Stack underflow. Trying to end a dictionary when there\'s no open dictionaries')
        return this
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

    writeInteger(value, seperator) {
        this.primitiveWriter.writeInteger(value, seperator)
        return this
    }

    writeIndirectObjectReference(objectId, generationNumber = 0, seperator = SPACE) {
        this.primitiveWriter
            .writeInteger(objectId)
            .writeInteger(generationNumber)
        this.outputStream.write(REFERENCE_KEYWORD)
        this.outputStream.write(seperator)
        return this
    }

    writeLiteralString(codes, seperator) {
        this.primitiveWriter.writeLiteralString(codes,seperator)
        return this
    }

    writeKeyword(str) {
        this.primitiveWriter.writeKeyword(str)
        return this
    }
    
    writeHexString(codes, seperator) {
        this.primitiveWriter.writeHexString(codes,seperator)
        return this
    }

    writeNull(seperator) {
        this.primitiveWriter.writeNull(seperator)
        return this
    }

    writeRectangle(rectangle, seperator) {
        this.primitiveWriter.startArray()
        rectangle.asArray.forEach((item)=> this.primitiveWriter.writeDouble(item))
        this.primitiveWriter.endArray(seperator)
        return this
    }

    writeDouble(value, seperator) {
        this.primitiveWriter.writeDouble(value, seperator)
        return this
    }

    writeBoolean(value, seperator) {
        this.primitiveWriter.writeBoolean(value,seperator)
        return this
    }
}

module.exports = ObjectsContext