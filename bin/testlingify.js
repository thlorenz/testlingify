#!/usr/bin/env node

'use strict';
var path             =  require('path')
  , log              =  require('npmlog')
  , fs               =  require('fs')
  , resolveGitRemote =  require('resolve-git-remote')
  , findParentDir    =  require('find-parent-dir')
  , jsonFile         =  require('json-file-plus')
  , getConfig        =  require('../lib/get-config')
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
    gotRemoteAndConfig(config, uname, repo);
  });
}

function gotRemoteAndConfig(config, uname, repo) {
  checkConfig(config);
  if (config.github.username !== uname) 
    log.warn('testlingify', 'github username found in config: "%s", does not match username of repository: "%s"', config.github.username, uname);

  updatePackage(config);
}

function updatePackage(config) {
  findParentDir(process.cwd(), '.git', function (err, dir) {
    if (err) {
      log.error('testlingify', err);
      process.exit(1);
    }
    if (!dir) {
      log.error('testlingify', 'not sure what happened, but I cannot find your repository root');
      process.exit(1);
    }

    var packageLocation = path.join(dir, 'package.json');
    fs.readFile(packageLocation, 'utf-8', function (err, data) {
      if (err) {
        log.error('testlingify', 'cannot find a package.json in repository root: ' + dir);
        log.error('testlingify', err);
      }

      var p = new jsonFile.JSONFile(data);
      p.set({ testling: config.testling });
      
      // cannot use built in p.save() here since it relies on process.cwd()
      var json = JSON.stringify(p.data, null, p.indent || 2);
      fs.writeFileSync(packageLocation + '.saved', json + (p.trailing ? '\n\n' : '\n'), 'utf-8');
      log.info('testlingify', 'Successfully set testling property in package.json.');
    });
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
