var test = require('tape')
var spec = require('../spec')

var levelup = require('levelup')
var memdown = require('memdown')
var samizdat = require('samizdat-db')

spec.crud(test, {
    db: samizdat(levelup(memdown))
})
