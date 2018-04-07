const _ = require('lodash')

const  {stringToCodes} = require('./stringUtils')

const NEW_LINE = stringToCodes('\r\n')
const SPACE = stringToCodes(' ')
const SLASH = stringToCodes('/')
const BACKSLASH = stringToCodes('\\')
const SPECIAL_CHARS = stringToCodes('()<>[]{}/%#')
const LEFT_PARANTHESIS = stringToCodes('(')
const RIGHT_PARANTHESIS = stringToCodes(')')
const TRUE = stringToCodes('true')
const FALSE = stringToCodes('false')
const OPEN_BRACKET = stringToCodes('[')
const CLOSE_BRACKET = stringToCodes(']')
const LEFT_ANGLE_BRACKET = stringToCodes('<')
const RIGHT_ANGLE_BRACKET = stringToCodes('>')
const NULL = stringToCodes('null')

class PrimitiveWriter {

    constructor(outputStream) {
        this.outputStream = outputStream
    }

    endLine() {
        this.outputStream.write(NEW_LINE)
        return this
    }

    writeInteger(num, seperator=SPACE) {
        this.outputStream.write(stringToCodes(`${num}`).concat(seperator))
        return this
    }

    writeKeyword(keyword) {
        this.outputStream.write(stringToCodes(keyword))
        this.endLine()
        return this
    }

    writeName(name, seperator=SPACE) {
    /*
        from the pdf reference:
        This syntax is required to represent any of the delimiter or white-space characters or the number sign character itself; 
        it is recommended but not required for characters whose codes are outside the range 33 (!) to 126 (~).
    */        
        this.outputStream.write(SLASH)
        const codes = stringToCodes(name)
        for(const code in codes) {
            if(code < 33 || code > 126 || _.includes(SPECIAL_CHARS,code)) {
                this.outputStream.write(stringToCodes(`#${(code % 256).toString(16)}`))
            }
            else {
                this.outputStream.write([code])
            }
        }

        this.outputStream.write(seperator)
        return this
    }

    writeUnsafeLiteralString(codes, seperator=SPACE) {
        this.outputStream.write(LEFT_PARANTHESIS)
        this.outputStream.write(codes)
        this.outputStream.write(RIGHT_PARANTHESIS)
        this.outputStream.write(seperator)
        return this
    }

    writeLiteralString(codes, seperator=SPACE) {
        this.outputStream.write(LEFT_PARANTHESIS)
        for(const code in codes) {
            if(code === LEFT_PARANTHESIS || code === RIGHT_PARANTHESIS || code === BACKSLASH) {
                this.outputStream.write(BACKSLASH)
                this.outputStream.write([code])
            }
            else if(code < 32 || code > 126) {
                this.outputStream.write(stringToCodes(`\\${(code % 256).toString(8)}o`))
            }
            else
                this.outputStream.write([code])
        }
        this.outputStream.write(RIGHT_PARANTHESIS)
        this.outputStream.write(seperator)
        return this
    }

    writeDouble(num, seperator=SPACE) {
        // Same as int...when in JS
        this.outputStream.write(stringToCodes(`${num}`).concat(seperator))
        return this
    }

    writeBoolean(value, seperator=SPACE) {
        this.outputStream.write(value ? TRUE:FALSE)
        this.outputStream.write(seperator)
        return this
    }

    writeNull(seperator=SPACE) {
        this.outputStream.write(NULL)
        this.outputStream.write(seperator)
        return this
    }

    startArray() {
        this.outputStream.write(OPEN_BRACKET)
        return this
    }

    endArray(seperator=SPACE) {
        this.outputStream.write(CLOSE_BRACKET)
        this.outputStream.write(seperator)
        return this
    }

    writeHexString(codes, seperator=SPACE) {
        this.outputStream.write(LEFT_ANGLE_BRACKET)
        for(const code in codes) {
            this.outputStream.write(stringToCodes(`${(code % 256).toString(16)}`))
        }
        this.outputStream.write(RIGHT_ANGLE_BRACKET)
        this.outputStream.write(seperator)
        return this
    }

    writeEncodedString(codes, seperator=SPACE) {
        this.outputStream.write(LEFT_ANGLE_BRACKET)
        this.outputStream.write(codes)
        this.outputStream.write(RIGHT_ANGLE_BRACKET)
        this.outputStream.write(seperator)
        return this
    }

}

module.exports = {
    PrimitiveWriter,
    NEW_LINE,
    SPACE
}