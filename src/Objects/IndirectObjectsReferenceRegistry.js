

const FREE = 0
const USED = 1

class IndirectObjectsReferenceRegistry {


    constructor() {
        this.registry = [
            {
                referenceType: FREE,
                written: false,
                dirty: false,
                generationNumber: 65535,
                writePosition: 0,
            }
        ]
    }

    allocateNewObjectId() {
        const newObjectId = this.registry.length

        this.registry.push(
            {
                referenceType: USED,
                written: false,
                dirty: true,
                generationNumber: 0,
                writePosition: null
            }            
        ) 
 
        return newObjectId
    }

    markObjectAsWritten(objectId, writePosition) {
        if(this.registry.length <= objectId)
            throw new Error(`IndirectObjectsReferenceRegistry::MarkObjectAsWritten, Out of range failure. An Object ID is marked as written, which was not allocated before. ID = ${objectId}`)

        if(this.registry[objectId].written)
            throw new Error(`IndirectObjectsReferenceRegistry::MarkObjectAsWritten, Object rewrite failure. The object ${objectId} was already marked as written at ${this.regsitry[objectId].writePosition}. New position is ${writePosition}`)
        
        if(writePosition > 9999999999)
            throw new Error(`IndirectObjectsReferenceRegistry::MarkObjectAsWritten, Write position out of bounds. Trying to write an object at position that cannot be represented in Xref = ${writePosition}. probably means file got too long`)
            
        this.registry[objectId] = {
            ...this.registry[objectId],
            dirty: true,
            writePosition,
            written: true
        }
    }

}

module.exports = IndirectObjectsReferenceRegistry