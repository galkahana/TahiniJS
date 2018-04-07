const TRAPPED_TRUE = 1
const TRAPPED_FALSE = 2
const TRAPPED_UNKNOWN = 3


class InfoDictionary {
    constructor() {
        // strings
        this.title = null
        this.author = null
        this.subject = null
        this.keywords = null
        this.creator = null
        this.producer = null

        // dates
        this.creationDate = null
        this.modDate = null

        // int, per enum consts
        this.trapped = null

        this.additionalEntries = {}
    }

    isEmpty() {
        return !this.title &&
                !this.author &&
                !this.subject &&
                !this.keywords && 
                !this.creator && 
                !this.producer &&
                !this.creationDate &&
                !this.modDate &&
                (!this.trapped || this.trapped === TRAPPED_UNKNOWN) &&
                Object.keys(this.additionalEntries).length === 0

    }
}

module.exports = {
    InfoDictionary,
    TRAPPED_TRUE,
    TRAPPED_FALSE,
    TRAPPED_UNKNOWN
}