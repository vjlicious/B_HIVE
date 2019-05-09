const ChainUtil = require('../chain-util');
const {
    MINING_REWARD
} = require('../config');

class Trans {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }
    static newTransaction(senderWallet, recipient, amount, filename, filesize, filecreatetime, filedestroytime) {
        const transaction = new this();
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }
        transaction.outputs.push(...[{
                amount: senderWallet.balance - amount,
                address: senderWallet.publicKey
            },
            {
                amount,
                address: recipient
            },
            {
                filename,
                filecreatetime,
                filedestroytime,
                filesize
            }
        ]);
        return transaction;
    }
}

module.exports = Trans;
