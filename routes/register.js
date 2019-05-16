var express = require('express');
var router = express.Router();
const fs = require('fs')

const P2pServer = require('../app/p2p-server');
const Blockchain = require('../blockchain');
const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet');
const ChainUtil = require('../chain-util');

const bc = new Blockchain();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const wallet = new Wallet();

router.get('/', (req, res) => {
    res.render('register');
});
var obj = {
    logintable: []
}

router.post('/post', (req, res) => {
    var email = req.body.email;
    var firstpass = req.body.firstpass;
    var secondpass = req.body.secondpass;
    var role = req.body.dropdown;
    var id = ChainUtil.id();
    console.log(id, email, firstpass, secondpass,role, wallet.publicKey);
    fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            obj.logintable.push({
                id: `${id}`,
                email: `${email}`,
                password: `${firstpass}`,
                role: `${role}`,
                publicKey: `${wallet.publicKey}`
            });
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('myjsonfile.json', json, 'utf8', (err) => {
                if (err) throw err;
            });
            p2pServer.sendRegister(json); // write it back 
        }
    });
    res.redirect('/login')
});




module.exports = router;
