const {InfoDictionary} = require('./InfoDictionary')

class TrailerInformation {
    constructor() {
        this.prev = null
        this.rootReference = null
        this.infoDictionary = new InfoDictionary()
        this.infoDictionaryReference = null
    }

}

module.exports = TrailerInformation