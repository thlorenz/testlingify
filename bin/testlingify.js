#!/usr/bin/env node

'use strict';
var log              =  require('npmlog')
  , resolveGitRemote =  require('resolve-git-remote')
  , fs               =  require('fs')
  , getConfig        =  require('../lib/get-config')
  , updatePackage    =  require('../lib/update-package')
  , createHook       =  require('../lib/create-testling-hook')
  , testHook         =  require('../lib/test-testling-hook')
  ;

var task = (function () {
  var arg = process.argv[2];
  if (!arg) return 'hook';

  arg = arg.toLowerCase();
  if (arg === 'test' || arg === 'badge') return arg;

  if (arg === "-h" || arg === "--help") {
    console.log(
      'usage: testlingify            (adds testling hook to github and testling config to package.json)\n' +
      '       testlingify test       (tests testling github hook)\n' +
      '       testlingify badge      (prints testling badge)');

    process.exit(0);
  }

  log.error('testlingify', 'unknown task: ' + arg);
  process.exit(1);
})();

if (task === 'hook') {
  log.info('testlingify', 'Adding testling config to your package and creating testling hook on your github repository');
}
if (task === 'test') {
  log.info('testlingify', 'Testing testling hook on your github repository');
}

resolveGitRemote(function (err, remote) {
  if (err) {
    log.error('testlingify', err);
    log.error('testlingify', 'Sorry, testingify has to be executed from inside a git repository');
    process.exit(1);
  }
  gotRemote(remote);
});

function gotRemote(remote) {
  var ownerRepo = remote.split('/')
    , owner = ownerRepo[0]
    , repo = ownerRepo[1]
    ;

  if (task === 'badge')
    return console.log(
      '[![testling badge](https://ci.testling.com/' + owner + '/' + repo + '.png)]' +
      '(https://ci.testling.com/' + owner + '/' + repo + ')'
    );

  getConfig(function (err, config) {
    if (err) {
      log.error('testlingify', err);
      process.exit(1);
    }

    checkConfig(config);
    gotRemoteAndConfig(config, owner, repo);
  });
}

function gotRemoteAndConfig(config, owner, repo) {
  if (config.github.username !== owner)
    log.warn('testlingify', 'github username found in config: "%s", does not match username of repository: "%s"', config.github.username, owner);

  if (task === 'hook')
    return updatePackage(config, createTestlingHook.bind(null, config, owner, repo));
  if (task === 'test')
    return testTestlingHook(config, owner, repo);

  log.error('testlingify', 'Unknown task: %s. Try "testlingify" or "testlignify test" or "testlingify badge"', task);
}

function createTestlingHook(config, owner, repo) {
  var gh = config.github;
  createHook(gh.username, gh.password, owner, repo, function (err, hook) {
    if (err) {
      log.error('testlingify', 'Encountered error when testling hook for %s/%s as %s', owner, repo, config.github.username);
      return log.error('testlingify', err);
    }

    return hook.created
      ? log.info('testlingify', 'Successfully created testling hook for %s/%s as %s', owner, repo, config.github.username)
      : log.warn('testlingify', 'Did not create testling hook for %s/%s as %s because it already exists', owner, repo, config.github.username);
  });
}

function testTestlingHook(config, owner, repo) {
  var gh = config.github;
  testHook(gh.username, gh.password, owner, repo, function (err, hook) {
    if (err) return log.error('testlingify', err.message);
    if (hook.sent) return log.info('testlingify', hook.message);
    log.warn('testlingify', 'Although no error occurred, a post to your testling hook could not be properly sent');
  });
}

function checkConfig(config) {

  function tellToEditAndExit(problem) {
    log.error('testlingify', problem);
    log.error('testlingify', 'Please edit the testlingify config at %s to correct this.', config.location);
    process.exit(1);
  }

  if (!config.testling) tellToEditAndExit('testling config missing!');
}
