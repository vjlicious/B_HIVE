const crypto = require('crypto')
const Swarm = require('discovery-swarm')
const defaults = require('dat-swarm-defaults')
const getPort = require('get-port')




const myId = crypto.randomBytes(32)

const config = defaults({
    id: myId,    // peer-id
})


(async () => {
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
        
 
        conn.on('close', () => {
            console.log(`Connection ${seq} closed, peer id: ${peerId}`)
            if (peers[peerId].seq === seq) {
                delete peers[peerId]
            }
        })
        if (!peers[peerId]) {
            peers[peerId] = {}
        }
        peers[peerId].conn = conn
        peers[peerId].seq = seq
        connSeq++
    })