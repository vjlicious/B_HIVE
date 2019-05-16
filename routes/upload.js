var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs = require('fs');

const P2pServer = require('../app/p2p-server');
const Blockchain = require('../blockchain');
const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet');
const Miner = require('../app/miner');

const bc = new Blockchain();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const wallet = new Wallet();
const miner = new Miner(bc, tp, wallet, p2pServer);

var upload = multer({
    dest: 'uploads/'
})

router.get('/', (req, res) => {
    res.render('upload');
});

router.post('/post', upload.single('f'), function (req, res) {
    var f = req.file.filename;
    fs.readFile('./uploads/' + f, "base64", function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            p2pServer.sendFile(data);
            console.log('file has been sent')
        }
    });
    res.redirect('/')
});

module.exports = router;
