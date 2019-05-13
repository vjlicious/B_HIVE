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



module.exports = router;
