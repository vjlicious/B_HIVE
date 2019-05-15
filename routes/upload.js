var express = require('express');
var router = express.Router();
var multer = require('multer')

const P2pServer = require('../app/p2p-server');
const Blockchain = require('../blockchain');
const TransactionPool = require('../wallet/transaction-pool');

const bc = new Blockchain();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);

var upload = multer({
    dest: 'uploads/'
})

router.get('/', (req, res) => {
    res.render('upload');
});

router.post('/post', upload.single('f'), function (req, res) {
    var f = req.file;
    p2pServer.sendFile(f);
    res.redirect('/dasboard')
});

module.exports = router;
