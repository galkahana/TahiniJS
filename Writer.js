const PDFWStreamForFile = require('./IO/PDFWStreamForFile')
const ObjectsContext = require('./Objects/ObjectsContext')
const  {stringToUTF8} = require('./Objects/utf8')

const HEADER_BYTES = stringToUTF8('%').concat([0xBD,0xBE,0xBC],stringToUTF8('\r\n'))

class Writer {
    constructor() {
        this.outputStream = null
        this.objectsContext = null
    }

    start(inFilename,inPDFVersion="1.4") {
        this.outputStream  = new PDFWStreamForFile(inFilename)
        this.objectsContext = new ObjectsContext(this.outputStream)

        this._writeHeader(inPDFVersion)
        return this
    }

    _writeHeader(inPDFVersion) {
        this.objectsContext.writeComment(`PDF-${inPDFVersion}`)

        const writeTo = this.objectsContext.startFreeContext()
        writeTo.write(HEADER_BYTES)
        this.objectsContext.endFreeContext()
    }

    _finalizeNewPDF() {
        /*_writeUsedFontsDefinitions();
        _writePagesTree();
        _writeCatalogObjectOfNewPDF();
        _writeInfoDictionary();
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