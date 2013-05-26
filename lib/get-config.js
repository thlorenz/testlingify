'use strict';
var fs     =  require('fs')
  , path   =  require('path')
  , mkdirp =  require('mkdirp')
  , log    =  require('npmlog');

function copy(srcFile, tgtFile, cb) {
  var readStream = fs.createReadStream(srcFile)
    , writeStream = fs.createWriteStream(tgtFile); 

  writeStream
    .on('close', cb)
    .on('error', cb); 

  readStream
    .on('error', cb);

  readStream.pipe(writeStream);
}

function initConfig(dir, file, cb) {
  log.info('testlingify', 'initializing your testlingify config');
  log.info('testlingify', 'in order to set github username and password and testling settings, please edit ' + path.join(dir, file));
  mkdirp(dir, function (err) {
    if (err) return cb(err);
    copy(require.resolve('./default-config'), path.join(dir, file), cb);
  });
}

module.exports = function (cb) {
  var dir = path.join(process.env.HOME, '.config')
    , file = 'testlingify.js'
    , fullPath = path.join(dir, file)
    , config;

  try {
    log.info('testlingify', 'Loading testlingify config from ' + fullPath);
    config = require(fullPath);
    cb(null, config);
  } catch (e) {
    initConfig(dir, file, function (err) {
      if (err) return cb(err);
      try {
        // at this point it should have been created
        config = require(fullPath);
        cb(null, config);
      } catch (e) {
        // nothing we can do if it is still not there
        cb(err);
      }
    });
  } 
};

