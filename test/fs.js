var spec = require('../spec')
var rm = require('rimraf')

rm.sync('/tmp/samizdat-fs')

spec.test('filesystem', {
    tape: require('tape'),
    db: require('../fs')('/tmp/samizdat-fs')
})
