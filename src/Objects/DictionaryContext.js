const {stringToCodes} = require('./stringUtils')
const {NEW_LINE} = require('./PrimitiveWriter')
const ObjectReference = require('./ObjectReference')

const TAB = stringToCodes('\t')
const OPEN_DICT = '<<'
const CLOSE_DICT = '>>'

class DictionaryContext {
    constructor(objectsContext, indentLevel) {
        this.objectsContext = objectsContext
        this.indentLevel = indentLevel
        this.keys = {}
    }

    writeDictStart() {
        this.objectsContext.writeKeyword(OPEN_DICT)
    }

    writeDictEnd() {
        if(this.indentLevel > 0) {
            --this.indentLevel
            this._writeIndents()
        }
        this.objectsContext.writeKeyword(CLOSE_DICT)
    }

    _writeIndents() {
        const writeStream = this.objectsContext.startFreeContext()
        for(let i=0;i<this.indentLevel;++i)
            writeStream.write(TAB)
        this.objectsContext.endFreeContext()
    }

    writeKey(key) {
        if(this.keys[key])
            throw new Error(`Duplicate key error. Cannot write multiple keys in the same dictionary. key reused - ${key}`)
        this._writeIndents()
        this.objectsContext.writeName(key)
        this.keys[key] = true
        return this
    }

    hasKey(key) {
        return this.keys[key]
    }

    writeIntegerValue(number) {
        this.objectsContext.writeInteger(number, NEW_LINE)
        return this
    }

    writeObjectReferenceValue(objectReferenceOrId, generationNumber) {
        if(objectReferenceOrId instanceof ObjectReference) {
            return this.writeObjectReferenceValue(objectReferenceOrId.objectId, objectReferenceOrId.generationNumber)
        }

        this.objectsContext.writeIndirectObjectReference(objectReferenceOrId, generationNumber, NEW_LINE) 
        return this
    }

    writeNewObjectReferenceValue(objectId) {
        return this.writeObjectReferenceValue(objectId, 0)
    }

    writeLiteralStringValue(codes) {
        return this.objectsContext.writeLiteralString(codes,NEW_LINE)
    }

    writeKeywordValue(str) {
        return this.objectsContext.writeKeyword(str)
    }

    writeHexStringValue(codes) {
        this.objectsContext.writeHexString(codes,NEW_LINE)
        return this
    }

    writeNullValue() {
        this.objectsContext.writeNull(NEW_LINE)
        return this
    }

    writeNameValue(str) {
        this.objectsContext.writeName(str,NEW_LINE)
        return this
    }

    writeRectangleValue(rectangle) {
        this.objectsContext.writeRectangle(rectangle,NEW_LINE)
        return this        
    }

    writeDoubleValue(value){
        this.objectsContext.writeDouble(value, NEW_LINE)
        return this
    }

    writeBooleanValue(value) {
        this.objectsContext.writeBoolean(value, NEW_LINE)
        return this
    }
}

module.exports = DictionaryContext