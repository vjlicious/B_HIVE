const crypto = require('crypto')
const Swarm = require('discovery-swarm')
const defaults = require('dat-swarm-defaults')
const getPort = require('get-port')

const peers = {}

let connSeq = 0

const myId = crypto.randomBytes(32)

const config = defaults({
    id: myId, 
})

const sw = Swarm(config);






