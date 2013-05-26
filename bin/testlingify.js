#!/usr/bin/env node

'use strict';
var log              =  require('npmlog')
  , resolveGitRemote =  require('resolve-git-remote')
  , getConfig        =  require('../lib/get-config')
  , updatePackage    =  require('../lib/update-package')
  , createHook       =  require('../lib/create-testling-hook')
  ;

var task = (function () {
  var arg = process.argv[2];
  if (!arg) return 'hook';

  arg = arg.toLowerCase();
  if (arg === 'test' || arg === 'badge') return arg;

  log.error('testlingify', 'unknown task: ' + arg);
  process.exit(1);
})();

log.info('testlingify', 'task: ', task);


resolveGitRemote(function (err, remote) {
  if (err) {
    log.error('testlingify', err);
    log.error('testlingify', 'Sorry, testingify has to be executed from inside a git repository');
    process.exit(1);
  }
  gotRemote(remote);
});

function gotRemote(remote) {
  var nameRepo = remote.split('/')
    , uname = nameRepo[0]
    , repo = nameRepo[1]
    ;

  getConfig(function (err, config) {
    if (err) {
      log.error('testlingify', err);
      process.exit(1);
    }
    checkConfig(config);
    gotRemoteAndConfig(config, uname, repo);
  });
}

function gotRemoteAndConfig(config, uname, repo) {
  if (config.github.username !== uname) 
    log.warn('testlingify', 'github username found in config: "%s", does not match username of repository: "%s"', config.github.username, uname);

  updatePackage(config, createTestlingHook.bind(null, config, uname, repo));
}

function createTestlingHook(config, uname, repo) {
  var gh = config.github;
  createHook(gh.username, gh.password, uname, repo, function (err) {
    if (err) { 
      log.error('testlingify', 'Encountered error when testling hook for %s/%s as %s', uname, repo, config.github.username);
      return log.error('testlingify', err);
    }

    log.info('testlingify', 'Successfully created testling hook for %s/%s as %s', uname, repo, config.github.username);
  });
}

function checkConfig(config) {
  function tellToEditAndExit(problem) {
    log.error('testlingify', problem);
    log.error('testlingify', 'Please edit the testlingify config to correct this.');
    process.exit(1);
  }

  var github = config.github;
  if (!github) tellToEditAndExit('No github config found!');
  if (!github.username || github.username.length === 0) tellToEditAndExit('github username missing!');
  if (!github.password || github.password.length === 0) tellToEditAndExit('github password missing!');
  if (!config.testling) tellToEditAndExit('testling config missing');
}
