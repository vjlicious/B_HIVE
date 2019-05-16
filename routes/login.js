var express = require('express');

var router = express.Router();
const fs = require('fs')
const P2pServer = require('../app/p2p-server');
const Blockchain = require('../blockchain');
const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet');

const bc = new Blockchain();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const wallet = new Wallet();

var flag = 0;

router.get('/', (req, res) => {
    res.render('login');
});
router.post('/dashboard', (req, res) => {
    var email = req.body.email;
    var firstpass = req.body.firstpass;
    fs.readFile('myjsonfile.json', handlefile)
    function handlefile(err, data) {
        if (err) throw err
        obj = JSON.parse(data) // console.log(obj.logintable[0].publicKey)
        for (let id in obj) {
            let value = obj[id];
            for (let id in value) {
                if (value[id].email == email && value[id].password == firstpass) {
                    console.log("matched");
                    let pub = value[id].publicKey;
                    let em = value[id].email;
                    let rl = value[id].role;
                    var uid = value[id].id;
                    let amount = wallet.balance;
                    console.log(value)
                    res.render('dashboard', {
                        id: uid,
                        email: em,
                        public: pub,
                        role: rl,
                        amount: amount,
                        value: value
                    })
                    flag = 1;
                }
            }
        }
        if (flag == 0) {
            console.log('auth wrong')
            res.redirect('/login')
        }
    }
});


module.exports = router;
