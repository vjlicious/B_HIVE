const crypto = require('crypto')
const Swarm = require('discovery-swarm')
const defaults = require('dat-swarm-defaults')
const getPort = require('get-port')

const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS'
};
const peers = {}
let connSeq = 0
const myId = crypto.randomBytes(32)
console.log('Your identity: ' + myId.toString('hex'))

const config = defaults({
  id: myId,
})

const sw = Swarm(config);

class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  async listen() {
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
      // console.log(conn,"conn element");


      // for (let id in peers) {
      //   peers[id].conn.write(JSON.stringify({
      //     type: MESSAGE_TYPES.chain,
      //     chain: this.blockchain.chain
      //   }));
      // }
      conn.on('data', data => {
        console.log(
          'Received Message from peer ' + peerId,
          '----> ' + data.toString()
        )
      })

      conn.on('close', () => {
        console.log(`Connection ${seq} closed, peer id: ${peerId}`)
        if (peers[peerId].seq === seq) {
          delete peers[peerId]
        }
      })
    });
  }

  broadcastTransaction(transaction) {
    for (let id in peers) {
      peers[id].conn.write(JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction: transaction
      }));
    }
  }
  sendChain(peer) {
    peer.conn.write(JSON.stringify(this.blockchain.chain));
  }
  syncChains() {
    for (let id in peers) {
      peers[id].conn.write(this.sendChain(peer[id]))
    }
  }
  broadcastClearTransactions() {
    for (let id in peers) {
      peers[id].conn.write(JSON.stringify({
        type: MESSAGE_TYPES.clear_transactions
      }));
    }
  }


  messageHandler() {
    for (let id in peers) {
      peer[id].conn.on('message', message => {
        const data = JSON.parse(message);
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
        }
      });

    }
  }
}

module.exports = P2pServer;
