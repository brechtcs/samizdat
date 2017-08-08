var spec = require('samizdat-spec')
var rm = require('rimraf')

rm.sync('/tmp/samizdat-fs')

spec.basic('filesystem', {
    tape: require('tape'),
    db: require('../fs')('/tmp/samizdat-fs')
})
