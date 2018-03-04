const _ = require('lodash')

const stringToUTF8 = (str)  => _.map(unescape(encodeURIComponent(str)),(a)=>a.charCodeAt(0))

module.exports = {
    stringToUTF8
}