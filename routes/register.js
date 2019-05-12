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
    res.render('register');
});
var obj = {
    table: []
}

router.post('/post', (req, res) => {
    var email = req.body.email;
    var firstpass = req.body.firstpass;
    var secondpass = req.body.secondpass;
    console.log(email, firstpass, secondpass);
        fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data); //now it an object
                obj.table.push({
                    email: `${email}`,
                    password: `${firstpass}`
                });
                json = JSON.stringify(obj); //convert it back to json
                fs.writeFile('myjsonfile.json', json, 'utf8'); // write it back 
            }
        });
    
    p2pServer.sendRegister(json);
    
    res.redirect('/login')
});



module.exports = router;
