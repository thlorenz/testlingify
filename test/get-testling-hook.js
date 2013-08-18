'use strict';
/*jshint asi: true */

// Tests only work in author's environment since password is required to execute them

var test = require('tape')
var getHook = require('../lib/get-testling-hook')

test('get testling hook existing repo with testling hook', function (t) {
  getHook('thlorenz', process.env.GITHUB_PWD, 'thlorenz', 'brace', function (err, hook) {
    t.notOk(err, 'no error')
    t.equals(hook.config.url, 'http://git.testling.com')
    t.end()
  });
})

test('get testling hook existing repo without testling hook', function (t) {
  getHook('thlorenz', process.env.GITHUB_PWD, 'thlorenz', 'proxyquire', function (err, hook) {
    t.notOk(err, 'no error')
    t.notOk(hook, 'no hook')
    t.end()
  });
})

test('get testling hook of non-existing repo', function (t) {
  getHook('thlorenz', process.env.GITHUB_PWD, 'thlorenz', 'microsoft-opensource-module', function (err, hook) {
    t.ok(err, 'error')
    t.notOk(hook, 'no hook')
    t.end()
  });
})
