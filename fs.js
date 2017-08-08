var assert = require('assert')
var fs = require('fs')
var mkdir = require('mkdirp')
var path = require('path')
var ts = require('samizdat-ts')

function Samizdat (dir) {
  if (!(this instanceof Samizdat)) {
    return new Samizdat(dir)
  }
  mkdir.sync(dir)

  this._root = dir
}

module.exports = Samizdat

/**
 * CRUD operations
 */
Samizdat.prototype.create = function (doc, value, cb) {
  assert.equal(typeof doc, 'string' || 'number', 'Document ID must be a string or number')
  assert.equal(typeof cb, 'function', 'Create callback must be a function')

  if (ts.validate(doc)) {
    return cb({invalidId: true})
  }

  var key = ts.newKey(doc)
  var dir = path.join(this._root, doc)
  var version = path.join(dir, key)

  if (fs.existsSync(dir)) {
    return cb({docExists: true})
  }

  mkdir(dir, function (err) {
    if (err) {
      return cb(err)
    }

    fs.writeFile(version, value, function (err) {
      if (err) {
        return cb(err)
      }
      cb(null, {
        key: key,
        value: value
      })
    })
  })
}

Samizdat.prototype.read = function (version, cb) {
  assert.equal(typeof cb, 'function', 'Read callback must be a function')

  var doc = ts.getId(version)
  var file = path.join(this._root, doc, version)

  fs.readFile(file, function (err, value) {
    if (err) {
      return cb(err)
    }
    cb(null, value.toString())
  })
}

Samizdat.prototype.update = function (version, value, cb) {
  assert.equal(typeof cb, 'function', 'Update callback must be a function')

  if (!ts.validate(version)) {
    return cb({invalidKey: true})
  }

  var doc = ts.getId(version)
  var update = ts.updateKey(version)
  var file = path.join(this._root, doc, update)

  fs.writeFile(file, value, function (err) {
    if (err) {
      return cb(err)
    }
    cb(null, {
      key: update,
      prev: version,
      value: value
    })
  })
}

Samizdat.prototype.del = function (version, cb) {
  assert.equal(typeof cb, 'function', 'Delete callback must be a function')

  var doc = ts.getId(version)
  var file = path.join(this._root, doc, version)

  fs.unlink(file, cb)
}

/**
 * Basic queries
 */
Samizdat.prototype.docs = function (cb) {
  assert.equal(typeof cb, 'function', 'Docs query callback must be a function')

  fs.readdir(this._root, function (err, docs) {
    if (err) {
      return cb(err)
    }
    cb(null, docs)
  })
}

Samizdat.prototype.history = function (doc, cb) {
  assert.equal(typeof doc, 'string' || 'number', 'Document ID must be a string or number')
  assert.equal(typeof cb, 'function', 'Versions query callback must be a function')

  var dir = path.join(this._root, doc)

  fs.readdir(dir, function (err, versions) {
    if (err) {
      return cb(err)
    }
    cb(null, versions)
  })
}
