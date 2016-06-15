'use strict'
var gutil = require('gulp-util')
var modifyFilename = require('modify-filename')
var objectAssign = require('object-assign')
var through = require('through2')

var defaults = {
  prefix: '-',
  suffix: '',
  lastExt: false
}

function decorateHash (hash, pre, sfx) {
  return pre + hash + sfx
}

module.exports = function (opts) {
  opts = objectAssign({
    prefix: defaults.prefix,
    suffix: defaults.suffix,
    lastExt: defaults.lastExt
  }, opts)

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file)
      return
    }

    // Search for file.revOrigPath and file.revHash that would have been added by gulp-rev
    if ((typeof file.revOrigPath === 'undefined') || (typeof file.revHash === 'undefined')) {
      cb(new gutil.PluginError('gulp-rev-format', 'File was not passed through "gulp-rev"'))
      return
    }

    // Decorate hash
    var hash = decorateHash(file.revHash, opts.prefix, opts.suffix)

    // Write the new file path
    file.path = modifyFilename(file.revOrigPath, function (filename, extension) {
      if (opts.lastExt) {
        return filename + hash + extension
      } else {
        var extIndex = filename.indexOf('.')

        // Build new filename
        filename = extIndex === -1 ? filename + hash
          : filename.slice(0, extIndex) + hash + filename.slice(extIndex)

        return filename + extension
      }
    })

    // send back to stream
    cb(null, file)
  }, function (cb) {
    cb()
  })
}
