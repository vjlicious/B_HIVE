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
// const miner = new Miner(bc, tp, wallet, p2pServer);

var upload = multer({
    dest: 'uploads/'
})
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

router.get('/', (req, res) => {
    fs.readFile('myjsonfile.json', handlefile)
    function handlefile(err, data) {
        if (err) throw err
        obj = JSON.parse(data) // console.log(obj.logintable[0].publicKey)
        for (let id in obj) {
            let value = obj[id];
            for (let id in value) {
                    let pub = value[id].publicKey;
                    let em = value[id].email;
                    let rl = value[id].role;
                    var uid = value[id].id;
                    let amount = wallet.balance;
                    let space = value[id].amount;
                    let rpb = value[id].rpb;
                    console.log(value)
                    res.render('upload', {
                        id: uid,
                        email: em,
                        role: rl,
                        public: pub,
                        amount: amount,
                        value: value,
                        space: space,
                        rpb: rpb
                    })
            }
        }
    }
});



module.exports = router;
