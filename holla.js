const EC = require('elliptic').ec;
const ec = new EC('secp256k1')
let meow = ec.genKeyPair()

console.log(meow)
