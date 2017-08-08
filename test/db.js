var spec = require('../spec')

var levelup = require('levelup')
var memdown = require('memdown')
var samizdat = require('samizdat-db')

spec.test('level', {
    tape: require('tape'),
    db: samizdat(levelup(memdown))
})
