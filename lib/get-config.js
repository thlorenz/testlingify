'use strict';

var configurate =  require('configurate')
  , promfig     =  require('promfig')
  , log         =  require('npmlog')
  , path        =  require('path');

var properties = {
    username  :  'Please enter your username :  '
  , password  :  'Please enter your password (or access token) :  '
  , '@secret' :  'password'
};

function edit (config, cb) {
  // if username and password are already defined promfig calls right back without bothering the user
  promfig(properties, config.github || {}, function (err, configuredGithub) {
    if (err) return cb(err);

    config.github = configuredGithub;
    cb(null, config);
  });
}

module.exports = function (cb) {

  var configDir     =  path.join(process.env.HOME, '.config')
    , configFile    =  'testlingify.js'
    , defaultConfig =  require.resolve('./default-config')

    configurate(
      { configDir     :  configDir
      , configFile    :  configFile
      , defaultConfig :  defaultConfig
      , edit          :  edit
      }
    , function (err, config, configPath) {
        config.location = configPath;
        cb(err, config);
      }
  )
  .on('copied-default', function (_, tgt) {
    log.info('testlingify', 'Initializing your testlingify config at %s', tgt);
  })
  .on('loaded-config', function (path, conf) {
    log.info('testlingify', 'Loaded testlingify config from ', path);
  });
};

