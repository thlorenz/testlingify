'use strict';
/*jshint asi: true */

// Tests only work in author's environment since password is required to execute them
// NOTE: change/remove this if you want to run these tests
if (process.env.USER !== 'thlorenz') return;

var test = require('tap').test
var getHook = require('../lib/get-testling-hook')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

// NOTE: in order to make these tests pass, please change thlorenz/brace and thlorenz/proxyquire to
// repos use testling and/or at least that you have access to
// Additionally set $GITHUB_PWD in your environment to your github password

test('get testling hook existing repo with testling hook', function (t) {
  getHook('thlorenz', process.env.GITHUB_PWD, 'thlorenz', 'brace', function (err, hook) {
    if (err) { inspect(err); t.fail(err); return t.end(); }
    t.equals(hook.config.url, 'http://git.testling.com')
    t.end()
  });
})

test('get testling hook existing repo without testling hook', function (t) {
  getHook('thlorenz', process.env.GITHUB_PWD, 'thlorenz', 'proxyquire', function (err, hook) {
    if (err) { inspect(err); t.fail(err); return t.end(); }
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
