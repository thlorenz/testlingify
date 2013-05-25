#!/usr/bin/env node

'use strict';
var path             =  require('path')
  , fs               =  require('fs')
  , resolveGitRemote =  require('resolve-git-remote')
  , findParentDir    =  require('find-parent-dir')
  , jsonFile         =  require('json-file-plus')
  ;

var task = (function () {
  var arg = process.argv[2];
  if (!arg) return 'hook';

  arg = arg.toLowerCase();
  if (arg === 'test' || arg === 'badge') return arg;

  console.error('unknown task: ' + arg);
  process.exit(1);
})();

console.error('task: ', task);


resolveGitRemote(function (err, remote) {
  if (err) {
    console.error(err);
    console.error('Sorry, testingify has to be executed from inside a git repository');
    process.exit(1);
  }
  gotRemote(remote);
});

function gotRemote(remote) {
  var nameRepo = remote.split('/')
    , uname = nameRepo[0]
    , repo = nameRepo[1]
    ;
  
  if (task === 'hook') {
    updatePackage();
  }
}

function updatePackage() {
  findParentDir(process.cwd(), '.git', function (err, dir) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    if (!dir) {
      console.error('not sure what happened, but I cannot find your repository root');
      process.exit(1);
    }

    var packageLocation = path.join(dir, 'package.json');
    fs.readFile(packageLocation, 'utf-8', function (err, data) {
      if (err) {
        console.error('cannot find a package.json in repository root: ' + dir);
        console.error(err);
      }

      var p = new jsonFile.JSONFile(data);
      
      // cannot use built in p.save() here since it relies on process.cwd()
      var json = JSON.stringify(p.data, null, p.indent || 2);
      fs.writeFileSync(packageLocation + '.saved', json + (p.trailing ? '\n\n' : '\n'), 'utf-8');
    });
  });
}

function savePackage(p) {
}


