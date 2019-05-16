
const crypto = require('crypto')
const Swarm = require('discovery-swarm')
const defaults = require('dat-swarm-defaults')
const getPort = require('get-port')
var fs = require('fs');
// var base64Img = require('base64-img');

const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS',
  sendregister: 'REGISTER_FILE',
  sendfile: 'SEND_FILE'
};
const peers = {};
let connSeq = 0;
const myId = crypto.randomBytes(32);
// console.log('Your identity: ' + myId.toString('hex'));
const config = defaults({
  id: myId,
});
const sw = Swarm(config);

class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  async listen() {
    // console.log(this.blockchain.chain);
    const port = await getPort()
    sw.listen(port)
    console.log('Listening to port: ' + port)
    sw.join('b_hive')
    sw.on('connection', (conn, info) => {
      const seq = connSeq
      const peerId = info.id.toString('hex')
      console.log(`Connected #${seq} to peer: ${peerId}`)
      if (info.initiator) {
        try {
          conn.setKeepAlive(true, 600)
        } catch (exception) {
          console.log('exception', exception)
        }
      }
      if (!peers[peerId]) {
        peers[peerId] = {}
      }
      peers[peerId].conn = conn
      peers[peerId].seq = seq
      connSeq++

      conn.on('data', datas => {
        if (datas.toString().substring(2, 6) == "type") {
          var data = JSON.parse(datas.toString());
          console.log("Incoming data", data);
          switch (data.type) {
            case MESSAGE_TYPES.chain:
              this.blockchain.replaceChain(data.chain);
              break;
            case MESSAGE_TYPES.transaction:
              this.transactionPool.updateOrAddTransaction(data.transaction);
              break;
            case MESSAGE_TYPES.clear_transactions:
              this.transactionPool.clear();
              break;
            case MESSAGE_TYPES.sendregister:
              fs.writeFile('myjsonfile.json', data.file, 'utf8', (err) => {
                if (err) throw err;
              });
            case MESSAGE_TYPES.sendfile:
              // var filename = data.file.filename;
              // var filetype = data.file.mimetype;
              break;
        }
      } else {
          // console.log(datas)
         
          var buffer = Buffer.from(datas);
          // var blob = new Blob( [ datas ], { type: "image/jpeg" } );
          // // var buffers = buffer.toString();
          // wstream.write(buffer);
          // console.log(datas.toString());
   
        let data_new = ""
        for(let i=0; i<buffer.length; i++)
        {
            data_new+=String.fromCharCode(buffer[i])
        }
       
      console.log(data_new);
       
    
    // var base64data=Buffer.from(datas.toString(),'base64').toString('base64');
    // console.log(base64data);
    var imgsrc = "data:image/png;base64,"+datas.toString();
    // base64Img.img('data:image/png;base64,'+datas.toString(), 'dest', '1', function(err, filepath) {});
    let base64Image = imgsrc.split(';base64,').pop();
    // console.log(d);
    fs.writeFile('image.png', base64Image, {encoding: 'base64'}, function(err) {
      console.log('File created');
  }); 
          // wstream.end();
        }
        })
      conn.on('close', () => {
        console.log(`Connection ${seq} closed, peer id: ${peerId}`)
        if (peers[peerId].seq === seq) {
          delete peers[peerId]
        }
      })
    });
  }

  sendFile(file) {
    for (let id in peers) {
      peers[id].conn.write(file)
    }
  }
    broadcastTransaction(transaction){
    for (let id in peers) {
      peers[id].conn.write(JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction: transaction
      }));
    }
  }
  sendChain(peer) {
    peer.conn.write(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain.chain
    }));
  }

  syncChains() {
    for (let id in peers) {
      this.sendChain(peers[id])
    }
  }

  broadcastClearTransactions() {
    for (let id in peers) {
      peers[id].conn.write(JSON.stringify({
        type: MESSAGE_TYPES.clear_transactions
      }));
    }
  }
  sendRegister(file) {
    for (let id in peers) {
      peers[id].conn.write(JSON.stringify({
        type: MESSAGE_TYPES.sendregister,
        file
      }))
    }
  }
}
module.exports = P2pServer;
