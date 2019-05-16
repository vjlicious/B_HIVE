var express = require('express');

var router = express.Router();
const fs = require('fs')
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


router.get('/', (req, res) => {
  res.json(bc.chain);
});



module.exports = router;
