class PDFRectangle {
    constructor(
        otherOrLowerLeftX, lowerLeftY, upperRightX, upperRightY) {
        if(otherOrLowerLeftX instanceof PDFRectangle) {
            [this.lowerLeftX,
                this.lowerLeftY,
                this.upperRightX,
                this.upperRightY] = otherOrLowerLeftX.asArray()
        }
        else {
            this.lowerLeftX = otherOrLowerLeftX
            this.lowerLeftY = lowerLeftY
            this.upperRightX = upperRightX
            this.upperRightY = upperRightY
        }
        
    }

    asArray() {
        return [this.lowerLeftX,
            this.lowerLeftY,
            this.upperRightX,
            this.upperRightY]
    }

    eq(other) {
        return (
            this.lowerLeftX == other.lowerLeftX &&
            this.lowerLeftY == other.lowerLeftY &&
            this.upperRightX == other.upperRightX &&
            this.upperRightY == other.upperRightY
        )
    }

    neq(other) {
        return !this.eq(other)
    }
}

module.exports = PDFRectangle