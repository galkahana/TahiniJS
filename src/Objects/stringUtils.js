const _ = require('lodash')

const stringToUTF8 = (str)  => _.map(unescape(encodeURIComponent(str)),(a)=>a.charCodeAt(0))
const stringToCodes = (str) => _.map(str, (a)=> a.charCodeAt(0))

module.exports = {
    stringToUTF8,
    stringToCodes
}