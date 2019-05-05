const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require('../config');




class Honey {
    constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publickey =  this.keyPair.getPublic().encode('hex')
    }
    toString() {
        return `Honey - 
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance}`
    }
}
const hon = new Honey();
console.log(hon)



