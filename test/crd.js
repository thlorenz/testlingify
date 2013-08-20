'use strict';
/*jshint asi: true */

// Tests only work in author's environment since password is required to execute them
if (process.env.USER !== 'thlorenz') return;

var test = require('tap').test
var getHook    =  require('../lib/get-testling-hook')
  , createHook =  require('../lib/create-testling-hook')
  , deleteHook =  require('../lib/delete-testling-hook')
  , testHook   =  require('../lib/test-testling-hook')
  , pwd        =  process.env.GITHUB_PWD
  ;

test('given a no testling hook exists for a repo', function (t) {
  t.plan(7)

  t.once('end', function () {
    // cleanup
    deleteHook('thlorenz', pwd, 'thlorenz', 'test-api', function (err, res) { t.end() })
  })

  deleteHook('thlorenz', pwd, 'thlorenz', 'test-api', function (err, res) {
    // may have err if no hook existed, but we don't care

    testHook('thlorenz', pwd, 'thlorenz', 'test-api', function (err, res) {
      t.ok(err, 'testing hook has error')
    })

    createHook('thlorenz', pwd, 'thlorenz', 'test-api', function (err, res) {

      t.notOk(err, 'no error on first creation')
      t.ok(res.created, 'creates hook')

      testHook('thlorenz', pwd, 'thlorenz', 'test-api', function (err, res) {
        t.notOk(err, 'testing hook has no error')
        t.ok(res.sent, 'post sent')
      })

      createHook('thlorenz', pwd, 'thlorenz', 'test-api', function (err, res) {
        t.notOk(err, 'no error on second creation')
        t.notOk(res.created, 'not created again')
      })
    })
  })
})
