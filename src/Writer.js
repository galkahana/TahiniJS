const PDFWStreamForFile = require('./IO/PDFWStreamForFile')
const ObjectsContext = require('./Objects/ObjectsContext')
const TrailerInformation = require('./Objects/TrailerInformation')
const  {stringToCodes} = require('./Objects/stringUtils')
const ObjectReference = require('./Objects/ObjectReference')

const HEADER_BYTES = stringToCodes('%\xBD\xBE\xBC\r\n')

class Writer {
    constructor() {
        this.outputStream = null
        this.objectsContext = null
        this.trailerInformation = null
    }

    start(inFilename,inPDFVersion='1.4') {
        this.outputStream  = new PDFWStreamForFile(inFilename)
        this.objectsContext = new ObjectsContext(this.outputStream)
        this.trailerInformation = new TrailerInformation()

        this._writeHeader(inPDFVersion)
        return this
    }

    _writeHeader(inPDFVersion) {
        this.objectsContext.writeComment(`PDF-${inPDFVersion}`)

        const writeTo = this.objectsContext.startFreeContext()
        writeTo.write(HEADER_BYTES)
        this.objectsContext.endFreeContext()
    }

    _writeCatalogObject(pageTreeRoot) {
        const catalogId = this.objectsContext.startNewIndirectObject()
        this.trailerInformation.rootReference = new ObjectReference(catalogId)

        const catalogContext = this.objectsContext.startDictionary()

        catalogContext.writeKey('Type')
        catalogContext.writeNameValue('Catalog')

        if(pageTreeRoot) {
            catalogContext.writeKey('Pages')
            catalogContext.writeObjectReferenceValue(pageTreeRoot)
        }

        this.objectsContext.endDictionary(catalogContext)
        this.objectsContext.endIndirectObject()
    }

    _writeCatalogObjectOfNewPDF() {
        this._writeCatalogObject(null)
    }

    _writeInfoDictionary() {
        
    }    

    _finalizeNewPDF() {
        /*_writeUsedFontsDefinitions();
        _writePagesTree();
        */

        this._writeCatalogObjectOfNewPDF()
        this._writeInfoDictionary()


        /*
        xrefTablePosition = this.objectsContext.writeXrefTable()
        _writeTrailerDictionary();
        _writeXrefReference(xrefTablePosition);
        _writeFinalEOF();*/
    }

    end(cb) {
        this._finalizeNewPDF()
        this.outputStream.close(cb)
        return this
    }
}

module.exports = Writer