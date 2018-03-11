const  {stringToCodes} = require('./stringUtils')

const TAB = stringToCodes('\t')

class DictionaryContext {
    constructor(objectsContext, indentLevel) {
        this.objectsContext = objectsContext
        this.indentLevel = indentLevel
        this.keys = {}
    }

    writeDictStart() {
        this.objectsContext.writeKeyword('<<')         
    }

    writeIndents() {
        const writeStream = this.objectsContext.startFreeContext()
        for(let i=0;i<this.indentLevel;++i)
            writeStream.write(TAB)
        this.objectsContext.endFreeContext()
    }

    writeKey(key) {
        if(this.keys[key])
            throw new Error(`DictionaryContext::WriteKey, Duplicate key error. Cannot write multiple keys in the same dictionary. key reused - ${key}`)
        this._writeIndents()
        this.objectsContext.writeName(key)
        this.keys[key] = true
    }
}

module.exports = DictionaryContext