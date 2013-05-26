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
  log.info('testlingify', 'Initializing your testlingify config at %s', + path.join(dir, file));
  log.info('testlingify', 'In order to set github username and password as well as default testling settings, please edit it.' );
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
    config = require(fullPath);
    log.info('testlingify', 'Loaded testlingify config from ' + fullPath);
    config.location = fullPath;
    cb(null, config);
  } catch (e) {
    initConfig(dir, file, function (err) {
      if (err) return cb(err);
      try {
        // at this point it should have been created
        config = require(fullPath);
        config.location = fullPath;
        cb(null, config);
      } catch (e) {
        // nothing we can do if it is still not there
        cb(err);
      }
    });
  } 
};

