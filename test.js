/* eslint-env mocha */
// 'use strict'
var assert = require('assert')
var gutil = require('gulp-util')
// var path = require('path')
var revFormat = require('./')
var sampleFile1 = new gutil.File({
  cwd: __dirname,
  base: __dirname,
  contents: new Buffer('')
})
var sampleFile2 = new gutil.File({
  cwd: __dirname,
  base: __dirname,
  contents: new Buffer('')
})

sampleFile1.revOrigPath = 'unicorn.css'
sampleFile1.revHash = 'd41d8cd98f'

sampleFile2.revOrigPath = 'unicorn.ext1.ext2.ext3.js'
sampleFile2.revHash = 'd41d8cd98f'

it('should format hash for revved files', function (cb) {
  var stream = revFormat({prefix: '--', suffix: '__'})

  stream.on('data', function (file) {
    assert.equal(file.path, 'unicorn--d41d8cd98f__.css')
    assert.equal(file.revOrigPath, 'unicorn.css')
    cb()
  })

  stream.write(sampleFile1)
})

it('should add formatted hash before last extension', function (cb) {
  var stream = revFormat({lastExt: true})

  stream.on('data', function (file) {
    assert.equal(file.path, 'unicorn.ext1.ext2.ext3-d41d8cd98f.js')
    assert.equal(file.revOrigPath, 'unicorn.ext1.ext2.ext3.js')
    cb()
  })

  stream.write(sampleFile2)
})

it('should keep gulp-rev format by default', function (cb) {
  var stream = revFormat()

  stream.on('data', function (file) {
    assert.equal(file.path, 'unicorn-d41d8cd98f.ext1.ext2.ext3.js')
    assert.equal(file.revOrigPath, 'unicorn.ext1.ext2.ext3.js')
    cb()
  })

  stream.write(sampleFile2)
})
