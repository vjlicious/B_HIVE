//node module calls
const express = require('express');
// const session = require('express-session')
const bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')
const url = require('url')
//p2p server declaration
const P2pServer = require('./p2p-server.js');
//module calls
const Blockchain = require('../blockchain');
const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet');
const Miner = require('./miner');
//router calls
let indexRouter = require('../routes/index');
let loginRouter = require('../routes/login');
let registerRouter = require('../routes/register');
let dashBoardRouter = require('../routes/dashboard');
let uploadRouter = require('../routes/upload');
//function declarations
const bc = new Blockchain();
const tp = new TransactionPool();
const wallet = new Wallet();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);
//port declaratiom
const HTTP_PORT = process.env.HTTP_PORT || 3001;
//express app call
const app = express();
// view engine setup
app.set('view engine', 'ejs');
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))
// app.use(session({secret: "bhive", resave: true,
// saveUninitialized: true, cookie: { maxAge: 60 * 60 * 1000 }}));
//router declarations
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/dashboard', dashBoardRouter);
app.use('/upload', uploadRouter);
//blockchain
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

app.listen(HTTP_PORT, () => console.log(`B_HIVE on port ${HTTP_PORT}`));
// p2pServer.listen();
