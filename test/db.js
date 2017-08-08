var spec = require('../spec')

var levelup = require('levelup')
var memdown = require('memdown')
var samizdat = require('samizdat-db')

spec.basic('level', {
    tape: require('tape'),
    db: samizdat(levelup(memdown))
})

spec.stream('level', {
    tape: require('tape'),
    db: samizdat(levelup(memdown))
})
