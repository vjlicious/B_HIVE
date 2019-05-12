//node module calls
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')

//module calls
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server.js');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');
//router calls
var indexRouter = require('../routes/index');
//function declarations
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);
//port declaratiom
const HTTP_PORT = process.env.HTTP_PORT || 3001;
//express app call
const app = express();
// view engine setup

app.set('view engine', 'ejs');
app.use(cors())
app.use(logger('dev'));

app.use(bodyParser.json());
//router declarations
app.use('/', indexRouter);

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
  //console.log(res);
});

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);
  p2pServer.syncChains();
  res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
  const {
    recipient,
    amount
  } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);
  p2pServer.broadcastTransaction(transaction);
  res.redirect('/transactions');

});

app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block}`);
  res.redirect('/blocks');
});

app.get('/public-key', (req, res) => {
  res.json({
    publicKey: wallet.publicKey
  });
});

app.listen(HTTP_PORT, () => console.log(`Listening on HTTP port ${HTTP_PORT}`));
p2pServer.listen();
