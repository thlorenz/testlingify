'use strict';
/*jshint asi: true */

var test   =  require('tap').test
var update =  require('../lib/update-package')
var fs     =  require('fs')
var path   =  require('path')

var rootDir     =  path.join(__dirname, 'fixtures', 'root-dir')
var packagePath =  path.join(rootDir, 'package.json')
var gitdir = path.join(rootDir, '.git')

var samplePack = require('./fixtures/samplePackage')
var config = {
  testling: {
      files: 'test/*.js'
    , browsers: [
        'ie/8..latest',
        'chrome/22..latest'
      ]
  }
}

function setup () {
  // .git dir is used to find root of package that we are testlingifying
  if (!fs.existsSync(gitdir)) fs.mkdirSync(gitdir);
  var json = JSON.stringify(samplePack, null, 2);
  fs.writeFileSync(packagePath, json, 'utf8');
}

function checkUpdated (t) {
  var updated = require(packagePath);
  var updatedJSON = fs.readFileSync(packagePath, 'utf8')

  t.deepEqual(
      updated.testling
    , { files: 'test/*.js',
        browsers: [ 'ie/8..latest', 'chrome/22..latest' ] }
    , 'adds testling config'
  )
  t.deepEqual(
      updated.author
    , { name: 'Thorsten Lorenz',
        email: 'thlorenz@gmx.de',
        url: 'http://thlorenz.com' }
    , 'maintains author info'
  )
  t.deepEqual(
      updated.keywords
    , [ 'testling', 'browserling' ]
    , 'maintains keywords'
  )
  t.equal(updatedJSON.trim('\n'), JSON.stringify(updated, null, 2), 'maintains indentation')
}

test('\ngiven I have a package without testling data and update it', function (t) {
  setup()

  t.on('end', function () { 
    if (fs.existsSync(gitdir)) fs.rmdirSync(gitdir) 
  })

  update(rootDir, config, function (err) {
    if (err) return t.fail(err);

    checkUpdated(t);
    t.end()
  });
})

test('\ngiven I have a package without testling data and update it from inside a sub dir', function (t) {
  setup()

  t.on('end', function () { 
    if (fs.existsSync(gitdir)) fs.rmdirSync(gitdir) 
  })

  update(path.join(rootDir, 'sub-dir'), config, function (err) {
    if (err) return t.fail(err);

    checkUpdated(t);
    t.end()
  });
})
