var express = require('express');
var router = express.Router();
const fs = require('fs')

const P2pServer = require('../app/p2p-server');
const Blockchain = require('../blockchain');
const TransactionPool = require('../wallet/transaction-pool');

const bc = new Blockchain();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);

router.get('/', (req, res) => {
    res.render('login');
});
router.post('/post', (req, res) => {
    var email = req.body.email;
    var firstpass = req.body.firstpass;
    fs.readFile('myjsonfile.json', handlefile)
    function handlefile(err, data) {
        if (err) throw err
        obj = JSON.parse(data)        // console.log(obj.logintable[0].publicKey)
        for (let id in obj) {
            let value = obj[id];
            for (let id in value) {
                if (value[id].email == email && value[id].password == firstpass) {
                    console.log("matched");
                    console.log(value[id].publicKey);
                    res.redirect('/dashboard')
                }
                else break;
            }
        }
        res.redirect('/login')
    }
});



module.exports = router;
